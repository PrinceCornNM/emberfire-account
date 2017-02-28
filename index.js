/* jshint node: true */
'use strict';

module.exports = {
	name: 'emberfire-account',
	isDevelopingAddon: function() {
		return true;
	},
	included: function (app) {
    this._super.included.apply(this, arguments);
    app.import('bower_components/firebase/firebase.js');

    // if (isFastBoot()) {
    //   this.importFastBootDependencies(host);
    // } else {
    //   this.importBrowserDependencies(host);
    // }
  },

  // treeForVendor: function(vendorTree) {
  //   var trees = [];

  //   if (vendorTree) {
  //     trees.push(vendorTree);
  //   }

  //   if (isFastBoot()) {
  //     trees.push(funnel(path.join(__dirname, './assets'), {
  //       files: ['firebase.js']
  //     }));
  //   }

    // return mergeTrees(trees);
  // }
};