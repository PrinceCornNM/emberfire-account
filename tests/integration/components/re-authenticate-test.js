import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

// const sessionStub = Ember.Service.extend({
//   isAuthenticated: true
// });

const firebaseStub = Ember.Service.extend({
  auth(){
    let shouldFail = this.get('shouldFail');
    return {
      currentUser: {
        email: "example@test.com",
        reauthenticate(){
          return new Ember.RSVP.Promise((resolve, reject) => {
            if (shouldFail){
              reject({code: 'error'});
            }else{
              resolve();
            }
          });
        },
      }
    };
  },
  shouldFail: false
});


const reauthenticateStub = Ember.Service.extend({
  shouldReauthenticate: true
});

moduleForComponent('re-authenticate', 'Integration | Component | re authenticate', {
  integration: true,
  beforeEach(){
    // this.register('service:session', sessionStub);
    this.register('service:firebaseApp', firebaseStub);
    this.inject.service('firebaseApp');
    this.register('service:reauthenticate', reauthenticateStub);
    this.inject.service('reauthenticate');
  }
});

test('it renders', function(assert) {
  // Template block usage:
  this.render(hbs`{{#re-authenticate}}{{/re-authenticate}}`);

  assert.equal(this.$().text().trim().substring(0, 16), 'Reauthentication');
});

test(('Correct submission'), function(assert){
  this.render(hbs`{{#re-authenticate}}{{/re-authenticate}}`);

  this.$('input').first().val("new@example.com").trigger('change');
  this.$('input').last().val("password").trigger('change');
  this.$('button').click();

  assert.notOk(this.get('reauthenticate.shouldReauthenticate'));
});

test(('If the email is invalid, it should not pass'), function(assert){
  this.render(hbs`{{#re-authenticate}}{{/re-authenticate}}`);

  this.$('input').first().val("notanemail").trigger('change');
  this.$('input').last().val("notanemail").trigger('change');
  this.$('button').click();

  assert.ok(this.get('reauthenticate.shouldReauthenticate'));
});

test(("Email is required"), function(assert){
  this.render(hbs`{{#re-authenticate}}{{/re-authenticate}}`);

  this.$('input').last().val("password").trigger('change');
  this.$('button').click();

  assert.ok(this.get('reauthenticate.shouldReauthenticate'));
});

test(("Password is required"), function(assert){
  this.render(hbs`{{#re-authenticate}}{{/re-authenticate}}`);

  this.$('input').first().val("test@example.com").trigger('change');
  this.$('button').click();

  assert.ok(this.get('reauthenticate.shouldReauthenticate'));
});

test(("Reauth will fail if firebaseApp returns failure"), function(assert){
  this.set('firebaseApp.shouldFail', true);
  this.render(hbs`{{#re-authenticate}}{{/re-authenticate}}`);

  this.$('input').first().val("new@example.com").trigger('change');
  this.$('input').last().val("password").trigger('change');
  this.$('button').click();

  assert.ok(this.get('reauthenticate.shouldReauthenticate'));
});