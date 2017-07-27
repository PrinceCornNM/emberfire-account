import Ember from 'ember';
import layout from '../templates/components/account-menu';

const {
  Component,
  inject: { service },
  computed,
  get
} = Ember;

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
