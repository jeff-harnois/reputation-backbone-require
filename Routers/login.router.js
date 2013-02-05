Login.Router = Backbone.Router.extend({
  routes: {
    "/m/login": "defaultMobile",
    "/login": "defaultFunction"
  },
  defaultMobile: function() {
    rbr.loadCss("css/modules/login/login.mobile.css","login");
    self.currentRequest = new Login.Views.Mobile();
    self.currentRequest.render();
  },
  defaultFunction: function() {
    var self = this;
    rbr.loadCss("css/modules/login/login.desktop.css","login");
    self.currentRequest = new Login.Views.Desktop();
    self.currentRequest.render();
  }
});