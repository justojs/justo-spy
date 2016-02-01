module.exports = function(grunt) {
  "use strict";

  // Project configuration
  grunt.initConfig({
    // Metadata
    pkg: grunt.file.readJSON('package.json'),

    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= props.license %> */\n',

    // Task configuration
    babel: {
      options: {
        sourceMap: false,
        retainLines: true,
        comments: false,
        presets: ["es2015"]
      },

      es5: {
        files: {
          "build/es5/index.js": "index.js",
          "build/es5/lib/Call.js": "lib/Call.js",
          "build/es5/lib/CallableSpy.js": "lib/CallableSpy.js",
          "build/es5/lib/Calls.js": "lib/Calls.js",
          "build/es5/lib/FunctionCall.js": "lib/FunctionCall.js",
          "build/es5/lib/FunctionSpy.js": "lib/FunctionSpy.js",
          "build/es5/lib/ObjectSpy.js": "lib/ObjectSpy.js",
          "build/es5/lib/PropertyCall.js": "lib/PropertyCall.js",
          "build/es5/lib/PropertySpy.js": "lib/PropertySpy.js"
        }
      }
    },

    clean: {
      es5: {
        src: ["build/es5", "dist/es5"]
      }
    },

    copy: {
      nodejs: {
        files: [
          {cwd: "build/es5/", src: ["index.js", "lib/*.js"], dest: "dist/es5/nodejs/<%= pkg.name %>/", expand: true},
          {src: ["package.json", "README.md"], dest: "dist/es5/nodejs/<%= pkg.name %>/", expand: true}
        ]
      }
    },

    jshint: {
      gruntfile: {
        src: ["Gruntfile.js"]
      },

      lib: {
        options: {
          jshintrc: true
        },

        src: ["index.js", "lib/**"]
      },

      test: {
        options: {
          jshintrc: true,
          ignores: [
            "test/mocha.opts"
          ]
        },

        src: ["test/**"]
      }
    },

    mochaTest:{
      options: {
        ignoreLeaks: false,
        quiet: false,
        reporter: "spec",
        timeout: 1500
      },

      es5: {
        options: {
          require: [
            "justo-assert"
          ]
        },

        src: [
          "test/unit/index.js",
          "test/unit/lib/*.js"
        ]
      }
    }
  });

  // These plugins provide necessary tasks
  grunt.loadNpmTasks("grunt-babel");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks("grunt-mocha-test");
  grunt.loadNpmTasks("grunt-travis-lint");

  //aliases
  grunt.registerTask("buildes5", ["jshint", "clean:es5", "babel:es5", "copy:nodejs"]);
  grunt.registerTask("es5", ["buildes5", "mochaTest:es5"]);

  // Default task
  grunt.registerTask("default", []);
};
