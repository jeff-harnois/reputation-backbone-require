// Main Backbone Boilerplate build configuration file.
module.exports = function(grunt) {

  grunt.initConfig({

    lint: {
      files: ["main.app.js"]
    },

    clean: {
      folder: "dist",
      tmp: "/tmp/backbone"
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
      ]
    },

    min: {
      // "dist/build.js": ["dist/build.js"],
      "dist/main/release/app.js": ["dist/main/debug/app.js"],
      "dist/main/release/login.module.js": ["Modules/login.module.js"]
      // "dist/main/release/module1.module.js": ["Modules/module1.module.js"],
      // "dist/main/release/module2.module.js": ["Modules/module2.module.js"]
    }

  });

  grunt.loadNpmTasks('grunt-clean');
  grunt.loadNpmTasks('grunt-tpl');

  // Run the following tasks...
  grunt.registerTask('default', 'lint:files clean concat min');
  grunt.registerTask('dev', 'lint:files clean concat');
};