// Main Backbone Boilerplate build configuration file.
module.exports = function(grunt) {

  grunt.initConfig({

    lint: {
      files: ["Modules/**/*.js", "main.app.js"]
    },

    clean: {
      folder: "dist"
    },

    tpl: {
      "/tmp/backbone/templates.js": ["Templates/**/*.mustache"]
    },

    concat: {
      // Libs files
      "dist/build.js": [
        "libs/jquery-require-amd.js",
        "libs/underscore-amd.js",
        "libs/backbone.js"
      ],
      // Application files
      "dist/main/debug/app.js": [
        "/tmp/backbone/templates.js", 
        "namespace.js",
        "main.app.js",
        "main.js",
        "namespace.js"
      ],
      // Module files
      "dist/main/debug/module1.module.js": [
        "Modules/module1.module.js"
      ],
      "dist/main/debug/module2.module.js": [
        "Modules/module2.module.js"
      ]
    },

    min: {
      "dist/build.js": ["dist/build.js"],
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