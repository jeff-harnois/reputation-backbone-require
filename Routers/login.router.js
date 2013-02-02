Router = Backbone.Router.extend({
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