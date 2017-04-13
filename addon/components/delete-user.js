import Ember from 'ember';
import layout from '../templates/components/delete-user';

export default Ember.Component.extend({
  layout,
  className: ['delete-user-component'],
  firebaseApp: Ember.inject.service(),
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  notify: Ember.inject.service(),
  'account-config': Ember.inject.service(),
  reauthenticate: Ember.inject.service(),
  hasError: false,
  actions: {
    deleteUser(form){
      const scope = this,
            config = scope.get('account-config'),
            user = this.get('firebaseApp').auth().currentUser;
      return new Ember.RSVP.Promise(function(resolve, reject) {
        if(user && user.email === form.email){
          if(config.hardDelete){
            scope.get('store').findRecord("user", user.uid).then((rec) => {
              rec.destroyRecord();
              scope.get('notify').success(config.messages['successfulDeleteAccount']);
            });
          }
          user.delete().then(() => {
            scope.get('session').close().then(() => {
              scope.get('router').transitionTo('index');
              resolve();
            }, reject);
          }, (error) => {
            if(error.code === 'auth/requires-recent-login') {
              scope.get('notify').alert(config.messages['unsuccessfulDeleteAccount']);
              scope.get('reauthenticate').set('shouldReauthenticate', true);
            }
            reject();
          });
        }
        else {
          if(!scope.get("hasError")){
            scope.get('notify').alert(config.messages['unsuccessfulDeleteAccount']);
            Ember.$('.ef-account-form-input').append('<div class="form-field--errors">Incorrect email. Please re-enter your e-mail.</div>');
            scope.set("hasError", true);
          }
          reject();
        }
      });
    }
  },
  shouldReauthenticate: Ember.computed('reauthenticate.shouldReauthenticate', function() {
    return this.get('reauthenticate.shouldReauthenticate');
  }),
  init() {
    this._super(...arguments);
    this.delete_form = {email: ''};
  }
});
