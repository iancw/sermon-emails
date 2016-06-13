require 'yaml'
require 'date'
require 'net/http'
require 'net/smtp'

class Sermon
  attr_accessor :date, :passage, :title, :text
  def initialize hash, text
    @date = hash['date']
    @passage = hash['passage']
    @title = hash['title']
    @text = text
  end

  def subject
    "Sermon for #{date}: #{title}"
  end
end

class Contact
  attr_accessor :name, :email

  def initialize name, email
    @name = name
    @email = email
  end
end

class LocalEmailer
  def initialize args
    @server = args[:server] or raise ArgumentError.new('Must specify server')
  end

  def send message, sender, recipient
    Net::SMTP.start(@server) do |smtp|
      smtp.send_message message, sender, recipient
    end
  end
end

class AmazonEmailer
  def initialize args
    @server = args[:server] or raise ArgumentError.new('Must specify server')
    @username = args[:username] or raise ArgumentError.new('Must specify username')
    @password = args[:password] or raise ArgumentError.new('Must specify password')
    @helo_domain = args[:helo_domain] or raise ArgumentError.new('Must specify helo_domain')
    @port = args[:port] || 587
  end

  def send message, sender, recipient
    smtp = Net::SMTP.new @server, @port
    smtp.enable_starttls
    smtp.open_timeout = 120
    smtp.start @helo_domain, @username, @password, :login do
      smtp.send_message message, sender, recipient
    end
  end
end

def urlify passage
  passage.gsub(/ /, '+')
end

def find_next_sermon upcoming
  current_date = Date.today
  upcoming.each do |sermon|
    sermon_date = Date.strptime(sermon['date'], '%B %e')
    if sermon_date >= current_date
      return sermon
    end
  end
  raise 'Unable to find any upcoming sermons'
end

def esv_url esv_key, passage
  query_params = { :key => esv_key,
                   :passage => urlify(passage),
                   'include-headings' => false,
                   'include-verse-numbers' => false,
                   'include-footnotes' => false,
                   'include-footnote-links' => false}

  query = query_params.map{ |k, v| "#{k}=#{v}" }.join('&')
  "http://www.esvapi.org/v2/rest/passageQuery?#{query}"
end

def upcoming_sermon esv_key
  upcoming = YAML.load_file('upcoming.yml')
  sermon_hash = find_next_sermon upcoming
  url = esv_url esv_key, sermon_hash['passage']
  text = Net::HTTP.get(URI.parse(url))
  Sermon.new sermon_hash, text
end

def all_css
  files = ['styles/esv.css', 'styles/mail.css']
  content = files.map { |s_file| File.open(s_file, 'rb').read }
  content.join("\n")
end

def build_content text
  content = <<CONTENT_END
  <!DOCTYPE html>
  <html>
  <head>
    <style>
    #{all_css}
    </style>
  </head>
  <body>
  #{text}
  </body>
  </html>
CONTENT_END

  content
end

def send_message args
  sender = args[:sender] or raise ArgumentError.new('Must supply sender')
  recipient = args[:recipient] or raise ArgumentError.new('Must supply recipient')
  sermon = args[:sermon] or raise ArgumentError.new('Must supply sermon')
  emailer = args[:emailer] or raise ArgumentError.new('Must supply emailer')

  puts "Sending message to #{recipient.name}..."

  message = <<MESSAGE_END
From: #{sender.name} <#{sender.email}>
To: #{recipient.name} <#{recipient.email}>
MIME-Version: 1.0
Content-type: text/html
Subject: #{sermon.subject}

#{build_content sermon.text}

MESSAGE_END

  emailer.send message, sender.email, recipient.email
end

def load_recipients yml_file
  YAML.load_file(yml_file).map{ |r| Contact.new(r['name'], r['email']) }
end

def run
  props = YAML.load_file('config.yml')
  sender = Contact.new(props['from_name'], props['from_email'])
  esv_key = props['esv_key']
  server = props['server']

  sermon = upcoming_sermon esv_key
  recipients = load_recipients 'recipients.yml'
  recipients.each do | recipient|
    send_message(:recipient => recipient,
                 :sermon => sermon,
                 :sender => sender,
                 :emailer => LocalEmailer.new(:server => server))
  end
end

run
