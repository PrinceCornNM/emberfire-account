import Service from '@ember/service';
import RSVP from 'rsvp';
import { set, get } from '@ember/object';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

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
        updateEmail() {
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
    successfulUpdateEmail: 'You have successfully updated your email!',
    unsuccessfulUpdateEmail: 'We were unable to update your email.'
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

moduleForComponent('update-email', 'Integration | Component | update email', {
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
  this.render(hbs`{{#update-email}}{{/update-email}}`);
  assert.ok(this.$().text().trim().substring(0, 12), 'Update Email');
});

test(('Correct submission, when reauthentication is needed, should trigger that'), function(assert) {
  set(this, 'firebaseApp.needReauth', true);

  this.render(hbs`{{#update-email}}{{/update-email}}`);

  this.$('input').first().val('new@example.com').trigger('change');
  this.$('input').last().val('new@example.com').trigger('change');
  this.$('button').click();

  assert.equal(get(this, 'notify.lastMessage'), 'We were unable to update your email.');
  assert.ok(get(this, 'reauthenticate.shouldReauthenticate'));
});

test(('Correct submission'), function(assert) {
  this.render(hbs`{{#update-email}}{{/update-email}}`);

  this.$('input').first().val('new@example.com').trigger('change');
  this.$('input').last().val('new@example.com').trigger('change');
  this.$('button').click();

  assert.equal(get(this, 'notify.lastMessage'), 'You have successfully updated your email!');
});

test(('If a submission is invalid, it should not pass'), function(assert) {
  this.render(hbs`{{#update-email}}{{/update-email}}`);

  this.$('input').first().val('notanemail').trigger('change');
  this.$('input').last().val('notanemail').trigger('change');
  this.$('button').click();

  // With a password that doesn't pass validation, notify should never be called.
  assert.equal(get(this, 'notify.lastMessage'), '');
});

test(('Password that don\'t match shouldn\'t run'), function(assert) {
  this.render(hbs`{{#update-email}}{{/update-email}}`);

  this.$('input').first().val('new@example.com').trigger('change');
  this.$('input').last().val('new@example.clam').trigger('change');
  this.$('button').click();

  // With a password that doesn't pass validation, notify should never be called.
  assert.equal(get(this, 'notify.lastMessage'), '');
});