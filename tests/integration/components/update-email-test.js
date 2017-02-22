import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('update-email', 'Integration | Component | update email', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{#update-email}}{{/update-email}}`);
  assert.ok(this.$().text().trim().substring(0, 12), "Update Email");
});
