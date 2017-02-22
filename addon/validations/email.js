// validations/email.js
import {
  validatePresence,
  validateFormat,
  // validateLength,
  validateConfirmation,
} from 'ember-changeset-validations/validators';

export default {
  email: [
    validatePresence(true),
    validateFormat({type: 'email'})
  ],
  emailConfirmation: validateConfirmation({ on: 'email' })
};
