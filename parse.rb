require 'yaml'
require 'net/http'
require 'date'

KEY='IP'

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

upcoming = YAML.load_file('upcoming.yml')
sermon = find_next_sermon upcoming
text = Net::HTTP.get(URI.parse("http://www.esvapi.org/v2/rest/passageQuery?key=#{KEY}&passage=#{urlify(sermon['passage'])}&include-headings=false"))

puts text
