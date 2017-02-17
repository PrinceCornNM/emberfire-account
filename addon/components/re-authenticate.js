import Ember from 'ember';
import layout from '../templates/components/re-authenticate';
import ReauthenticateValidations from '../validations/reauthenticate';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

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
    reauthenticateUser() {
      set(scope, 'reauthenticate', true);
    },
    reauthenticate(form) {
      const scope = this;
      form.validate().then(() => {
        // Credential should work regardless of which account provider they decide to sign in with
        const credential = get(scope, 'firebaseApp').auth().EmailAuthProvider.credential(get(form, 'email'), get('form', 'password'));

        get(scope, 'firebaseApp').auth().currentUser.reauthenticate(credential).then(() => {
          // reauthenticated the user for the next operation
          set(scope, 'reauthenticate', false);
        });
      });
    }
  },
  reauthenticate: false,
  session: service(),
  firebaseApp: service(),
  init() {
    this._super(...arguments);
    this.creds = new Changeset({ email: '', password: '' }, lookupValidator(ReauthenticateValidations), ReauthenticateValidations);
  }
});