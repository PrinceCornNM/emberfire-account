import Application from '../../app';
import config from '../../config/environment';
import { merge } from '@ember/polyfills';
import { run } from '@ember/runloop';

const {
  merge,
  run
} = Ember;

export default function startApp(attrs) {
  let attributes = merge({}, config.APP);
  attributes = merge(attributes, attrs); // use defaults, but you can override;

<<<<<<< HEAD
  let attributes = merge({}, config.APP);
  attributes = merge(attributes, attrs); // use defaults, but you can override;

  run(() => {
    application = Application.create(attributes);
=======
  return run(() => {
    let application = Application.create(attributes);
>>>>>>> fa3a27c... diff
    application.setupForTesting();
    application.injectTestHelpers();
    return application;
  });
}
