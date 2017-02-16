// validations/email.js
import {
  validatePresence,
  validateLength,
  validateConfirmation,
} from 'ember-changeset-validations/validators';

export default {
  email: [
    validatePresence(true),
    validateLength({ min: 8 }),
  ],
  emailConfirmation: validateConfirmation({ on: 'email' })
};
