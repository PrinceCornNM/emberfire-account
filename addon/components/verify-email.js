import Ember from 'ember';
import layout from '../templates/components/verify-email';

export default Ember.Component.extend({
  layout,
  classNames: ['verify-email-component'],
  firebaseApp: Ember.inject.service(),
  notify: Ember.inject.service(),
  'account-config': Ember.inject.service(),
  isVerified: false,
  actions: {
    sendEmailVerification() {
      const user = this.get('firebaseApp').auth().currentUser;
      if (!user.emailVerified) {
        user.sendEmailVerification().then(() => {
          this.get('notify').info('Email verification was sent, please check your inbox');
        }, (error) => {
          this.get('notify').alert(`Error: ${error.code}`);
        });
      }
      else {
        this.get('notify').alert(`Error: Your email is already verified`);
      }
    }
  },
  init() {
    this._super(...arguments);
    this.set('isVerified', this.get('firebaseApp').auth().currentUser.emailVerified );
  }
});
