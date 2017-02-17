import {
  validatePresence,
  validateFormat,
} from 'ember-changeset-validations/validators';
// import validateCustom from '../validators/custom'; // local validator example
export default {
  email: [
    validatePresence(true),
    validateFormat({ type: 'email' })
  ],
  password: validatePresence(true),
}