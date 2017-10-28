import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { set, get } from '@ember/object';
import Ember from 'ember';
import layout from '../templates/components/delete-user';
import DeleteAccountValidation from '../validations/delete-account';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import firebase from 'firebase';

const {
  Logger: { log }
} = Ember;

export default Component.extend({
  firebaseApp: service(),
  session: service(),
  store: service(),
  notify: service(),
  'account-config': service(),
  hasError: false,
  layout,
  DeleteAccountValidation,

  init() {
    this._super(...arguments);
    this.deleteForm = new Changeset({ currentPassword: '' }, lookupValidator(DeleteAccountValidation), DeleteAccountValidation);
    this.className = ['delete-user-component'];
  },

  actions: {
    async deleteUser(form) {
      let scope = this;
      let config = get(scope, 'account-config');

      await form.validate();

      if (get(scope, 'session.isAuthenticated') && get(form, 'isValid')) {
        let currentUser = get(scope, 'firebaseApp').auth().currentUser; // eslint-disable-line ember-suave/prefer-destructuring

        // Get credentials for reauthentication via the user email and the entered password
        let credential = firebase.auth.EmailAuthProvider.credential(currentUser.email, get(form, 'currentPassword'));

        // try to reauthenticate, and catch any errors that come up
        try {
          await currentUser.reauthenticate(credential);

          try {
            let userRecord = await get(scope, 'store').findRecord('user', currentUser.uid);

            if (config.hardDelete) {
              // if hard deleting, destroy the user
              userRecord.destroyRecord();

              await currentUser.delete();
              await get(scope, 'session').close();
              get(scope, 'router').transitionTo('index');
              get(scope, 'notify').success(config.messages.successfulDeleteAccount);
            } else {
              // if not hard deleting the user, flag the account as deleted
              if (config.deleted) {
                set(userRecord, config.deleted, true);
                await userRecord.save();
              }

              await currentUser.delete();
              await get(scope, 'session').close();
              get(scope, 'router').transitionTo('index');
              get(scope, 'notify').success(config.messages.successfulDeleteAccount);
            }
          } catch(error) {
            log(error);
            get(scope, 'notify').alert(config.messages.unsuccessfulDeleteAccount);
          }
        } catch(error) {
          log(error);
          get(scope, 'notify').alert(config.messages.incorrectPassword);
        }
      }
    }
  }
});
