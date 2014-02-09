module.exports = function (grunt) {

//// Grunt Configuration ///////////////////////////////////////////////////////

	grunt.initConfig({

		// access to package.json values
		pkg: grunt.file.readJSON('package.json'),
		builddate: '<%= grunt.template.today("yyyy-mm-dd") %>',
		buildname: '<%= pkg.name %>-<%= pkg.version %>',
		buildbanner: '<%= buildname %>, build: <%= builddate %>',

		// Scripts
		// -------

		// compile jsx to javascript
		react: {
			project: {
				files: [{
					expand: true,
					cwd: 'sources/jsx',
					src: [ '**/*.js' ],
					dest: 'build/public/js/jsx',
					ext: '.js'
				}]
			},
			watchedfile: {
				expand: true,
				cwd: 'sources/jsx',
				src: 'modified/file.js',
				dest: 'build/public/js/jsx',
				ext: '.js'
			}
		},

		// check javascript for nonsense
		jshint: {
			// see: http://www.jshint.com/docs/options/
			options: {
				curly: true,    // always write quirly braces
				eqeqeq: true,   // warnings on using ==
				eqnull: true,   // supress eqeqeq warnings on "var == null"
				browser: true,  // assume browser
				evil: true,     // supress use of eval warnings
				globals: {
					jQuery: true  // assume jquery
				}
			},
			project: [ 'build/public/js/jsx/**/*.js' ],
			watchedfile: 'modified/file.js',
		},

		// minify javascript
		uglify: {
			options: {
				banner: '/*! <%= buildbanner %> */\n',
				sourceMap: true
			},
			project: {
				src: [
					'build/public/js/lib/**/*.js',
					'build/public/js/jsx/**/*.js',
				],
				dest: 'build/public/js/scripts.js'
			}
		},

		// Styles
		// ------

		// see: exec:sass

		imagemin: {
			options: {
				optimizationLevel: 3
			},
			project: {
				files: [{
					expand: true,
					cwd: 'sources/images',
					src: [ '**/*.{png,jpg,jpeg,gif}' ],
					dest: 'build/public/images'
				}]
			},
			watchedfile: {
				expand: true,
				cwd: 'sources/images',
				src: 'modified/file',
				dest: 'build/public/images'
			}
		},

		autoprefixer: {
			project: {
				options: {
					browsers: ['last 2 version', 'ie 8', 'ie 9'],
					map: true,
					diff: true
				},
				files: [{
					expand: true,
					cwd: 'build/public/css',
					src: '**/*.css',
					dest: 'build/public/css/'
				}]
			}
		},

		// Misc Files
		// ----------

		copy: {
			misc: {
				files: [
					{
						expand: true,
						cwd: 'sources',
						src: '*.html',
						dest: 'build/public/'
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
						src: '**/*.scss',
						dest: 'build/public/css/scss/'
					}
				]
			},
			sass_watchedfile: {
				expand: true,
				flatten: true,
				cwd: 'sources/scss/',
				src: 'modified/file.scss',
				dest: 'build/public/css/scss/'
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
			project: [
				'build/tmp',
				'build/public'
			]
		},

		exec: {
			sass: {
				command: [
					'bundle exec sass',
					'--sourcemap',
					'--update build/public/css/scss/:build/public/css/',
					'--load-path sources/scss',
					'--style expanded',
					'-E utf-8'
				].join(' '),
				stdout: true,
				stderr: true
			}
		},

		compress: {
			release: {
				options: {
					mode: 'zip',
					pretty: true,
					archive: 'releases/<%= buildname %>.zip'
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
			cssmapsfix: {
				src: ['build/public/css/**/*.map'],
				overwrite: true, // overwrite matched source files
				replacements: [
					{
						from: /\\\\/g,
						to: '/'
					}
				]
			},
			jsmapsfix: {
				src: ['build/public/js/**/*.map'],
				overwrite: true, // overwrite matched source files
				replacements: [
					{
						from: /\\\\/g,
						to: '/'
					}
				]
			}
		},

		// running `grunt watch` will have grunt run all of the following
		// definitions simultaniously in the same console window :)
		watch: {
			misc: {
				options: {
					spawn: false,
					livereload: true
				},
				files: [ 'sources/*.html' ],
				tasks: [ 'copy:misc' ]
			},
			images: {
				options: {
					spawn: false
				},
				files: [ 'sources/images/**/*.{png,jpg,jpeg,gif}' ],
				tasks: [ 'imagemin:watchedfile' ]
			},
			styles: {
				options: {
					spawn: false,
					livereload: true,
				},
				files: [ 'sources/scss/**/*.scss' ],
				tasks: [
					'copy:sass_watchedfile',
					'exec:sass',
					'autoprefixer:project',
					'replace:cssmapsfix'
				]
			},
			scripts: {
				options: {
					spawn: false,
				},
				files: [ 'sources/jsx/**/*.js' ],
				tasks: [
					'react:watchedfile',
					'jshint:watchedfile',
					'uglify:project',
					'replace:jsmapsfix'
				]
			}
		},

	});

//// Filtering Watch Tasks /////////////////////////////////////////////////////

	grunt.event.on('watch', function(action, filepath, target) {
		filepath = filepath.replace(/\\/g, '/');
		if (target == 'styles') {
			var relative_filepath = filepath.replace('sources/scss/', '');
			grunt.config('copy.sass_watchedfile.src', relative_filepath);
		}
		else if (target == 'scripts') {
			var relative_filepath = filepath.replace('sources/jsx/', '');
			grunt.config('react.watchedfile.src', relative_filepath);
			grunt.config('jshint.watchedfile', 'build/public/js/jsx/' + relative_filepath);
		}
		else if (target == 'images') {
			var relative_filepath = filepath.replace('sources/images/', '');
			grunt.config('imagemin.watchedfile.src', relative_filepath);
		}
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
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-autoprefixer');

	// default task
	grunt.registerTask(
		'default',
		[
			'clean:project',
			// scripts tasks
			'react:project',
			'copy:scripts',
			'jshint:project',
			'uglify:project',
			'replace:jsmapsfix',
			// style tasks
			'copy:sass',
			'exec:sass',
			'autoprefixer',
			'copy:misc',
			'concat:vendorcss',
			'replace:cssmapsfix',
			'imagemin:project'
		]
	);

	// release task
	grunt.registerTask(
		'release',
		[
			'default',
			'compress:release'
		]
	);

};