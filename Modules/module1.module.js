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
      "/m/a": "defaultMobile",
      "/a": "defaultFunction"
    },
    defaultMobile: function() {
      self.currentRequest = new Firstmodule.Views.Mobile();
      self.currentRequest.render();
    },
    defaultFunction: function() {
      var self = this;
      console.log('[view] default function');
      self.currentRequest = new Firstmodule.Views.Desktop();
      self.currentRequest.render();
    }
  });

  // Default View.
  Firstmodule.Views.Desktop = Backbone.View.extend({
    template: "embed",
    render: function() {
      $('body').html(main.fetchAndRender(this.template, {}));
    }
  });

  Firstmodule.Views.Mobile = Backbone.View.extend({
    template: "mobile",
    render: function() {
      $('body').html(main.fetchAndRender(this.template, {}));
    }
  });

  // Return the module for AMD compliance.
  return Firstmodule;

});
