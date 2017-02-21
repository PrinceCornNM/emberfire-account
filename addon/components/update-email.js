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
          Ember.Logger.log('successful update');
          this.get('account-config'.messages)['successfulUpdateEmail'];
          scope.get('router').transitionTo('index');
        }, (error) => {
          Ember.Logger.log(error);
          if(error.code === 'auth/requires-recent-login')
            this.get('account-config'.messages)['unsuccessfulUpdateEmail'];
            scope.get('reauthenticate').set('shouldReauthenticate', true);
        });
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
