Desktop = Backbone.View.extend({
  template: "embed",
  render: function() {
    var isMobile = false;
    if (main.app.isMobile === true) {
      isMobile = "isMobile";
    }
    $('body').html(main.fetchAndRender(this.template, {partial: ["d-login", "d-override"], isMobile: isMobile}));
    $('body').append('<link type="text/css" rel="stylesheet" href="http://qa.reputation.com/pub/assets/css/w_loggedout_2201718d2492d8180437c23f86913006.css"><link type="text/css" rel="stylesheet" href="http://qa.reputation.com/pub/assets/css/p_login_a6a7110d244b46e311ef9a21a8aabe99.css">');
  }
});