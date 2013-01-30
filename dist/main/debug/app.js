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
        var match, count, obj = {}, mod,
            substr, data = [];
        

        function indexes(source, find) {
          var result = [];
          for(i = 0;i < source.length; i++) {
            if (source.substring(i, i + find.length) == find) {
              result.push(i);
            }
          }
          return result;
        }

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

              var Arr = oldSplat.split('/'),
                  numTrue = 0,
                  options = [];
              _.each(Arr, function(e, i) {
                if (e === '') {
                  Arr.splice(i, i+1);
                }
              });

              _.each(mod.routes, function(e, i) {
                var a = [];
                a = i.split('/');
                _.each(a, function(el, ind) {
                  if (el === '') {
                    a.splice(ind, ind+1);
                  }
                });
                
                obj[e] = a;
              });
              
              _.each(obj, function(e, i) {
                if (e.length === Arr.length) {
                  numTrue = 0;
                  _.each(e, function(el, ind){
                    if (el === Arr[ind]) {
                      numTrue = numTrue + 1;
                    } else {
                      if (el.indexOf(':') !== -1) {
                        numTrue = numTrue + 1;
                        options.push(Arr[ind].replace(':',''));
                      } else {
                        numTrue = numTrue - 1;
                      }
                    }
                  });
                  if (numTrue === Arr.length) {
                    mod[i].apply(this, options);
                  }
                }
              });
            }
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