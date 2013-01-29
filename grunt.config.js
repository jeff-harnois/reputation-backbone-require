// Main Backbone Boilerplate build configuration file.
module.exports = function(grunt) {

  grunt.initConfig({

    lint: {
      // files: ["src/on/config.js", "src/on/**/*.js"]
      files: ["**/*.js"]
    },

    clean: {
      // folder: "../Assets/Apps",
      // tmpDir: "/tmp/backbone"
      folder: "dist"
    },

    tpl: {
      // "/tmp/backbone/templates.js": ["templates/**/*.mustache"]
    },

    // namespace: {
    //   "../Assets/Apps/on/debug/js/namespace.js": ["namespace.mustache"]
    // },

    concat: {
      // Application files
      // "../Assets/Apps/on/debug/js/app.js": [
      //   "../Assets/Apps/on/debug/js/templates.js", 
      //   "../Assets/Apps/on/debug/js/namespace.js",
      //   "src/on/modules/**/*.js",
      //   "src/on/on.app.js",
      //   "main.js",
      //   "models/MyPrivacyManager/loadEntityAttributes.js",
      //   "models/SearchResultsManager/getSearchResults.js"
      // ]
    },

    min: {
      // "../Assets/Apps/on/release/js/app.js": ["../Assets/Apps/on/debug/js/app.js"],
      // "../Assets/Apps/on/release/js/templates.js": ["../Assets/Apps/on/debug/js/templates.js"]
    },

    memrev: {
      // 'smarty-artie': ['../Assets/Apps/on/release/js/*.js','../Assets/Apps/on/js/*.js']
    }
  });

  // up 2 directories on -> src
  // grunt.file.setBase('../../');

  grunt.loadNpmTasks('grunt-clean');
  grunt.loadNpmTasks('grunt-memrev');
  grunt.loadNpmTasks('grunt-tpl');
  // grunt.loadNpmTasks('grunt-namespace');

  // Run the following tasks...
  // grunt.registerTask('default', 'lint:files clean namespace tpl concat min memrev');
  grunt.registerTask('default', 'lint:files clean tpl concat min memrev');

};