import Ember from 'ember';
import layout from '../templates/components/update-email';
import EmailValidations from '../validations/email';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Component.extend({
  layout,
  classNames: ['update-email-component'],
  firebaseApp: Ember.inject.service(),
  session: Ember.inject.service(),
  notify: Ember.inject.service('notify'),
  'account-config': Ember.inject.service(),
  reauthenticate: Ember.inject.service(),
  actions: {
    updateEmail(form) {
      const scope = this;
      if (this.get('session.isAuthenticated') && this.get('email').get('isValid')) {
        this.get('firebaseApp').auth().currentUser.updateEmail(form.get('email')).then(() => {
          scope.get('notify').success(scope.get('account-config').messages['successfulUpdateEmail']);
        }, (error) => {
          Ember.Logger.log(error);
          if(error.code === 'auth/requires-recent-login')
            scope.get('notify').alert(scope.get('account-config').messages['unsuccessfulUpdateEmail']);
            scope.get('reauthenticate').set('shouldReauthenticate', true);
        });
      }
      else {
          if(!scope.get("hasError")){
            scope.get('notify').alert(scope.get('account-config').messages['unsuccessfulUpdateEmail']);
            scope.set("hasError", true);
          }
      }
    }
  },
  shouldReauthenticate: Ember.computed('reauthenticate.shouldReauthenticate', function() {
    return this.get('reauthenticate.shouldReauthenticate');
  }),
  EmailValidations,
  init() {
    this._super(...arguments);
    this.email = new Changeset({email: '', emailConfirmation: ''}, lookupValidator(EmailValidations), EmailValidations);
  }
});
