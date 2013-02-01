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
      "/m/login": "defaultMobile",
      "/login": "defaultFunction"
    },
    defaultMobile: function() {
      self.currentRequest = new Firstmodule.Views.Mobile();
      self.currentRequest.render();
    },
    defaultFunction: function() {
      var self = this;
      self.currentRequest = new Firstmodule.Views.Desktop();
      self.currentRequest.render();
    }
  });

  // Default View.
  Firstmodule.Views.Desktop = Backbone.View.extend({
    template: "embed",
    render: function() {
      var isPhone = false;
      if (main.app.isPhone === true) {
        isPhone = "isPhone";
      }
      $('body').html(main.fetchAndRender(this.template, {partial: ["d-login", "d-override"], isPhone: isPhone}));
      $('body').append('<link type="text/css" rel="stylesheet" href="http://qa.reputation.com/pub/assets/css/w_loggedout_2201718d2492d8180437c23f86913006.css"><link type="text/css" rel="stylesheet" href="http://qa.reputation.com/pub/assets/css/p_login_a6a7110d244b46e311ef9a21a8aabe99.css">');
    }
  });

  Firstmodule.Views.Mobile = Backbone.View.extend({
    template: "mobile",
    render: function() {
      $('body').html(main.fetchAndRender(this.template, {partial: ["m-login", "m-override"]}));
    }
  });

  // Return the module for AMD compliance.
  return Firstmodule;

});
