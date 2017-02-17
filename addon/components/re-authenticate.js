import Ember from 'ember';
import layout from '../templates/components/re-authenticate';

const {
  Component,
  computed,
  get,
  set,
  inject: { service }
} = Ember;

export default Component.extend({
  layout,
  actions: {
    reauthenticateUser(form) {
      const formObject = form,
            scope = this;

      // Credential should work regardless of which account provider they decide to sign in with
      const credential = get(this, 'firebaseApp').auth().EmailAuthProvider.credential(get(form, 'email'), get('form', 'password'));

      get(this, 'firebaseApp').auth().currentUser.reauthenticate(credential).then(() => {
        // reauthenticated the user for the next operation
        set(scope, 'reauthenticate', true);
      }, (error) => {
        if(error.toString().contains('reauthenticate'))
          this.sendAction('reauthenticateUser');
      });
    }
  },
  reauthenticate: false,
  session: service(),
  firebaseApp: service()
});

// ways to get credentials
/*
  Google:
  var credential = firebase.auth.GoogleAuthProvider.credential(
              googleUser.getAuthResponse().id_token);
  firebase.auth().signInWithCredential(credential);

  Facebook:
  var cred = firebase.auth.FacebookAuthProvider.credential(
      // `event` from the Facebook auth.authResponseChange callback.
      event.authResponse.accessToken
  );

 */