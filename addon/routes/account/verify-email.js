import Ember from 'ember';
// import firebase from 'firebase';

const {
  // computed,
  inject: { service },
  Route
} = Ember;

export default Route.extend({
  session: service(),
  firebaseApp: service(),
  notify: service(),
  actions: {
    sendEmailVerification() {
      const user = this.get('firebaseApp').auth().currentUser;
      if (!this.get('isVerified').currentUser.emailVerified) {
        user.sendEmailVerification().then(() => {
          this.get('notify').info('Email verification was sent, please check your inbox');
        }, (error) => {
          this.get('notify').alert(`Error: ${error.code}`);
        });
      }
    }
  },
  init() {
    this._super();
    this.set('isVerified', this.get('firebaseApp').auth());
  }
});
