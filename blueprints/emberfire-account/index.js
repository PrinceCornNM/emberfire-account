/* eslint-env node */
let RSVP = require('rsvp');

module.exports = {
  normalizeEntityName() {},
  afterInstall() {
    return RSVP.all([
      this.addAddonToProject('emberfire'),
      this.addAddonToProject('ember-notify')
    ]);
  }
};