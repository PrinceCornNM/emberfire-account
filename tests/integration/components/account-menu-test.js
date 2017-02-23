import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('account-menu', 'Integration | Component | account menu', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{#account-menu}}{{/account-menu}}`);

  assert.equal(this.$().text().trim(), "");
});
