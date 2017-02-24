import Ember from 'ember';
import layout from '../templates/components/re-authenticate';
import ReauthenticateValidations from '../validations/reauthenticate';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import firebase from 'firebase';

const {
  Component,
  // computed,
  get,
  set,
  inject: { service }
} = Ember;

export default Component.extend({
  layout,
  actions: {
    reauthenticate(form) {
      const scope = this;
      return new Ember.RSVP.Promise(function(resolve, reject) {
        form.validate().then(() => {
          if(form.get('isValid')){
            // Credential should work regardless of which account provider they decide to sign in with
            const credential = firebase.auth.EmailAuthProvider.credential(get(form, 'email'), get(form, 'password'));

            get(scope, 'firebaseApp').auth().currentUser.reauthenticate(credential).then(() => {
              // reauthenticated the user for the next operation
              set(get(scope, 'reauthenticate'), 'shouldReauthenticate', false);
              resolve();
            }, (error) => {
              console.log(error);
              reject();
            });
          }else{
            reject();
          }
        }, () => {
          reject();
        });
      });
    }
  },
  session: service(),
  firebaseApp: service(),
  reauthenticate: service(),
  init() {
    this._super(...arguments);
    this.creds = new Changeset({ email: '', password: '' }, lookupValidator(ReauthenticateValidations), ReauthenticateValidations);
  }
});