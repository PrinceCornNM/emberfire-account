import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

const configStub = Ember.Service.extend({
  links: {
    'account.test': 'Test Link'
  }
});

moduleForComponent('account-menu', 'Integration | Component | account menu', {
  integration: true,
  beforeEach(){
    this.register('service:account-config', configStub);
  }
});

test('it renders', function(assert) {
  this.render(hbs`{{#account-menu}}{{/account-menu}}`);

  assert.equal(this.$().text().trim().substring(0, 9), "Test Link");
});
