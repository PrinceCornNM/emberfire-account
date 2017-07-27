import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

const {
  RSVP,
  Service,
  get,
  set
} = Ember;

const firebaseStub = Service.extend({
  emailVerified: false,
  shouldError: false,

  auth() {
    let emailVerified = get(this, 'emailVerified');
    let error = get(this, 'shouldError');
    return {
      currentUser: {
        emailVerified,
        email: 'example@test.com',
        sendEmailVerification() {
          return new RSVP.Promise((resolve, reject) => {
            if (error) {
              reject({ code: 'ERROR' });
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
  lastMessage: '',
  alert(message) {
    set(this, 'lastMessage', message);
  },
  info(message) {
    set(this, 'lastMessage', message);
  }
});

moduleForComponent('verify-email', 'Integration | Component | verify email', {
  integration: true,
  beforeEach() {
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
  set(this, 'firebaseApp.emailVerified', true);
  this.render(hbs`{{#verify-email}}{{/verify-email}}`);

  assert.equal(this.$().text().trim().substring(0, 23), 'Send Email Verification');
  assert.equal(this.$('button').length, 0);
});

test('Sends a Verification Email', function(assert) {
  this.render(hbs`{{#verify-email}}{{/verify-email}}`);
  this.$('button').click();

  assert.equal(get(this, 'notify.lastMessage'), 'Email verification was sent, please check your inbox');
});

test('Checks if the user has been verified before sending email', function(assert) {
  this.render(hbs`{{#verify-email}}{{/verify-email}}`);
  set(this, 'firebaseApp.emailVerified', true);
  this.$('button').click();

  assert.equal(get(this, 'notify.lastMessage'), 'Error: Your email is already verified');
});

test('Responds to errors', function(assert) {
  this.render(hbs`{{#verify-email}}{{/verify-email}}`);
  set(this, 'firebaseApp.shouldError', true);
  this.$('button').click();

  assert.equal(get(this, 'notify.lastMessage'), 'Error: ERROR');
});
