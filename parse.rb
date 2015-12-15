require 'yaml'
upcoming = YAML.load_file('upcoming.yml')
puts upcoming.inspect
