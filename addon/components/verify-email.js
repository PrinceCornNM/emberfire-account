import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { set, get } from '@ember/object';
import layout from '../templates/components/verify-email';

export default Component.extend({
  firebaseApp: service(),
  notify: service(),
  'account-config': service(),
  isVerified: false,
  layout,

  init() {
    this._super(...arguments);
    set(this, 'isVerified', get(this, 'firebaseApp').auth().currentUser.emailVerified);
    this.classNames = ['verify-email-component'];
  },

  actions: {
    async sendEmailVerification() {
      let user = get(this, 'firebaseApp').auth().currentUser;

      if (!user.emailVerified) {
        try {
          await user.sendEmailVerification();
          get(this, 'notify').info('Email verification was sent, please check your inbox');
        } catch(error) {
          get(this, 'notify').alert(`Error: ${error.code}`);
        }
      } else {
        get(this, 'notify').alert('Error: Your email is already verified');
      }
    }
  }
});
