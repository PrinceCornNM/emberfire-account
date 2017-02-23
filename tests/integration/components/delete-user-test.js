import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('delete-user', 'Integration | Component | delete user', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{#delete-user}}{{/delete-user}}`);

  assert.equal(this.$().text().trim().substring(0, 14), 'Delete Account');
});
