// Main Backbone Boilerplate build configuration file.
module.exports = function(grunt) {

  grunt.initConfig({

    lint: {
      files: ["Views/**/*.js", "Routers/**/*.js"]
    },

    clean: { 
    //   folder: "dist",
      tmp: "/tmp/backbone/login"
    },

    tpl: {
      "/tmp/backbone/login/templates.js": [
        "Templates/embed.mustache",
        "Templates/mobile.mustache",
        "Templates/d-login.mustache",
        "Templates/m-login.mustache",
        "Templates/d-override.mustache",
        "Templates/m-override.mustache"
      ]
    },

    modules: {
      "Modules/login.module.js": [
        {
          name: "Login",
          files: {
            templates: [
              "/tmp/backbone/login/templates.js"
            ],
            views: [
              "Views/Login/Desktop/desktop.js",
              "Views/Login/Mobile/mobile.js"
            ],
            collections: [],
            models: [],
            routers: [
              "Routers/login.router.js"
            ]
          }
        }
      ]
    }

  });

  // up 2 directories configs ../ Modules ../ root
  grunt.file.setBase('../../');

  grunt.loadNpmTasks('grunt-clean');
  grunt.loadNpmTasks('grunt-tpl');
  grunt.loadNpmTasks('grunt-modules');

  // Run the following tasks...
  // grunt.registerTask('default', 'lint:files clean tpl concat min');
  grunt.registerTask('default', 'lint:files clean tpl modules');
};