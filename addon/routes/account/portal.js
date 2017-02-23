import Ember from 'ember';

const {
  inject: { service },
  Route
} = Ember;

export default Route.extend({
  session: service(),
  'account-config': Ember.inject.service(),
  beforeModel() {
    if (this.get('account-config').portalLink){
      this.get('router').transitionTo(Object.keys(this.get('account-config').portalLink)[0]);
    }
  }
});