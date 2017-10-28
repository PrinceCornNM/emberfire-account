import Component from '@ember/component';
import { set, get } from '@ember/object';
import { inject as service } from '@ember/service';
import Ember from 'ember';
import layout from '../templates/components/re-authenticate';
import ReauthenticateValidations from '../validations/reauthenticate';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import firebase from 'firebase';

const {
  Logger: { log }
} = Ember;

export default Component.extend({
  notify: service(),
  session: service(),
  firebaseApp: service(),
  reauthenticate: service(),
  layout,

  init() {
    this._super(...arguments);
    this.creds = new Changeset({ email: '', password: '' }, lookupValidator(ReauthenticateValidations), ReauthenticateValidations);
  },

  actions: {
    async reauthenticate(form) {
      let scope = this;
      let config = get(scope, 'account-config');

      try {
        await form.validate();

        if (!get(form, 'isValid')) {
          return;
        }

        // Credential should work regardless of which account provider they decide to sign in with
        let credential = firebase.auth.EmailAuthProvider.credential(get(form, 'email'), get(form, 'password'));

        try {
          await get(scope, 'firebaseApp').auth().currentUser.reauthenticateWithCredential(credential);
          // reauthenticated the user for the next operation
          set(get(scope, 'reauthenticate'), 'shouldReauthenticate', false);
        } catch(error) {
          log(error);
          get(scope, 'notify').alert(config.messages.unsuccessfulLogin);
        }
      } catch(error) {
        log(error);
      }
    }
  }
});