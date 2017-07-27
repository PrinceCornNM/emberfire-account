import Ember from 'ember';
import layout from '../templates/components/update-email';
import EmailValidations from '../validations/email';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import firebase from 'firebase';

export default Ember.Component.extend({
  layout,
  classNames: ['update-email-component'],
  firebaseApp: Ember.inject.service(),
  session: Ember.inject.service(),
  notify: Ember.inject.service(),
  'account-config': Ember.inject.service(),
  store: Ember.inject.service(),
  actions: {
    updateEmail(form) {
      const scope = this;
      return new Ember.RSVP.Promise(function(resolve, reject) {
        if (scope.get('session.isAuthenticated') && scope.get('email').get('isValid')) {
          const currentUser = scope.get('firebaseApp').auth().currentUser;

          // Get credentials for reauthentication via the user email and the entered password
          const credential = firebase.auth.EmailAuthProvider.credential(currentUser.email, form.get('currentPassword'));

          currentUser.reauthenticate(credential).then(() => {

            currentUser.updateEmail(form.get('email')).then(() => {
              if (scope.get('account-config').email) {
                scope.get('store').findRecord('user', currentUser.uid).then((data) => {
                  data.set(scope.get('account-config').email, form.get('email'));

                  data.save().then(() => {
                    scope.get('notify').success(scope.get('account-config').messages['successfulUpdateEmail']);
                    resolve();
                  }, (error) => {
                    scope.get('notify').alert(scope.get('account-config').messages['unsuccessfulUpdateEmail']);
                    reject();
                  });

                }, (error) => {
                  scope.get('notify').alert(scope.get('account-config').messages['unsuccessfulUpdateEmail']);
                  reject();
                });
              }
              else {
                scope.get('notify').success(scope.get('account-config').messages['successfulUpdateEmail']);
                resolve();
              }
            }, (error) => {
              Ember.Logger.log(error);
              scope.get('notify').alert(scope.get('account-config').messages['unsuccessfulUpdateEmail']);
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
  EmailValidations,
  init() {
    this._super(...arguments);
    this.email = new Changeset({email: '', emailConfirmation: '', currentPassword: ''}, lookupValidator(EmailValidations), EmailValidations);
    this.currentEmail = this.get('firebaseApp').auth().currentUser.email;
    this.currentEmailPrompt = this.get('account-config').messages['currentEmailPrompt'];
  }
});
