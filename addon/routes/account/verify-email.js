import Ember from 'ember';
// import firebase from 'firebase';

const {
  // computed,
  inject: { service },
  Route
} = Ember;

export default Route.extend({
  notify: service(),
  firebaseApp: service(),
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
  setupController(controller, model) {
    this._super(controller, model);
    controller.set('isVerified', this.get('firebaseApp').auth());
  }
});
