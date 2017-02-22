import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('update-password', 'Integration | Component | update password', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{#update-password}}{{/update-password}}`);
  // console.log(this.$().text().trim(), );

  // assert.ok(find('.ef-account-form-title').text(), 'Password');
  assert.ok(this.$().text().substring(0, 15), "Change Password");
});
