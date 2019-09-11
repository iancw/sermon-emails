const isSubscribing = (record) => /^subscribe$/i.test(getSubject(record));

const isUnsubscribing = (record) => /^unsubscribe$/i.test(getSubject(record));

const actions = {
    ADD: 'ADD',
    REMOVE: 'REMOVE',
    SKIP: 'SKIP',
    ERROR: 'ERROR',
};

const get = (obj, path) => {
  const segments = path.split('.');
  if (!obj) return;
  if (!path) return;
  if (segments.length < 1) return;
  let cur = obj;
  for(let i=0; i<segments.length; i++) {
    cur = cur[segments[i]];
    if (!cur) {
      return;
    }
  }
  return cur;
}

const getNameAndEmail = (record) => {
  const from = get(record, 'ses.mail.commonHeaders.from');
  if (from && from.length > 0) {
    const match = /([^<>]*)<(.*@.*)>/.exec(from[0]);
    return {
      name: match[1].trim(),
      email: match[2].trim(),
    };
  }

  return {
    email: get(record, 'ses.mail.source'),
  };
}

const getSubject = (record) => get(record, 'ses.mail.commonHeaders.subject');

const doSubscribe = ({name, email}) => {
  if (!email) {
    return {
      action: actions.ERROR,
      info: {
        message: 'No email address found'
      }
    }
  }
  return {
    action: actions.ADD,
    recipient: {name, email},
  };
}

const doUnsubscribe = ({name, email}) => {
  if (!email) {
    return {
      action: actions.ERROR,
      info: {
        message: 'No email address found'
      }
    }
  }
  return {
    action: actions.REMOVE,
    recipient: {name, email},
  };
}

const createActions = (record) => {
    if (isSubscribing(record)) {
      return doSubscribe(getNameAndEmail(record));
    } else if (isUnsubscribing(record)) {
      return doUnsubscribe(getNameAndEmail(record));
    } else {
      return {
        action: actions.SKIP,
      }
    }
};

module.exports = {
    isSubscribing,
    isUnsubscribing,
    createActions,
    isAdd: ({action}) => actions.ADD === action,
    isRemove: ({action}) => actions.REMOVE === action,

};
