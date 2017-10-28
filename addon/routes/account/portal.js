import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { get } from '@ember/object';

export default Route.extend({
  session: service(),
  'account-config': service(),

  beforeModel() {
    if (get(this, 'account-config').portalLink) {
      get(this, 'router').transitionTo(Object.keys(get(this, 'account-config').portalLink)[0]);
    }
  }
});
