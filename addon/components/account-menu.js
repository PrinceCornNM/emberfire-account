import Ember from 'ember';
import layout from '../templates/components/account-menu';

export default Ember.Component.extend({
  layout,
  classNames: ['menu-section'],
  active:    'active account-btn',
  notActive: 'account-btn',
  links: [
    { description: 'Account', link: 'account' },
    { description: 'Change Email', link: 'email' },
    { description: 'Change Password', link: 'password' }
  ],
  init() {
    this._super();
    const scope = this;
    this.get('links').forEach((l) => {
      if (l.link === scope.get('router.currentRouteName')) {
        l.condition = true;
      }
    });
    return this.get('links');
  }
});
