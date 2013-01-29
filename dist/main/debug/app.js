this['templates'] = this.templates || {};

this['templates']['embed'] = '<div class="embed"> {{> partial}} </div>';

var main = {
  // Assist with code organization, by breaking up logical components of code
  // into modules.
  module: function() {
    // Internal module cache.
    var modules = {};

    // Create a new module reference scaffold or load an existing module.
    return function(name) {
      // If this module has already been created, return it.
      if (modules[name]) {
        return modules[name];
      }

      // Create a module and save it under this name
      return modules[name] = { Views: {} };
    };
  }(),

  fetchAndRender: function(tpl,info) {
    window.Templates = window.templates || {};

    // make sure that the template has been Templatized
    if (Templates[tpl]) {
      var h = Hogan.compile(Templates[tpl]);
      var partial = {};
      if (info && info.partial) {
        if (typeof(info.partial) === 'object') {
          if (info.partial.length > 1) {
            partial.partial = Hogan.compile(Templates[info.partial[0]]);
          }
          for (var i in info.partial) {
            partial[info.partial[i]] = Hogan.compile(Templates[info.partial[i]]);
          }
        } else {

          // include the partial as {{> partial}} and {{> partialName}} so it can be referenced with and without a wrapper
          partial.partial = Hogan.compile(Templates[info.partial]);
          partial[info.partial] = Hogan.compile(Templates[info.partial]);
        }
        return h.render(info,partial);
      } else if (info){
          
        // no partials, just render the template with data
        return h.render(info);
      } else {

        // just a plain render with no data
        return h.render();
      }
    }
  },

  // Keep active application instances namespaced under an app object.
  app: _.extend({}, Backbone.Events)
};

// Treat the jQuery ready function as the entry point to the application.
// Inside this function, kick-off all initialization, everything up to this
// point should be definitions.
jQuery(function($) {

  // define all the possible modules


  // Defining the application router
  main.Router = Backbone.Router.extend({
    routes: {
      // "a": "a",
      // "b": "b"
      "*splat": "defaultFunction"
      // ":page": "defaultFunction",
      // ":page/:route": "defaultFunction"
      // "stream": "getStream"
    },

    // templateVars will be rendered here

    // entity_id: "templateVar($entity_id)",
    // user_id: "templateVar($user_id)",
    // name: "templateVar($eName)",


    defaultFunction: function(splat) {
      var self = this,
          route = {
            "a": {
              "global": "Module1",
              "router": "module1" 
            },
            "b": {
              "global": "Module2",
              "router": "module2" 
            }
          },
          currRoute,
          oldSplat = null;
      if (splat.indexOf('/') !== -1) {
        console.log('!== -1');
        oldSplat = "/"+splat;
        splat = splat.slice(0,splat.indexOf('/'));
      }
      currRoute = route[splat];
      console.log('defaultFunction' + splat);
      console.log(oldSplat);

      require([
        "/dist/main/debug/"+currRoute.router+".module.js"
      ],
      function(module) {
        var Obj;
        window[currRoute.global] = module;
        this[currRoute.router] = new module.Router();
        if (oldSplat !== null) {
          if (this[currRoute.router].routes) {
            if (this[currRoute.router].routes[oldSplat]) {
              this[currRoute.router][this[currRoute.router].routes[oldSplat]]();
            } else {
              var obj = {}, match, matches = [];
              _.each(this[currRoute.router].routes, function(v, k) {
                match = k.match(/:\w+/g);
                if (match !== null) {
                  _.each(match, function(e) {
                    if (matches.indexOf(e.replace(':','')) === -1) {
                      matches.push(e.replace(':',''));
                    }
                  });
                }
              });
              // this[currRoute.router][this[currRoute.router].routes[oldSplat]](matches);
              console.log('matches');
              console.log(matches);
            }
          }


        }
      });

      // if (splat === "a") {
      //   require([
      //     "/dist/main/debug/module1.module.js"
      //   ],
      //   function(module) {
      //     // module.init();
      //     console.log('callback');
      //     console.log(module);
      //     Module1 = module;
      //     this.module1 = new Module1.Router();
      //     this.module1.defaultFunction();
      //   });
      // } else if (splat === "b") {
      //   require([
      //     "/dist/main/debug/module2.module.js"
      //   ],
      //   function(module) {
      //     // module.init();
      //     console.log('callback');
      //     console.log(module);
      //     Module2 = module;
      //     this.module2 = new Module2.Router();
      //     this.module2.defaultFunction();
      //   });
      // }
    }

    // b: function() {
    //   var self = this;
    //   console.log('defaultFunction b');

    //   require([
    //     "/dist/main/debug/module2.module.js"
    //   ],
    //   function(module) {
    //     // module.init();
    //     console.log('callback');
    //     console.log(module);
    //     Module2 = module;
    //     this.module2 = new Module2.Router();
    //     this.module2.defaultFunction();
    //   });
    // }
  });

  // Define the master router on the application namespace and trigger all
  // navigation from this instance.
  main.app = new main.Router();

  // Trigger the initial route
  Backbone.history.start({ pushState: false });
});


jQuery(function() {
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