# Sermon Emails

A node program that sends emails with the contents of a passage to an upcoming sermon.

Recipients are defined in `_recipients_private.json`, upcoming sermons are defined in `upcoming.yml`, program configuration
is stored in `config.yml`.  Text is retrieved using the ESV API.

The program is designed to be run in AWS lambda via the `handler` entry point function in `aws-driver.js`. The code can also be run outside of AWS by calling `sendEmails()` defined in `send-email.js`.

## Initial Setup

 0. Set up the AWS CLI following [these instructions](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-set-up.html)
 1. Create one S3 bucket for private configuration (e.g. AWS keys), and another for canonical YAML data including recipients and upcoming sermons
 2. Update config samples in the `config` folder and put all files there (e.g. `_recipients_private.json`, `_ses_private.yml`, `config.yml`, and `upcoming.yml`
 3. Create an S3 bucket to hold the full build
 4. Run `./bin/deploy <config bucket> <code bucket>`, this will pull down config from the S3 config bucket, merge it with your code, and upload it to the S3 code bucket
 5. Configure a lambda function
  1. Use the URL of the S3 code bucket on the Code tab
  1. Use Node.js 4.3 as the runtime
  1. Use `aws-driver.handler` as the Handler
  1. Set up roles per your preference
  1. Set up a CloudWatch Event to schedule the function, I used `cron(0 9 ** ? *)` to configure an email every morning at 5am Eastern time

## Updating Recipients or Sermon Schedule

Updating the recipients involves updating a file named `_recipients_private.json` in the s3 bucket configured for "data."
Follow these steps to update either recipients or upcoming sermons.

 1. Pull down canonical YAML data via `aws s3 sync s3://live-data-bucket tmp-folder`
 2. Manually update the contents of `_recipients_private.json` and `upcoming.yml`
 3. Sync those updates back to the canonical source via `aws s3 sync tmp-folder s3://live-data-bucket`

 The emailer will fetch the updates next time it runs, no need to re-deploy code!

## Deploying Code

 1. Run `./bin/deploy <config bucket> <code bucket>`
 2. In the AWS Lambda web interface, update the lambda function with S3 URL for the code bucket

## Ideas for the Future

 [] It would be neat for people to choose when and how often to receive emails, and to opt-in / opt-out via email or web UI
 [] Replace tape with ava
 [] Add end-to-end tests
 [] Chunking large passages so they can be read day-by-day instead of all at once
 [] Passages could be stored locally, since it's the same query every day for a week
 [] It would be neat to scrape web pages for sermon listings to avoid the need to manually update upcoming.yml
 [x] Would HTML emails be prettier?
 [] Add behavioral motivators by tracking reads (via reply?) against others' reads, or collecting comments

## Automatic subscribe / unsubscribe

This would require a web or email-based interface which takes as input a name/email recipient and whether
they want to be added or removed from the list. It produces a side-effect of writing or removing that recipient
from the master list, and probably sending an email to confirm/inform of the action taken.

Email based subscribe/unsubscribe is probably simplest, and consistent with the other medium. The subscription
manager could run at the same time as the daily email. It could scan emails received in the SES inbox for certain
keywords and update the recipients list accordingly.

So the emails are currently stored in an S3 bucket. The program would need to read these

- List all emails in S3 bucket
- Process each file (or only process new files?)
  - If email is NOT to the sermons@ address, skip
  - If email
