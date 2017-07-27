import Ember from 'ember';
import layout from '../templates/components/update-email';
import EmailValidations from '../validations/email';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import firebase from 'firebase';

const {
  inject: { service },
  Component,
  Logger: { log },
  get,
  set
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
    this.email = new Changeset({ email: '', emailConfirmation: '', currentPassword: '' }, lookupValidator(EmailValidations), EmailValidations);
    this.currentEmail = get(this, 'firebaseApp').auth().currentUser.email;
    this.currentEmailPrompt = get(this, 'account-config').messages.currentEmailPrompt;
    this.classNames = ['update-email-component'];
  },

  actions: {
    async updateEmail(form) {
      let scope = this;
      let config = get(scope, 'account-config');

      if (get(scope, 'session.isAuthenticated') && get(get(scope, 'email'), 'isValid')) {
        let currentUser = get(scope, 'firebaseApp').auth().currentUser; // eslint-disable-line ember-suave/prefer-destructuring

        // Get credentials for reauthentication via the user email and the entered password
        let credential = firebase.auth.EmailAuthProvider.credential(currentUser.email, get(form, 'currentPassword'));

        try {
          await currentUser.reauthenticate(credential);

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
