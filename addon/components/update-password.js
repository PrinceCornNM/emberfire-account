import Ember from 'ember';
import layout from '../templates/components/update-password';
import PasswordValidations from '../validations/password';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Component.extend({
  layout,
  classNames: ['update-password-component'],
  firebaseApp: Ember.inject.service(),
  session: Ember.inject.service(),
  notify: Ember.inject.service('notify'),
  'account-config': Ember.inject.service(),
  reauthenticate: Ember.inject.service(),
  actions: {
    updatePassword(form) {
      const scope = this;
      if (this.get('session.isAuthenticated') && this.get('password').get('isValid')) {
        this.get('firebaseApp').auth().currentUser.updatePassword(form.get('password')).then(() => {
          scope.get('notify').success(scope.get('account-config').messages['successfulUpdatePassword']);
        }, (error) => {
          if(error.code === 'auth/requires-recent-login')
            scope.get('notify').success(scope.get('account-config').messages['unsuccessfulUpdatePassword']);
            scope.get('reauthenticate').set('shouldReauthenticate', true);
        });
      }
      else {
          if(!scope.get("hasError")){
            scope.get('notify').alert(scope.get('account-config').messages['unsuccessfulUpdatePassword']);
            scope.set("hasError", true);
          }
      }
    }
  },
  shouldReauthenticate: Ember.computed('reauthenticate.shouldReauthenticate', function() {
    return this.get('reauthenticate.shouldReauthenticate');
  }),
  init() {
    this._super();
    this.password = new Changeset({password: '', passwordConfirmation: ''}, lookupValidator(PasswordValidations), PasswordValidations);
  }
});
