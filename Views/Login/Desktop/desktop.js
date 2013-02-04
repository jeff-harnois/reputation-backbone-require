Desktop = Backbone.View.extend({
  template: "embed",
  render: function() {
    var isMobile = false;
    if (main.app.isMobile === true) {
      isMobile = "isMobile";
    }
    $('body').html(main.fetchAndRender(this.template, {partial: ["d-login", "d-override"], isMobile: isMobile}));
  }
});