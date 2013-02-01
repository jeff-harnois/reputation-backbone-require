// Main Backbone Boilerplate build configuration file.
module.exports = function(grunt) {

  grunt.initConfig({

    lint: {
      files: ["Modules/**/*.js", "main.app.js"]
    },

    clean: {
      folder: "dist",
      tmp: "/tmp/backbone"
    },

    tpl: {
      "/tmp/backbone/module1/templates.js": [
        "Templates/embed.mustache",
        "Templates/mobile.mustache",
        "Templates/d-login.mustache",
        "Templates/m-login.mustache",
        "Templates/d-override.mustache",
        "Templates/m-override.mustache"
      ],
      "/tmp/backbone/module2/templates.js": [
        "Templates/embed.mustache",
        "Templates/mobile.mustache"
      ]
    },

    concat: {
      // Libs files
      "dist/build.js": [
        "libs/jquery-require-amd.js",
        "libs/underscore-amd.js",
        "libs/backbone.js",
        "rbr.js",
        "libs/hogan.js"
      ],
      // Application files
      "dist/main/debug/app.js": [
        "namespace.js",
        "routes.js",
        "main.app.js",
        "main.js",
        "namespace.js"
      ],
      // Module files
      "dist/main/debug/module1.module.js": [
        "Modules/module1.module.js",
        "/tmp/backbone/module1/**/*.js"
      ],
      "dist/main/debug/module2.module.js": [
        "Modules/module2.module.js",
        "/tmp/backbone/module2/**/*.js"
      ]
    },

    min: {
      // "dist/build.js": ["dist/build.js"],
      "dist/main/release/app.js": ["dist/main/debug/app.js"],
      "dist/main/release/module1.module.js": ["dist/main/debug/module1.module.js"],
      "dist/main/release/module2.module.js": ["dist/main/debug/module2.module.js"]
    }
  });

  grunt.loadNpmTasks('grunt-clean');
  grunt.loadNpmTasks('grunt-tpl');

  // Run the following tasks...
  grunt.registerTask('default', 'lint:files clean tpl concat min');
};