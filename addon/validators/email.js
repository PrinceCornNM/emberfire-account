import Ember from 'ember';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';
const { isEmpty, assert, typeOf } = Ember;

const emailRegex = {
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
};

export default function validateEmail(options = {}) {
  let { allowBlank, type, regex, inverse = false } = options;

  assert('inverse options should be a boolean', typeOf(inverse) === 'boolean');

  return (key, value) => {
    if (allowBlank && isEmpty(value)) {
      return true;
    }

    if(!regex && type) {
      regex = emailRegex[type];
    }

    if (regex && (regex.test(value) === inverse)) {
      if (type && !inverse) {
        return buildMessage(key, type, value, options);
      }
      return buildMessage(key, 'invalid', value, options);
    }

    return true;
  };
}

