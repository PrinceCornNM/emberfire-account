import Ember from 'ember';
import Changeset from 'ember-changeset';
import layout from '../templates/components/delete-user';
import firebase from 'firebase';

export default Ember.Component.extend({
  layout,
  className: ['delete-user-component'],
  firebaseApp: Ember.inject.service(),
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  notify: Ember.inject.service(),
  'account-config': Ember.inject.service(),
  hasError: false,

  actions: {
    deleteUser(form) {
      const scope = this,
        config = scope.get('account-config'),
        user = this.get('firebaseApp').auth().currentUser;

      return new Ember.RSVP.Promise(function(resolve, reject) {
        if(scope.get('session.isAuthenticated')) {
          const currentUser = scope.get('firebaseApp').auth().currentUser;

          // Get credentials for reauthentication via the user email and the entered password
          let credential = firebase.auth.EmailAuthProvider.credential(currentUser.email, form.get('currentPassword'));

          currentUser.reauthenticate(credential).then(() => {

            scope.get('store').findRecord('user', currentUser.uid).then((record) => {
              if(config.hardDelete) {
                // if hard deleting, destroy the user
                rec.destroyRecord();

                user.delete().then(() => {
                  scope.get('session').close().then(() => {
                    scope.get('router').transitionTo('index');
                    scope.get('notify').success(config.messages['successfulDeleteAccount']);
                    resolve();
                  }, reject);
                }, (error) => {
                  Ember.Logger.log(error);
                  scope.get('notify').alert(config.messages['unsuccessfulDeleteAccount']);
                  reject();
                });
              }
              else {
                // if not hard deleting the user, flag the account as deleted
                if(config.deleted)
                  record.set(config.deleted, true);

                record.save().then(() => {
                  user.delete().then(() => {
                    scope.get('session').close().then(() => {
                      scope.get('router').transitionTo('index');
                      scope.get('notify').success(config.messages['successfulDeleteAccount']);
                      resolve();
                    }, reject);
                  }, (error) => {
                    Ember.Logger.log(error);
                    scope.get('notify').alert(config.messages['unsuccessfulDeleteAccount']);
                    reject();
                  });

                  resolve();
                }, (error) => {
                  scope.get('notify').alert(config.messages['successfulDeleteAccount']);
                  reject();
                });
              }
            }, (error) => {
              Ember.Logger.log(error);
              scope.get('notify').alert(config.messages['unsuccessfulDeleteAccount']);
              reject();
            });

          }, (error) => {
            Ember.Logger.log(error);
            scope.get('notify').alert(scope.get('account-config').messages['incorrectPassword']);
            reject();
          });
        }

        reject();
      });
    }
  },
  init() {
    this._super(...arguments);
    this.delete_form = new Changeset({currentPassword: ''});
  }
});
