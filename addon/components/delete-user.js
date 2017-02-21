import Ember from 'ember';
import layout from '../templates/components/delete-user';

export default Ember.Component.extend({
  layout,
  className: ['delete-user-component'],
  firebaseApp: Ember.inject.service(),
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  reauthenticate: Ember.inject.service(),
  actions: {
    deleteUser(form){
      const scope = this;
      var config = Ember.getOwner(this).resolveRegistration('config:environment');
      var user = this.get('firebaseApp').auth().currentUser;
      if(user && user.email === form.email){
        if(config.emberfireAccount.hardDelete){
          this.get('store').findRecord("user", user.uid).then(function(rec){
            rec.destroyRecord();
            Ember.Logger.log("User data deleted");
          });
        }
        user.delete().then(function(){
          Ember.Logger.log('User deleted');
          scope.get('router').transitionTo('index');
        }, (error)=>{
          if(error.code === 'auth/requires-recent-login')
            scope.get('reauthenticate').set('shouldReauthenticate', true);
        });
      }
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
