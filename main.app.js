// Treat the jQuery ready function as the entry point to the application.
// Inside this function, kick-off all initialization, everything up to this
// point should be definitions.
(function($, ua) {
  // Defining the application router
  main.Router = Backbone.Router.extend({
    routes: {
      "*splat": "handleMainRoute"
    },

    // "global" variable storage
    isMobile: false,
    mobileOverride: false,

    initialize: function() {
      var self = this;
      if ((/iPhone|iPod|iPad|Android|BlackBerry|Opera Mini|IEMobile/).test(ua)) {
        self.isMobile = true;
      }
    },

    overrideMobile: function(override) {
      if (!override || override === false) {
        this.mobileOverride = false;
        main.app.navigate("//m/"+Backbone.history.getFragment(), true);
      } else {
        this.mobileOverride = true;
        var url = Backbone.history.getFragment().replace('m/','');
        main.app.navigate("//"+url, true);
      }
    },

    handleMainRoute: function(splat) {
      var self = this,
          route = {},
          currRoute,
          mobileSplat,
          url,
          oldSplat = null,
          mod;

      // this is the route object, it's basically an .htaccess rule set, and is defined in routes.js
      route = rbr.routes;

      // mobile/desktop redirects
      if (self.isMobile === true && self.mobileOverride === false && (splat.indexOf('m/') === -1 || splat.indexOf('m/') !== 0)) {
        // if this is a phone, and the display hasn't been overridden and m/ isn't at the beginning of the hash, 
        // redirect them to the mobile url set

        main.app.navigate("//m/"+Backbone.history.getFragment(), true);
        return false;
      } else if ((self.isMobile === false || self.mobileOverride === true) && splat.indexOf('m/') === 0) {
        // if this isn't a phone or they have over-ridden the mobile display and m/ is at the beginning of the hash,
        // redirect them to the desktop url set

        url = Backbone.history.getFragment().replace('m/','');
        main.app.navigate("//"+url, true);
        return false;
      }

      // if this is anything other than a basic request, save the old splat
      if (splat.indexOf('/') !== -1) {
        oldSplat = "/"+splat;

        // if this is a mobile device and they haven't overridden, update the splat to grab the correct module
        if (self.isMobile === true && self.mobileOverride === false && splat.indexOf('m/') === 0) {
          splat = splat.replace("m/", "");
        }
        // if there is still a /, grab the first word before the /, this is the module
        if (splat.indexOf('/') !== -1) {
          splat = splat.slice(0,splat.indexOf('/'));
        }
        // else it is assumes that the hash is simply to the module
      }
      
      // get the module names from the route object
      currRoute = route[splat];

      // grab the module based on the currRoute
      mod = "/dist/main/debug/"+currRoute.toLowerCase()+".module.js";
      
      // now that we know what we need to grab, require in that module
      require([
        mod
      ],
      function(module) {
        // module is loaded
        var m, 
            extractedRoute;
        
        // save that module to the window so it's accessible later if it's needed
        window[currRoute] = module;
        // create the new router object
        m = new module.Router();

        // this block of logic is written to figure out which subroute to use
        // and then calls that subroute with the params;

        // if there is a route
        if (oldSplat !== null) {
          if (m.routes) {

            // if there is subrouting in the module
            if (m.routes[oldSplat]) {

              // if the route matches exactly with a router from the module
              m[m.routes[oldSplat]]();
            } else {

              // else we need to use the helper function to see if the route exists.
              extractedRoute = rbr.extractRoutes(oldSplat, m);

              // assuming that we have a route that matches, call it
              if (extractedRoute !== null) {
                m[extractedRoute[0]].apply(this, extractedRoute[1]);
              }
            }
          }
        } else {

          // as a last resort, let's see if there is a defaultFunction and try and call that
          if (typeof(m.defaultFunction) === 'function') {
            m.defaultFunction();
          }
        }
      });
    }
  });

  // Define the master router on the application namespace and trigger all
  // navigation from this instance.
  main.app = new main.Router();

  // Trigger the initial route
  Backbone.history.start({ pushState: false });
})(jQuery, navigator.userAgent || navigator.vendor || window.opera);