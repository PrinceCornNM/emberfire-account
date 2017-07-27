import Ember from 'ember';
import Changeset from 'ember-changeset';
import layout from '../templates/components/delete-user';
import firebase from 'firebase';

const {
  Component,
  inject,
  get,
  set,
  Logger
} = Ember;

export default Component.extend({
  firebaseApp: inject.service(),
  session: inject.service(),
  store: inject.service(),
  notify: inject.service(),
  'account-config': inject.service(),
  hasError: false,
  layout,

  init() {
    this._super(...arguments);
    this.deleteForm = new Changeset({ currentPassword: '' });
    this.className = ['delete-user-component'];
  },

  actions: {
    async deleteUser(form) {
      let scope = this;
      let config = get(scope, 'account-config');

      if (get(scope, 'session.isAuthenticated')) {
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
            Logger.log(error);
            get(scope, 'notify').alert(config.messages.unsuccessfulDeleteAccount);
          }
        } catch(error) {
          Logger.log(error);
          get(scope, 'notify').alert(config.messages.incorrectPassword);
        }
      }
    }
  }
});
