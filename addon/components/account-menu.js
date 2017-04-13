import Ember from 'ember';
import layout from '../templates/components/account-menu';

export default Ember.Component.extend({
  layout,
  classNames: ['menu-section'],
  active:    'active account-btn',
  notActive: 'account-btn',
  'account-config': Ember.inject.service(),
  links: Ember.computed('account-config.links', function() {
    return this.get('account-config.links');
  })
});
