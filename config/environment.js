/*jshint node:true*/
'use strict';

module.exports = function(environment) {
  const ENV = {
    modulePrefix: 'emberfire-account',
    environment: environment,
    emberfireAccount: {
      hardDelete: false
    }
  }

  return ENV;
};