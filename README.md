# Sermon Emails

A node program that sends emails with the contents of a passage to an upcoming sermon.

Recipients are defined in a JSON file and managed through email and automated email-based subscribe/unsubscribe workflow.
Upcoming sermons are scraped from the master source, program configuration comes from environment variables.  Text is retrieved using the ESV API.

## Initial Setup

 0. Set up the AWS CLI following [these instructions](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-set-up.html)
 1. Create an S3 bucket to store the master list of recipients
 3. Create an S3 bucket to hold the full build
 4. Run `./bin/deploy <config bucket> <code bucket>`, this will pull down config from the S3 config bucket, merge it with your code, and upload it to the S3 code bucket
 5. Configure a lambda function to be run daily
  1. Use the URL of the S3 code bucket on the Code tab
  1. Use Node.js 10 or 12 as the runtime
  1. Use the `handler` function exported from `src/emailer/index.js`
  1. Set up roles per your preference
  1. Set up environment variables for everything in sample.env
  1. Set up a CloudWatch Event to schedule the function, I used `cron(0 9 ** ? *)` to configure an email every morning at 5am Eastern time

## Updating Recipients or Sermon Schedule

1. Set up a separate AWS Lambda function triggered by email receipt
1. Use the exported `handler` function from `src/subscriber/index.js` as the main handler
1. Set up roles & environment variables as with the daily emailer

## Deploying Code

 1. Run `./bin/deploy <config bucket> <code bucket>`
 2. In the AWS Lambda web interface, update the lambda function with S3 URL for the code bucket

## Ideas for the Future

 [x] It would be neat for people to choose when and how often to receive emails, and to opt-in / opt-out via email or web UI
 [x] Replace tape with ava
 [x] Add end-to-end tests
 [] Chunking large passages so they can be read day-by-day instead of all at once
 [] Passages could be stored locally, since it's the same query every day for a week
 [x] It would be neat to scrape web pages for sermon listings to avoid the need to manually update upcoming.yml
 [x] Would HTML emails be prettier?
 [] Add behavioral motivators by tracking reads (via reply?) against others' reads, or collecting comments

