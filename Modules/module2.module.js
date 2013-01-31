// Secondmodule module
define([
  // Application.
  ""
],

// Map dependencies from above array.
function() {

  // Create a new module.
  var Secondmodule = main.module();

  Secondmodule.Router = Backbone.Router.extend({
    routes: {
      "/b/test": "newTest",
      "/b/test/:page": "page",
      "/b/test/:page/p/:test": "pageTest",
      "/m/b/test": "mobileTest",
      "/m/b/test/:page": "mobilePage",
      "/m/b/test/:page/p/:test": "mobilePageTest"
      // "/b/test/:page/p/:test": "pageTest",
      // "/b/routes/:route": "routeTest"
    },
    newTest: function() {
      console.log('[view] new test');
      // this.currentRequest = Secondmodule.Views.Start();
      // this.currentRequest.render(); 
    },
    page: function(page) {
      console.log('[view] page is '+page);
    },
    pageTest: function(page, test) {
      console.log('[view] pageTest is '+page+' and '+test);
    },
    mobileTest: function() {
      alert('[mobile view] new test');
      // this.currentRequest = Secondmodule.Views.Start();
      // this.currentRequest.render(); 
    },
    mobilePage: function(page) {
      alert('[mobile view] page test is '+page);
      // this.currentRequest = Secondmodule.Views.Start();
      // this.currentRequest.render(); 
    },
    mobilePageTest: function(page, test) {
      alert('[mobile view] pageTest is '+page+' and '+test);
      // this.currentRequest = Secondmodule.Views.Start();
      // this.currentRequest.render(); 
    }
  });

  // Default View.
  Secondmodule.Views.Start = Backbone.View.extend({
    template: "embed",
    render: function() {

    }
  });

  // Return the module for AMD compliance.
  return Secondmodule;

});
