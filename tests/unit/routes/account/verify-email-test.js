import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

// This extremely simple stub is sufficient for the verify-email's init function but not really for anything else
const firebaseStub = Ember.Service.extend({
	auth(){
		return true;
	}
});

moduleFor('route:account/verify-email', 'Unit | Route | account/verify email', {
  beforeEach: function(){
  	this.register('service:firebaseApp', firebaseStub);
  }
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});