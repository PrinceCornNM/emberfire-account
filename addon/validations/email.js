// validations/email.js
import {
  validatePresence,
  // validateFormat,
  // validateLength,
  validateConfirmation
} from 'ember-changeset-validations/validators';
import validateEmail from '../validators/email';

export default {
  email: [
    validatePresence(true),
    validateEmail({type: 'email', message: "E-mail must be a valid email address" })
  ],
  emailConfirmation: validateConfirmation({ on: 'email' })
};
