import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | delete');

test('visiting /account/delete', function(assert) {
  visit('/account/delete');

  andThen(function() {
    assert.equal(currentURL(), '/account/delete');
  });
});
