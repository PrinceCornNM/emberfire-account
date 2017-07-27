import Ember from 'ember';

const {
  Route,
  inject: { service },
  get
} = Ember;

export default Route.extend({
  session: service(),
  'account-config': service(),

  beforeModel() {
    if (get(this, 'account-config').signInLink && !get(this, 'session.isAuthenticated')) {
      get(this, 'router').transitionTo(Object.keys(get(this, 'account-config').signInLink)[0]);
    }
  }
});