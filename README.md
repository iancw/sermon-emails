### Sermon Emails

A node program that sends emails with the contents of a passage to an upcoming sermon.

Recipients are defined in _recipients_private.yml, upcoming sermons are defined in upcoming.yml, program configuration
is stored in config.yml.  Text is retrieved using the ESV API.

The program is designed to be run in AWS lambda via the `handler` entry point function in aws-driver.js. The code can also be run outside of AWS by calling `sendEmails()` defined in send-email.js.

### Setup Instructions

 1. Update `config/config.yml` with desired sender information and ESV key
 2. Copy `config/recipients_example.yml` to `config/_recipients_private.yml` and update with real contacts
 3. Copy `config/ses_example.yml` to `config/_ses_private.yml` and fill in your AWS SES account information
 3. Populate `config/upcoming.yml` with desired passages
 4. Run `build-zip.sh`
 5. Upload build/build.zip to AWS Lambda
 6. Configure the handler in Lambda as `aws-driver.handler`

### Ideas for the Future

 * Passages could be stored locally, since it's the same query every day for a week
 * It would be neat for people to choose when and how often to receive emails, and to opt-in / opt-out via email or web UI
 * It would be neat to scrape web pages for sermon listings to avoid the need to manually update upcoming.yml
 * Would HTML emails be prettier?
 * Add behavioral motivators by tracking reads (via reply?) against others' reads, or collecting comments
