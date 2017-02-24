import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

const sessionStub = Ember.Service.extend({
  isAuthenticated: true
});

const firebaseStub = Ember.Service.extend({
  auth(){
    let reauth = this.get('needReauth');
    return {
      currentUser: {
        email: "example@test.com",
        updatePassword(){
          return new Ember.RSVP.Promise((resolve, reject) => {
            if (reauth){
              reject({code: 'auth/requires-recent-login'});
            }else{
              resolve();
            }
          });
        },
      }
    };
  },
  needReauth: false
});

const configStub = Ember.Service.extend({
  hardDelete: false,
  messages: {
    successfulUpdatePassword: 'You have successfully updated your password!',
    unsuccessfulUpdatePassword: 'We were unable to update your password.'
  }
});

const reauthenticateStub = Ember.Service.extend({
  shouldReauthenticate: false
});

moduleForComponent('update-password', 'Integration | Component | update password', {
  integration: true,
  beforeEach: function(){
    this.register('service:session', sessionStub);
    this.register('service:firebaseApp', firebaseStub);
    this.inject.service('firebaseApp');
    this.register('service:reauthenticate', reauthenticateStub);
    this.inject.service('reauthenticate');
    this.register('service:account-config', configStub);
  }
});

test('it renders', function(assert) {
  this.render(hbs`{{#update-password}}{{/update-password}}`);

  assert.ok(this.$().text().trim().substring(0, 15), "Change Password");
  assert.equal(this.$('input').length, 2, "There should be two input fields");
});


test(('Correct submission, when reauthentication is needed, should trigger that'), function(assert){
  this.set("firebaseApp.needReauth", true);

  this.render(hbs`{{#update-password}}{{/update-password}}`);

  this.$('input').first().val("newpassword").trigger('change');
  this.$('input').last().val("newpassword").trigger('change');
  this.$('button').click();

  assert.ok(this.get("reauthenticate.shouldReauthenticate"));
});