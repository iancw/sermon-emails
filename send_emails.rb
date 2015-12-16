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
    "Sermon for #{date}: #{passage} - #{title}"
  end
end

class Contact
  attr_accessor :name, :email

  def initialize name, email
    @name = name
    @email = email
  end
end

def urlify passage
  passage.gsub(/ /, '+')
end

def find_next_sermon upcoming
  current_date = DateTime.now
  upcoming.each do |sermon|
    sermon_date = Date.strptime(sermon['date'], '%B %e')
    if sermon_date > current_date
      return sermon
    end
  end
  raise 'Unable to find any upcoming sermons'
end

def upcoming_sermon esv_key
  upcoming = YAML.load_file('upcoming.yml')
  sermon_hash = find_next_sermon upcoming
  text = Net::HTTP.get(URI.parse("http://www.esvapi.org/v2/rest/passageQuery?key=#{esv_key}&passage=#{urlify(sermon_hash['passage'])}&include-headings=false"))
  Sermon.new sermon_hash, text
end

def send_message args
  sender = args[:sender] or raise ArgumentError.new('Must supply sender')
  recipient = args[:recipient] or raise ArgumentError.new('Must supply recipient')
  sermon = args[:sermon] or raise ArgumentError.new('Must supply sermon')
  server = args[:server] or raise ArgumentError.new('Must specify server')

  puts "Sending message to #{recipient.name}..."

  message = <<MESSAGE_END
From: #{sender.name} <#{sender.email}>
To: #{recipient.name} <#{recipient.email}>
MIME-Version: 1.0
Content-type: text/html
Subject: #{sermon.subject}

#{sermon.text}

MESSAGE_END

  Net::SMTP.start(server) do |smtp|
      smtp.send_message message, sender.email, recipient.email
  end
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
                 :server => server)
  end
end

run
