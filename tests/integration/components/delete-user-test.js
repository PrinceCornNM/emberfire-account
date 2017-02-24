import { moduleForComponent, test } from 'ember-qunit';
// import wait from 'ember-test-helpers/wait';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

const firebaseStub = Ember.Service.extend({
  auth(){
    let reauth = this.get('needReauth');
    return {
      currentUser: {
        email: "example@test.com",
        delete(){
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

const notifyStub = Ember.Service.extend({
  alert(message){
    return message;
  }
});

const configStub = Ember.Service.extend({
  hardDelete: false,
  messages: {
    unsuccessfulDeleteAccount: 'We were unable to delete your account.',
    successfulDeleteAccount: 'You have successfully deleted your account!'
  }
});

const reauthenticateStub = Ember.Service.extend({
  shouldReauthenticate: false
});

// const routerStub = Ember.Service.extend({
//   transitionTo(route){
//     return route;
//   }
// });

moduleForComponent('delete-user', 'Integration | Component | delete user', {
  integration: true,
  beforeEach: function(){
    this.register('service:firebaseApp', firebaseStub);
    this.inject.service('firebaseApp');

    this.register('service:notify', notifyStub);
    this.register('service:account-config', configStub);
    this.register('service:reauthenticate', reauthenticateStub);
    this.inject.service('reauthenticate');
  }
});

test('it renders', function(assert) {
  this.render(hbs`{{#delete-user}}{{/delete-user}}`);

  assert.equal(this.$().text().trim().substring(0, 14), 'Delete Account');
});

test('Clicking submit without an e-mail should return an error', function(assert) {
  this.render(hbs`{{#delete-user}}{{/delete-user}}`);
  this.$('.common-button').click();

  assert.equal(this.$('.form-field--errors').text(), 'Incorrect email. Please re-enter your e-mail.');
});

test('Clicking submit with an incorrect e-mail should return an error', function(assert){
  this.render(hbs`{{#delete-user}}{{/delete-user}}`);

  this.$('input').val('wrong@email.com').trigger('change');
  this.$('button').click();

  assert.equal(this.$('.form-field--errors').text(), 'Incorrect email. Please re-enter your e-mail.');
});

test(('If Reauthentication is required, that template should be loaded'), function(assert){
  this.set("firebaseApp.needReauth", true);
  this.render(hbs`{{#delete-user}}{{/delete-user}}`);

  this.$('input').val("example@test.com").trigger('change');
  this.$('button').click();

  assert.ok(this.get("reauthenticate.shouldReauthenticate"));
});