const emailer = require('./emailer');
const subscriber = require('./subscriber');

module.exports = {
    emailerHandler: emailer.handler,
    subscriberHandler: subscriber.handler,
};
