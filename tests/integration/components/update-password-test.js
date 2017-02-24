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
  messages: {
    successfulUpdatePassword: 'You have successfully updated your password!',
    unsuccessfulUpdatePassword: 'We were unable to update your password.'
  }
});

const reauthenticateStub = Ember.Service.extend({
  shouldReauthenticate: false
});

const notifyStub = Ember.Service.extend({
  lastMessage: "",
  alert(message){
    this.set("lastMessage", message);
  },
  success(message){
    this.set("lastMessage", message);
  }
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

    this.register('service:notify', notifyStub);
    this.inject.service('notify');
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

test(('Correct submission'), function(assert){
  this.render(hbs`{{#update-password}}{{/update-password}}`);

  this.$('input').first().val("newpassword").trigger('change');
  this.$('input').last().val("newpassword").trigger('change');
  this.$('button').click();

  assert.equal(this.get("notify.lastMessage"), 'You have successfully updated your password!');
});

test(('If a submission is too short, it should not pass'), function(assert){
  this.render(hbs`{{#update-password}}{{/update-password}}`);

  this.$('input').first().val("n").trigger('change');
  this.$('input').last().val("n").trigger('change');
  this.$('button').click();

  // With a password that doesn't pass validation, notify should never be called.
  assert.equal(this.get("notify.lastMessage"), '');
});

test(("Password that don't match shouldn't run"), function(assert){
  this.render(hbs`{{#update-password}}{{/update-password}}`);

  this.$('input').first().val("newpassword").trigger('change');
  this.$('input').last().val("newpassword+").trigger('change');
  this.$('button').click();

  // With a password that doesn't pass validation, notify should never be called.
  assert.equal(this.get("notify.lastMessage"), '');
});