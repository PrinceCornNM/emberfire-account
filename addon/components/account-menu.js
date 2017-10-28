import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get, computed } from '@ember/object';
import layout from '../templates/components/account-menu';

export default Component.extend({
  'account-config': service(),
  classNames: ['menu-section'],
  active: 'active account-btn',
  notActive: 'account-btn',
  layout,

  links: computed('account-config.links', function() {
    return get(this, 'account-config.links');
  })
});
