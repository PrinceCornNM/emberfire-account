import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import Ember from 'ember';
import layout from '../templates/components/update-password';
import PasswordValidations from '../validations/update-password';
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
  layout,

  init() {
    this._super();
    this.password = new Changeset({ currentPassword: '', newPassword: '', newPasswordConfirmation: '' }, lookupValidator(PasswordValidations), PasswordValidations);
    this.classNames = ['update-password-component'];
  },

  actions: {
    async updatePassword(form) {
      let scope = this;
      let config = get(scope, 'account-config');

      await form.validate();

      if (get(scope, 'session.isAuthenticated') && get(form, 'isValid')) {
        let currentUser = get(scope, 'firebaseApp').auth().currentUser; // eslint-disable-line ember-suave/prefer-destructuring

        // Get credentials for reauthentication via the user email and the entered password
        let credential = firebase.auth.EmailAuthProvider.credential(currentUser.email, get(form, 'currentPassword'));

        try {
          await currentUser.reauthenticate(credential);

          try {
            await get(scope, 'firebaseApp').auth().currentUser.updatePassword(get(form, 'newPassword'));
            get(scope, 'notify').success(config.messages.successfulUpdatePassword);
          } catch(error) {
            log(error);
            get(scope, 'notify').alert(config.messages.unsuccessfulUpdatePassword);
          }

        } catch(error) {
          log(error);
          get(scope, 'notify').alert(config.messages.incorrectPassword);
        }
      }
    }
  }
});
