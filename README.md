### Sermon Emails

A program that sends emails with the contents of a passage to an upcoming sermon.

Recipients are defined in recipients.yml, upcoming sermons are defined in upcoming.yml, program configuration
is stored in config.yml.  Text is retrieved using the ESV API.

Running the program `ruby send_emails.rb` parses upcoming.yml, finds the next sermon, looks up the text from esvapi.org, parses recipients from
recipients.yml and sends the text as an email to each.

### Setup Instructions

 1. Update `config.yml` with desired sender information and ESV key
 2. Populate `recipients.yml` with desired recipients
 3. Populate `upcoming.yml` with desired passages
 4. Run `ruby send_emails.rb` from root folder

### Ideas for the Future

 * Passages could be stored locally, since it's the same query every day for a week
 * There might be a corner case with the selected passage on the day of the sermon; it may send next weeks sermon on Sunday, which isn't helpful
 * It would be neat for people to choose when and how often to receive emails, and to opt-in / opt-out via email or web UI
 * It would be neat to scrape web pages for sermon listings to avoid the need to manually update upcoming.yml
 * Would HTML emails be prettier?
 * Add behavioral motivators by tracking reads (via reply?) against others' reads, or collecting comments
