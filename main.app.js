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
      "*splat":"defaultFunction"
      // "stream": "getStream"
    },

    // entity_id: "templateVar($entity_id)",
    // user_id: "templateVar($user_id)",
    // name: "templateVar($eName)",

    // getStream: function() {
    //   var self = this;
    //   require([
    //     "stream.js"
    //   ],
    //   function(module) {

    //   });
    // }


    defaultFunction: function(splat) {
      var self = this;
      console.log('defaultFunction');

      // main.app.navigate("personal-data", {trigger: true});
      // require([
      //   "/dist/main/debug/module1.js"
      // ],
      // function(module) {

      // });
    }
  });

  // Define the master router on the application namespace and trigger all
  // navigation from this instance.
  main.app = new main.Router();

  // Trigger the initial route
  Backbone.history.start({ pushState: false });
});