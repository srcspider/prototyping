module.exports = function (grunt) {

//// Grunt Configuration ///////////////////////////////////////////////////////

  grunt.initConfig({

    // access to package.json values
    pkg: grunt.file.readJSON('package.json'),

    // compile jsx to javascript
    jsx: {
      devel: {
        src: 'sources/jsx/**/*.js',
        dest: 'build/jsx/'
        output_rule: {
          regexp: /fixtures\/(.*).jsx/,
          replace: 'tmp\/$1.js',
        }
      }
    },

    // check javascript for nonsense
    jshint: {
      all: ['build/js/**/*.js']
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
  grunt.loadNpmTasks('grunt-jsx');

  // default
  grunt.registerTask('default', ['jsx', 'jshint', 'uglify']);

};