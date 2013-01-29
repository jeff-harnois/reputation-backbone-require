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
      "/b/test/:page": "newTest",
      "/b/test/:page/p/:test": "newTest"
    },
    defaultFunction: function() {
      var self = this;
      console.log('router default function');
    },
    newTest: function() {
      console.log('new test');
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
