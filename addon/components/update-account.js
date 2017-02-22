import Ember from 'ember';
import layout from '../templates/components/update-account';
import UserValidations from 'fire/validations/user';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Component.extend({
  layout,
  notify: Ember.inject.service('notify'),
  'account-config': Ember.inject.service(),
  actions: {
    saveForm(form) {
      const scope = this;
      form.validate().then(() => {
        scope.get('notify').success(scope.get('account-config').messages['successfulUpdateAccount']);
        form.save();
      });
    }
  },
  init() {
    this._super(...arguments);
    // get current user and pass it into the object
    this.user = new Changeset({}, lookupValidator(UserValidations), UserValidations);
  }
});
