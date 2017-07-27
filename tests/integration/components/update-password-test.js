import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

const {
  Service,
  RSVP,
  get,
  set
} = Ember;

const sessionStub = Service.extend({
  isAuthenticated: true
});

const firebaseStub = Service.extend({
  needReauth: false,

  auth() {
    let reauth = get(this, 'needReauth');
    return {
      currentUser: {
        email: 'example@test.com',
        updatePassword() {
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

const configStub = Service.extend({
  messages: { // eslint-disable-line ember/avoid-leaking-state-in-components
    successfulUpdatePassword: 'You have successfully updated your password!',
    unsuccessfulUpdatePassword: 'We were unable to update your password.'
  }
});

const reauthenticateStub = Service.extend({
  shouldReauthenticate: false
});

const notifyStub = Service.extend({
  lastMessage: '',
  alert(message) {
    set(this, 'lastMessage', message);
  },
  success(message) {
    set(this, 'lastMessage', message);
  }
});

moduleForComponent('update-password', 'Integration | Component | update password', {
  integration: true,
  beforeEach() {
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

  assert.ok(this.$().text().trim().substring(0, 15), 'Change Password');
  assert.equal(this.$('input').length, 2, 'There should be two input fields');
});

test(('Correct submission, when reauthentication is needed, should trigger that'), function(assert) {
  set(this, 'firebaseApp.needReauth', true);

  this.render(hbs`{{#update-password}}{{/update-password}}`);

  this.$('input').first().val('newpassword').trigger('change');
  this.$('input').last().val('newpassword').trigger('change');
  this.$('button').click();

  assert.ok(get(this, 'reauthenticate.shouldReauthenticate'));
});

test(('Correct submission'), function(assert) {
  this.render(hbs`{{#update-password}}{{/update-password}}`);

  this.$('input').first().val('newpassword').trigger('change');
  this.$('input').last().val('newpassword').trigger('change');
  this.$('button').click();

  assert.equal(get(this, 'notify.lastMessage'), 'You have successfully updated your password!');
});

test(('If a submission is too short, it should not pass'), function(assert) {
  this.render(hbs`{{#update-password}}{{/update-password}}`);

  this.$('input').first().val('n').trigger('change');
  this.$('input').last().val('n').trigger('change');
  this.$('button').click();

  // With a password that doesn't pass validation, notify should never be called.
  assert.equal(get(this, 'notify.lastMessage'), '');
});

test(('Password that don\'t match shouldn\'t run'), function(assert) {
  this.render(hbs`{{#update-password}}{{/update-password}}`);

  this.$('input').first().val('newpassword').trigger('change');
  this.$('input').last().val('newpassword+').trigger('change');
  this.$('button').click();

  // With a password that doesn't pass validation, notify should never be called.
  assert.equal(get(this, 'notify.lastMessage'), '');
});