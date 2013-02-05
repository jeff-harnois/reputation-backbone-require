// Main Backbone Boilerplate build configuration file.
module.exports = function(grunt) {

  grunt.initConfig({

    lint: {
      files: ["Views/**/*.js", "Routers/**/*.js"]
    },

    clean: { 
      tmp: "/tmp/backbone/login",
      css: "css/modules/login"
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
    },

    compass: {
      dev: {
        src: 'SASS',
        dest: 'css',
        specify: 'SASS/modules/login/**/*.sass',
        outputstyle: 'expanded',
        // basePath: '/',
        linecomments: true
      },
      prod: {
        src: 'SASS',
        dest: 'css',
        specify: 'SASS/modules/login/**/*.sass',
        outputstyle: 'compressed',
        // basePath: '/',
        forcecompile: true,
        linecomments: false
      }
    },

    watch: { // for development run 'grunt watch'
      compass: {
        files: ['SASS/modules/login/*.sass'],
        tasks: ['compass:dev']
      }
    },

    min: {
      // "dist/build.js": ["dist/build.js"],
      "dist/main/debug/login.module.js": ["Modules/login.module.js"]
    },

    copy: {
      main: {
        files: [
          {src: ['Modules/login.module.js'], dest: 'dist/main/debug/login.module.js'}
        ]
      }
    }

  });

  // up 2 directories configs ../ Modules ../ root
  grunt.file.setBase('../../');

  grunt.loadNpmTasks('grunt-clean');
  grunt.loadNpmTasks('grunt-tpl');
  grunt.loadNpmTasks('grunt-modules');
  grunt.loadNpmTasks('grunt-compass');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Run the following tasks...
  grunt.registerTask('default', 'lint:files clean compass:dev tpl modules copy');
  grunt.registerTask('prod', 'lint:files clean compass:dev tpl modules copy min');
};