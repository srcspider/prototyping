module.exports = function (grunt) {

//// Grunt Configuration ///////////////////////////////////////////////////////

  grunt.initConfig({

    // access to package.json values
    pkg: grunt.file.readJSON('package.json'),

    // compile jsx to javascript
    react: {
      dynamic_mappings: {
        files: [
          {
            expand: true,
            cwd: 'sources/jsx',
            src: [ '**/*.js' ],
            dest: 'build/jsx',
            ext: '.js'
          }
        ]
      }
    },

    // check javascript for nonsense
    jshint: {
      // see: http://www.jshint.com/docs/options/
      options: {
        curly: true,    // always write quirly braces
        eqeqeq: true,   // warnings on using ==
        eqnull: true,   // supress eqeqeq warnings when doing "var == null"
        browser: true,  // assume browser
        evil: true,     // supress use of eval warnings
        globals: {
          jQuery: true  // assume jquery
        },
      },
      all: [ 'build/jsx/**/*.js' ]
    },

    // minify javascript
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      devel: {
        src: [
          'sources/lib/**/*.js',
          'build/jsx/components/**/*.js',
          'build/jsx/app/**/*.js',
          'build/jsx/*.js'
        ],
        dest: 'build/public/scripts.min.js'
      }
    },

  });

//// Task Definitions //////////////////////////////////////////////////////////

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-react');

  // default
  grunt.registerTask('default', ['react', 'jshint', 'uglify']);

};