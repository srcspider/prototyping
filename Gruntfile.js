module.exports = function (grunt) {

//// Grunt Configuration ///////////////////////////////////////////////////////

  var build_info = '<%= pkg.name %>'
    + ' v<%= pkg.version %>'
    + ', build: <%= grunt.template.today("yyyy-mm-dd") %>';

  var build_name = '<%= pkg.name %>-v<%= pkg.version %>';

  grunt.initConfig({

    // access to package.json values
    pkg: grunt.file.readJSON('package.json'),

    // Scripts
    // -------

    // compile jsx to javascript
    react: {
      all: {
        files: [
          {
            expand: true,
            cwd: 'sources/jsx',
            src: [ '**/*.js' ],
            dest: 'build/public/js/jsx',
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
        }
      },
      all: [ 'build/public/js/jsx/**/*.js' ]
    },

    // minify javascript
    uglify: {
      options: {
        banner: '/*! '+build_info+' */\n',
        sourceMap: true
      },
      all: {
        src: [
          'build/public/js/lib/**/*.js',
          'build/public/js/jsx/**/*.js',
        ],
        dest: 'build/public/js/scripts.js'
      }
    },

    // Styles
    // ------

    autoprefixer: {
      options: {
        browsers: ['last 2 version', 'ie 8', 'ie 9'],
        map: true,
        diff: true
      },
      all: {
        expand: true,
        cwd: 'build/public/css',
        src: '**/*.css',
        dest: 'build/public/css/'
      }
    },

    // Misc Files
    // ----------

    copy: {
      misc: {
        files: [
          {
            src: 'sources/index.html',
            dest: 'build/public/index.html'
          },
          {
            expand: true,
            flatten: true,
            src: 'sources/lib/fontawesome/fonts/**/*',
            dest: 'build/public/fonts/'
          }
        ]
      },
      sass: {
        files: [
          {
            expand: true,
            flatten: true,
            cwd: 'sources/scss/',
            src: '**/*',
            dest: 'build/public/css/scss/'
          }
        ]
      },
      scripts: {
        files: [
          {
            expand: true,
            cwd: 'sources/lib/',
            src: '**/*.js',
            dest: 'build/public/js/lib/'
          }
        ]
      }
    },

    // Utilities
    // ---------

    clean: {
      all: [
        'build/tmp',
        'build/public'
      ]
    },

    exec: {
      sass: {
        command: 'sass --sourcemap --update build/public/css/scss/:build/public/css/ --load-path sources/scss --style expanded -E utf-8',
        stdout: true,
        stderr: true
      }
    },

    compress: {
      release: {
        options: {
          mode: 'zip',
          pretty: true,
          archive: 'releases/' + build_name + '.zip'
        },
        files: [
          {
            expand: true,
            cwd: 'build/public/',
            src: ['**/*'],
            dest: '.'
          }
        ]
      }
    },

    concat: {
      vendorcss: {
        src: [ 'sources/lib/**/*.css' ],
        dest: 'build/public/css/vendor.css'
      }
    },

    replace: {
      sourcemapsfix: {
        src: ['build/public/**/*.map'],
        overwrite: true, // overwrite matched source files
        replacements: [
          {
            from: /\\\\/g,
            to: '/'
          }
        ]
      }
    },

    watch: {
      scripts: {
        options: {
          spawn: false,
        },
        files: [ 'sources/**/*.js' ],
        tasks: [
          'react',
          'jshint',
          'uglify'
        ]
      },
      styles: {
        options: {
          spawn: false,
        },
        files: [ 'sources/**/*.scss' ],
        tasks: [
          'exec:sass'
        ]
      }
    },

  });

//// Task Definitions //////////////////////////////////////////////////////////

  // utilities
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-exec');

  // scripts
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-react');

  // styles
  grunt.loadNpmTasks('grunt-autoprefixer');

  // default task
  grunt.registerTask(
    'default',
    [
      'clean',
      'react',
      'copy:scripts',
      'jshint',
      'uglify',
      'copy:sass',
      'exec:sass',
      'autoprefixer',
      'copy:misc',
      'concat:vendorcss',
      'replace:sourcemapsfix'
    ]
  );

  // release task
  grunt.registerTask(
    'release',
    [
      'default',
      'compress'
    ]
  );

};