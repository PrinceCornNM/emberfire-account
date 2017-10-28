import { module } from 'qunit';
import { resolve } from 'rsvp';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

export default function(name, options = {}) {
  module(name, {
    beforeEach() {
      this.application = startApp();

      if (options.beforeEach) {
        return options.beforeEach.apply(this, arguments);
      }
    },

    async afterEach() {
      let afterEach = options.afterEach && options.afterEach.apply(this, arguments);
      await Promise.resolve(afterEach);
      destroyApp(this.application);
    }
  });
}
