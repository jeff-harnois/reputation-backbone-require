// Firstmodule module
define([
  // Application.
  ""
],

// Map dependencies from above array.
function() {

  // Create a new module.
  var Firstmodule = main.module();

  Firstmodule.Router = Backbone.Router.extend({
    routes: {
      "/a": "defaultFunction",
      "/a/test": "newTest"
    },
    defaultFunction: function() {
      var self = this;
      console.log('[view] default function');
    },
    newTest: function() {
      console.log('new test');
      // this.currentRequest = Firstmodule.Views.Start();
      // this.currentRequest.render();
    }
  });

  // Default View.
  Firstmodule.Views.Start = Backbone.View.extend({
    template: "embed",
    render: function() {

    }
  });

  // Return the module for AMD compliance.
  return Firstmodule;

});
