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
      "/b/test/:page/p/:test": "pageTest"
      // "/b/test/:page/p/:test": "pageTest",
      // "/b/routes/:route": "routeTest"
    },
    defaultFunction: function() {
      var self = this;
      // console.log('router default function');
      // console.log('backbone history fragment');
      // console.log('/'+Backbone.history.fragment);
      // main.app.navigate(Backbone.history.fragment, {trigger: true, replace: true});
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
    routeTest: function(route) {
      console.log('[view] routeTest is '+route);
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
