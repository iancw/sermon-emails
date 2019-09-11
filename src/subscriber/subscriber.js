
const {createActions, isRemove, isAdd} = require('./actions');

const handleUnsubscribes = ({actions, recipients, sideEffect}) => {
  const shouldKeep = (recipient) => {
    const willRemove = actions.find((action) => isRemove(action) && action.recipient.email === recipient.email);
    if (willRemove) {
      sideEffect({
        ...willRemove,
        recipient,
      });
    }
    return !willRemove;
  }

  return recipients.filter(shouldKeep);
}

const handleSubscribes = ({actions, recipients, sideEffect}) => {
  const alreadySubscribed = ({recipient}) => recipients.find((existing) => existing.email === recipient.email);

  const newRecipients = actions.map((action) => {
    if (isAdd(action) && !alreadySubscribed(action)) {
      sideEffect({
        ...action,
        recipient: action.recipient,
      })
      return action.recipient;
    } else {
      return undefined;
    }
  }).filter(newRecip => !!newRecip);

  return recipients.concat(newRecipients);
};

const updateList = (opts) => {
  const recipients = handleSubscribes(opts);
  return handleUnsubscribes({...opts, recipients: recipients});
};

const updateRecipients = ({event, recipients}) => {
  const actions = event.Records.map(createActions);

  const effects = [];

  return {
    recipients: updateList({
      actions,
      recipients,
      sideEffect: (effect) => effects.push(effect)
    }),
    effects,
  };
}

module.exports = {
  updateRecipients,
  updateList,
}
