import Ember from 'ember';
import layout from '../templates/components/update-password';
import PasswordValidations from '../validations/password';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import firebase from 'firebase';

export default Ember.Component.extend({
  layout,
  classNames: ['update-password-component'],
  firebaseApp: Ember.inject.service(),
  session: Ember.inject.service(),
  notify: Ember.inject.service(),
  'account-config': Ember.inject.service(),
  actions: {
    updatePassword(form) {
      const scope = this;
      return new Ember.RSVP.Promise(function(resolve, reject) {
        if (scope.get('session.isAuthenticated') && scope.get('password').get('isValid')) {
          const currentUser = scope.get('firebaseApp').auth().currentUser;

          // Get credentials for reauthentication via the user email and the entered password
          const credential = firebase.auth.EmailAuthProvider.credential(currentUser.email, form.get('currentPassword'));

          currentUser.reauthenticate(credential).then(() => {

            scope.get('firebaseApp').auth().currentUser.updatePassword(form.get('password')).then(() => {
              scope.get('notify').success(scope.get('account-config').messages['successfulUpdatePassword']);
              resolve();
            }, (error) => {
              Ember.Logger.log(error);
              scope.get('notify').alert(scope.get('account-config').messages['unsuccessfulUpdatePassword']);
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
    this._super();
    this.password = new Changeset({password: '', passwordConfirmation: '', currentPassword: ''}, lookupValidator(PasswordValidations), PasswordValidations);
  }
});
