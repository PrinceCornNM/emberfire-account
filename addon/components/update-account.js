import Ember from 'ember';
import layout from '../templates/components/update-account';

export default Ember.Component.extend({
  layout,
  actions: {
    saveForm(form) {
      form.validate().then(() => {
        form.save();
      });
    }
  }
});
