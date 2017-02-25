import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

const firebaseStub = Ember.Service.extend({
  auth(){
    let emailVerified = this.get('emailVerified');
    let error = this.get('shouldError');
    return {
      currentUser: {
        emailVerified: emailVerified,
        email: "example@test.com",
        sendEmailVerification(){
          return new Ember.RSVP.Promise((resolve, reject) => {
            if (error){
              reject({code: 'ERROR'});
            }else{
              resolve();
            }
          });
        }
      }
    };
  },
  emailVerified: false,
  shouldError: false
});

const notifyStub = Ember.Service.extend({
  lastMessage: "",
  alert(message){
    this.set("lastMessage", message);
  },
  info(message){
    this.set("lastMessage", message);
  }
});

moduleForComponent('verify-email', 'Integration | Component | verify email', {
  integration: true,
  beforeEach: function(){
    this.register('service:firebaseApp', firebaseStub);
    this.inject.service('firebaseApp');

    this.register('service:notify', notifyStub);
    this.inject.service('notify');
  }
});

test('it renders when the user needs to verify e-mail', function(assert) {
  this.render(hbs`{{#verify-email}}{{/verify-email}}`);

  assert.equal(this.$().text().trim().substring(0, 23), 'Send Email Verification');
  assert.equal(this.$('button').length, 1);
});

test('it renders differently when the user does not need to verify e-mail', function(assert) {
  this.set('firebaseApp.emailVerified', true);
  this.render(hbs`{{#verify-email}}{{/verify-email}}`);

  assert.equal(this.$().text().trim().substring(0, 23), 'Send Email Verification');
  assert.equal(this.$('button').length, 0);
});

test('Sends a Verification Email', function(assert) {
  this.render(hbs`{{#verify-email}}{{/verify-email}}`);
  this.$('button').click();

  assert.equal(this.get("notify.lastMessage"), 'Email verification was sent, please check your inbox');
});

test('Checks if the user has been verified before sending email', function(assert) {
  this.render(hbs`{{#verify-email}}{{/verify-email}}`);
  this.set('firebaseApp.emailVerified', true);
  this.$('button').click();

  assert.equal(this.get("notify.lastMessage"), 'Error: Your email is already verified');
});

test('Responds to errors', function(assert) {
  this.render(hbs`{{#verify-email}}{{/verify-email}}`);
  this.set('firebaseApp.shouldError', true);
  this.$('button').click();

  assert.equal(this.get("notify.lastMessage"), 'Error: ERROR');
});
