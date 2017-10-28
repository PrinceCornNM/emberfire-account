import Service from '@ember/service';
import RSVP from 'rsvp';
import { set, get } from '@ember/object';
import { moduleForComponent, test } from 'ember-qunit';
// import wait from 'ember-test-helpers/wait';
import hbs from 'htmlbars-inline-precompile';

const firebaseStub = Service.extend({
  needReauth: false,
  auth() {
    let reauth = get(this, 'needReauth');
    return {
      currentUser: {
        email: 'example@test.com',
        delete() {
          return new RSVP.Promise((resolve, reject) => {
            if (reauth) {
              reject({ code: 'auth/requires-recent-login' });
            } else {
              resolve();
            }
          });
        }
      }
    };
  }
});

const notifyStub = Service.extend({
  alert(message) {
    return message;
  }
});

const configStub = Service.extend({
  hardDelete: false,
  messages: { // eslint-disable-line ember/avoid-leaking-state-in-components
    unsuccessfulDeleteAccount: 'We were unable to delete your account.',
    successfulDeleteAccount: 'You have successfully deleted your account!'
  }
});

const reauthenticateStub = Service.extend({
  shouldReauthenticate: false
});

// const routerStub = Service.extend({
//   transitionTo(route) {
//     return route;
//   }
// });

moduleForComponent('delete-user', 'Integration | Component | delete user', {
  integration: true,
  beforeEach() {
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

test('Clicking submit with an incorrect e-mail should return an error', function(assert) {
  this.render(hbs`{{#delete-user}}{{/delete-user}}`);

  this.$('input').val('wrong@email.com').trigger('change');
  this.$('button').click();

  assert.equal(this.$('.form-field--errors').text(), 'Incorrect email. Please re-enter your e-mail.');
});

test(('Correct submission, when reauthentication is needed, should trigger that'), function(assert) {
  set(this, 'firebaseApp.needReauth', true);
  this.render(hbs`{{#delete-user}}{{/delete-user}}`);

  this.$('input').val('example@test.com').trigger('change');
  this.$('button').click();

  assert.notEqual(this.$('.form-field--errors').text(), 'Incorrect email. Please re-enter your e-mail.');
  assert.ok(get(this, 'reauthenticate.shouldReauthenticate'));
});