Login.Router = Backbone.Router.extend({
  routes: {
    "/m/login": "defaultMobile",
    "/login": "defaultFunction"
  },
  defaultMobile: function() {
    self.currentRequest = new Login.Views.Mobile();
    rbr.loadCss("css/modules/login/login.mobile.css","login", function(){
      self.currentRequest.render();
    });
  },
  defaultFunction: function() {
    var self = this;
    self.currentRequest = new Login.Views.Desktop();
    rbr.loadCss("css/modules/login/login.desktop.css","login", function(){
      self.currentRequest.render();
    });
  }
});