$(function() {
  // All navigation that is relative should be passed through the navigate
    // method, to be processed by the router.  If the link has a data-bypass
    // attribute, bypass the delegation completely.
  $(document).on("click", "a[data-bypass]", function(evt) {
    // Get the anchor href and protcol
    var href = $(this).attr("href");
    var protocol = this.protocol + "//";

    // Ensure the protocol is not part of URL, meaning its relative.
    if (href && href.slice(0, protocol.length) !== protocol) {
      // Stop the default event to ensure the link will not cause a page
      // refresh.
      evt.preventDefault();

      // This uses the default router defined above, and not any routers
      // that may be placed in modules.  To have this work globally (at the
      // cost of losing all route events) you can change the following line
      // to: Backbone.history.navigate(href, true);
      if ($(this).attr('data-silent') === true) {
        Backbone.history.navigate(href, {trigger: true, replace: true});
      } else {
        Backbone.history.navigate(href, true);
      }
    }
  });
});