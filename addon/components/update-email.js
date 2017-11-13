import { inject as service } from '@ember/service';
import Component from '@ember/component';
import {
  set,
  setProperties,
  get
} from '@ember/object';
import Ember from 'ember';
import layout from '../templates/components/update-email';
import EmailValidations from '../validations/update-email';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import firebase from 'firebase';

const {
  Logger: { log }
} = Ember;

export default Component.extend({
  firebaseApp: service(),
  session: service(),
  notify: service(),
  'account-config': service(),
  store: service(),
  layout,
  EmailValidations,

  init() {
    this._super(...arguments);

    let currentEmail = get(this, 'firebaseApp').auth().currentUser && get(this, 'firebaseApp').auth().currentUser.email;
    setProperties(this, {
      email: new Changeset({ email: '', emailConfirmation: '', currentPassword: '' }, lookupValidator(EmailValidations), EmailValidations),
      currentEmail,
      currentEmailPrompt: get(this, 'account-config.messages.currentEmailPrompt'),
      classNames: ['update-email-component']
    });
  },

  actions: {
    async updateEmail(form) {
      let scope = this;
      let config = get(scope, 'account-config');

      await form.validate();

      if (get(scope, 'session.isAuthenticated') && get(form, 'isValid')) {
        let currentUser = get(scope, 'firebaseApp').auth().currentUser; // eslint-disable-line ember-suave/prefer-destructuring

        // Get credentials for reauthentication via the user email and the entered password
        let credential = firebase.auth.EmailAuthProvider.credential(currentUser.email, get(form, 'currentPassword'));

        try {
          await currentUser.reauthenticateWithCredential(credential);

          try {
            await currentUser.updateEmail(get(form, 'email'));

            if (config.email) {
              let userRecord = await get(scope, 'store').findRecord('user', currentUser.uid);
              set(userRecord, config.email, get(form, 'email'));
              await userRecord.save();
              get(scope, 'notify').success(config.messages.successfulUpdateEmail);
            }

          } catch(error) {
            log(error);
            get(scope, 'notify').alert(config.messages.unsuccessfulUpdateEmail);
          }
        } catch(error) {
          log(error);
          get(scope, 'notify').alert(config.messages.incorrectPassword);
        }
      }
    }
  }
});
