Login.Router = Backbone.Router.extend({
  routes: {
    "/m/login": "defaultMobile",
    "/login": "defaultFunction"
  },
  defaultMobile: function() {
    self.currentRequest = new Login.Views.Mobile();
    self.currentRequest.render();
  },
  defaultFunction: function() {
    var self = this;
    self.currentRequest = new Login.Views.Desktop();
    self.currentRequest.render();
  }
});