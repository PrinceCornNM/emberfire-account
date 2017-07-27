import Ember from 'ember';

const {
  inject: { service },
  Route,
  get
} = Ember;

export default Route.extend({
  session: service(),
  'account-config': service(),

  beforeModel() {
    if (get(this, 'account-config').portalLink) {
      get(this, 'router').transitionTo(Object.keys(get(this, 'account-config').portalLink)[0]);
    }
  }
});
