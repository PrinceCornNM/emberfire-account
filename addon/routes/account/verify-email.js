import Ember from 'ember';

const {
  inject: { service },
  Route
} = Ember;

export default Route.extend({
  // firebaseApp: service(),
  // setupController(controller, model) {
  //   this._super(controller, model);
  //   controller.set('isVerified', this.get('firebaseApp').auth());
  // }
});
