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
            dest: 'build/tmp/jsx',
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
      all: [ 'build/tmp/jsx/**/*.js' ]
    },

    // minify javascript
    uglify: {
      options: {
        banner: '/*! '+build_info+' */\n'
      },
      all: {
        src: [
          'sources/lib/**/*.js',
          'build/tmp/jsx/components/**/*.js',
          'build/tmp/jsx/app/**/*.js',
          'build/tmp/jsx/*.js'
        ],
        dest: 'build/public/scripts.min.js'
      }
    },

    // Styles
    // ------

    sass: {
      all: {
        options: {
          style: 'expanded'
        },
        files: [
          {
            expand: true,
            cwd: 'sources/scss',
            src: [ '**/*.scss' ],
            dest: 'build/tmp/scss/',
            ext: '.css'
          }
        ]
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 version', 'ie 8', 'ie 9'],
        map: true,
        diff: true
      },
      all: {
        expand: true,
        cwd: 'build/tmp',
        src: 'scss/**/*.css',
        dest: '../prefixed.scss/'
      }
    },

    // Misc Files
    // ----------

    copy: {
      all: {
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
        command: 'sass --update sources/scss/:build/tmp/scss/ --load-path sources/scss --style expanded',
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
      all: {
        src: [ 'sources/lib/**/*.css', 'build/tmp/scss/**/*.css' ],
        dest: 'build/tmp/unprefixed.styles.min.css'
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
          'sass'
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
  grunt.loadNpmTasks('grunt-exec');

  // scripts
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-react');

  // styles
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');

  // default task
  grunt.registerTask(
    'default',
    [
      'clean',
      'react',
      'jshint',
      'uglify',
      'sass',
      'autoprefixer',
      'copy',
      'concat'
    ]
  );

  // debug task
  grunt.registerTask(
    'exec-test',
    [
      'clean',
      'react',
      'jshint',
      'uglify',
      'exec:sass',
      'autoprefixer',
      'copy',
      'concat'
    ]
  );

  // debug task
  grunt.registerTask(
    'sass-test',
    [
      'clean',
      'react',
      'jshint',
      'uglify',
      'sass',
      'autoprefixer',
      'copy',
      'concat'
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