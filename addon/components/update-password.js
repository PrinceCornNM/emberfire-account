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
  reauthenticate: Ember.inject.service(),
  actions: {
    updatePassword(form) {
      const scope = this;
      return new Ember.RSVP.Promise(function(resolve, reject) {
        if (scope.get('session.isAuthenticated') && scope.get('password').get('isValid')) {
          scope.get('firebaseApp').auth().currentUser.updatePassword(form.get('password')).then(() => {
            Ember.Logger.log('successful update');
            scope.get('router').transitionTo('index');
            resolve();
          }, (error) => {
            if(error.code === 'auth/requires-recent-login')
              scope.get('reauthenticate').set('shouldReauthenticate', true);
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
  init() {
    this._super();
    this.password = new Changeset({password: '', passwordConfirmation: ''}, lookupValidator(PasswordValidations), PasswordValidations);
  }
});
