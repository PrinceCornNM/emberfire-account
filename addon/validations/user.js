import {
  validatePresence,
  validateLength,
  validateFormat,
  validateConfirmation
} from 'ember-changeset-validations/validators';
// import validateCustom from '../validators/custom'; // local validator example
export default {
  u /* UID */ : [
    validatePresence({
      presence: true,
      message: '${description} should be present'
    })
  ],
  e /* Email */ : [
    validatePresence(true),
    validateFormat({ type: 'email' })
  ],
  f /* First Name */ : [
    validateLength({ min: 2 })
  ],
  l /* Last Name */ : [
    validateLength({ min: 2 })
  ],
  a /* Address */ : [
    validateLength({ min: 4 })
  ],
  t /* Town/City */ : [
    validateLength({ min: 2 })
  ],
  z /* Zipcode */ : [
    validateLength({ min: 4 })
  ],
  s /* State/Province */ : [
    validateLength({ min: 2 })
  ],
  c /* Country */ : [
    validateLength({ min: 2 })
  ],
  b /* Birthdate */ : [
    validateLength({ min: 4 })
  ],
  p /* Phone */ : [
    validateFormat({
      type: 'phone',
      allowBlank: true
    }),
    validateLength({ min: 7 })
  ],
  password: validatePresence(true),
  passwordConfirmation: [
    validatePresence(true),
    validateConfirmation({ on: 'password'})
  ]
}