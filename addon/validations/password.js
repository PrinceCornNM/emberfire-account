// validations/password.js
import {
  validatePresence,
  validateLength,
  validateConfirmation,
} from 'ember-changeset-validations/validators';

export default {
  password: [
    validatePresence(true),
    validateLength({ min: 8 })
  ],
  passwordConfirmation: validateConfirmation({ on: 'password' })
};