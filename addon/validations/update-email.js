// validations/update-email.js - the validatior for the update-email component

import {
  validatePresence,
  validateConfirmation
} from 'ember-changeset-validations/validators';

import validateEmail from '../validators/email';

export default {
  currentPassword: [
    validatePresence(true)
  ],
  email: [
    validatePresence(true),
    validateEmail({ type: 'email', message: 'New email must be a valid email address', allowBlank: true })
  ],
  emailConfirmation: validateConfirmation({ on: 'email', message: 'New email confirmation doesn\'t match new email' })
};
