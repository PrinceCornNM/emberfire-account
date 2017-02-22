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
  reauthenticate: Ember.inject.service(),
  actions: {
    updateEmail(form) {
      const scope = this;
      return new Ember.RSVP.Promise(function(resolve, reject) {
        if (scope.get('session.isAuthenticated') && scope.get('email').get('isValid')) {
          scope.get('firebaseApp').auth().currentUser.updateEmail(form.get('email')).then(() => {
            Ember.Logger.log('successful update');
            scope.get('router').transitionTo('index');
            resolve();
          }, (error) => {
            Ember.Logger.log(error);
            if(error.code === 'auth/requires-recent-login') {
              scope.get('reauthenticate').set('shouldReauthenticate', true);
            }
            reject();
          });
        }
        reject();
      });
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
