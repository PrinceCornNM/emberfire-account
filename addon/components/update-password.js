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
  actions: {
    updatePassword(form) {
      const scope = this;
      if (this.get('session.isAuthenticated') && this.get('password').get('isValid')) {
        this.get('firebaseApp').auth().currentUser.updatePassword(form.get('password')).then(() => {
          Ember.Logger.log('successful update');
          scope.get('router').transitionTo('index');
        });
      }
    }
  },
  PasswordValidations,
  init() {
    this._super(...arguments);
    this.password = new Changeset({password: '', passwordConfirmation: ''}, lookupValidator(PasswordValidations), PasswordValidations);
  }
});
