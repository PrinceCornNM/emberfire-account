// validations/password.js
import {
  validatePresence,
  validateLength,
  validateConfirmation
} from 'ember-changeset-validations/validators';

export default {
  currentPassword: [
    validatePresence(true)
  ],
  newPassword: [
    validatePresence(true),
    validateLength({ min: 8, allowBlank: true })
  ],
  newPasswordConfirmation: validateConfirmation({ on: 'newPassword', message: 'New password confirmation doesn\'t match new password' })
};