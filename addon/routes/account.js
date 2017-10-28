import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Route.extend({
  session: service(),
  'account-config': service(),

  beforeModel() {
    if (get(this, 'account-config').signInLink && !get(this, 'session.isAuthenticated')) {
      get(this, 'router').transitionTo(Object.keys(get(this, 'account-config').signInLink)[0]);
    }
  }
});