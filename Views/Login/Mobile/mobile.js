Mobile = Backbone.View.extend({
  template: "mobile",
  render: function() {
    $('body').html(main.fetchAndRender(this.template, {partial: ["m-login", "m-override"]}));
  }
});