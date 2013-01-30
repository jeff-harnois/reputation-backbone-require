// Treat the jQuery ready function as the entry point to the application.
// Inside this function, kick-off all initialization, everything up to this
// point should be definitions.
jQuery(function($) {
  // Defining the application router
  main.Router = Backbone.Router.extend({
    routes: {
      "*splat": "handleMainRoute"
    },

    // templateVars will be rendered here

    // entity_id: "templateVar($entity_id)",
    // user_id: "templateVar($user_id)",
    // name: "templateVar($eName)",

    handleMainRoute: function(splat) {
      var self = this,
          route = {},
          currRoute,
          oldSplat = null;

      route = {
        "a": {
          "global": "Module1",
          "router": "module1" 
        },
        "b": {
          "global": "Module2",
          "router": "module2" 
        }
      };

      if (splat.indexOf('/') !== -1) {
        oldSplat = "/"+splat;
        splat = splat.slice(0,splat.indexOf('/'));
      }
      
      currRoute = route[splat];

      require([
        "/dist/main/debug/"+currRoute.router+".module.js"
      ],
      function(module) {
        var mod, extractedRoute;
        
        window[currRoute.global] = module;
        mod = new module.Router();

        // this block of logic is written to figure out which subroute to use
        // and then calls that subroute with the params;

        // if there is a route
        if (oldSplat !== null) {
          if (mod.routes) {

            // if there is subrouting in the module
            if (mod.routes[oldSplat]) {

              // if the route matches exactly with a router from the module
              mod[mod.routes[oldSplat]]();
            } else {

              // else we need to use the helper function to see if the route
              // exists.
              extractedRoute = rbr.extractRoutes(oldSplat, mod);
              if (extractedRoute !== null) {
                mod[extractedRoute[0]].apply(this, extractedRoute[1]);
              }
            }
          }
        } else {
          mod.defaultFunction();
        }
      });
    }
  });

  // Define the master router on the application namespace and trigger all
  // navigation from this instance.
  main.app = new main.Router();

  // Trigger the initial route
  Backbone.history.start({ pushState: false });
});
