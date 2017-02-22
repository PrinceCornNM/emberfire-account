import Ember from 'ember';


const {
  Route,
  inject: { service }
} = Ember;

export default Route.extend({
  session: service(),
  'account-config': Ember.inject.service(),
  beforeModel() {
    if (this.get('account-config').signInLink && !this.get('session.isAuthenticated')){
      this.get('router').transitionTo(Object.keys(this.get('account-config').signInLink)[0]);
    }
  }
});