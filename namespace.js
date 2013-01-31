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

    console.log('tpl');
    console.log(tpl);
    console.log("info");
    console.log(info);


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