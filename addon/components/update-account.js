import Ember from 'ember';
import layout from '../templates/components/update-account';
import UserValidations from '../validations/user';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Component.extend({
  layout,
  actions: {
    saveForm(form) {
      form.validate().then(() => {
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
