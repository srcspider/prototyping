module.exports = function (grunt) {

	var path = require('path');

//// Grunt Configuration ///////////////////////////////////////////////////////

	grunt.initConfig({

		// access to package.json values
		pkg: grunt.file.readJSON('package.json'),
		builddate: '<%= grunt.template.today("yyyy-mm-dd") %>',
		buildname: '<%= pkg.name %>-<%= pkg.version %>',
		buildbanner: '<%= buildname %>, build: <%= builddate %>',

		// Servers
		// -------

		express: {
			project: {
				options: {
					port: 3000,
					script: 'staging/server/<%= pkg.version %>/server.js'
				}
			}
		},

		shell: {
			mongodb: {
				command: 'mongod --dbpath ./persistence/db',
				options: {
					async: true,
					stdout: true,
					stderr: true,
					failOnError: true,
					execOptions: {
						cwd: '.'
					},

				}
			}
		},

		wait: {
			mongodb: { options: { delay: 2500 } }
		},

		// Scripts
		// -------

		// compile jsx to javascript
		react: {
			options: {
				harmony: false
			},
			project: {
				files: [{
					expand: true,
					cwd: 'sources/javascript',
					src: [ '**/*.js' ],
					dest: 'staging/theme/public/javascript/jsx',
					ext: '.js'
				}]
			},
			watchedfile: {
				expand: true,
				cwd: 'sources/javascript',
				src: 'modified/file.js',
				dest: 'staging/theme/public/javascript/jsx',
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
				loopfunc: true, // supress loop function error
				globals: {
					jQuery: true  // assume jquery
				},
			},
			project: [ 'staging/theme/public/javascript/jsx/**/*.js' ],
			watchedfile: 'modified/file.js',
		},

		// minify javascript
		uglify: {
			options: {
				banner: '/*! <%= buildbanner %> */\n',
				sourceMap: true,
				mangle: false,
				beautify: true
			},
			project: {
				src: [
					'staging/theme/public/javascript/lib/**/*.js',
					'staging/theme/public/javascript/jsx/**/*.js',
				],
				dest: 'staging/theme/public/javascript/scripts.js'
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
					dest: 'staging/theme/public/images'
				}]
			},
			watchedfile: {
				expand: true,
				cwd: 'sources/images',
				src: 'modified/file',
				dest: 'staging/theme/public/images'
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
					cwd: 'staging/theme/public/css',
					src: '**/*.css',
					dest: 'staging/theme/public/css/'
				}]
			}
		},

		// Misc Files
		// ----------

		rename: {
			server_conf: {
				src: 'staging/server/server.conf.json',
				dest: 'staging/server/server.conf.json-draft'
			}
		},

		copy: {

			// server related

			server: {
				expand: true,
				cwd: 'sources/server/',
				src: '**/*',
				dest: 'staging/server/<%= pkg.version %>/'
			},

			packageinfo: {
				src: 'package.json',
				dest: 'staging/server/<%= pkg.version %>/package.json'
			},

			serverconf: {
				src: 'sources/server.conf.json',
				dest: 'staging/server/server.conf.json'
			},

			// theme files

			theme: {
				files: [
					{
						expand: true,
						cwd: 'sources/theme',
						src: '*.html',
						dest: 'staging/theme/'
					},
					{
						src: 'sources/theme/theme.js',
						dest: 'staging/theme/theme.js'
					}
				]
			},

			watchedthemefile: {
				expand: true,
				cwd: 'sources/theme/',
				src: 'modified/file.html',
				dest: 'staging/theme/'
			},

			publicfiles: {
				expand: true,
				cwd: 'sources/theme/public/',
				src: '**/*',
				dest: 'staging/theme/public/'
			},

			// public files

			misc: {
				files: [
					{
						expand: true,
						cwd: 'sources',
						src: '*.html',
						dest: 'staging/theme/public/'
					},
					{
						expand: true,
						flatten: true,
						src: 'sources/dependencies/fontawesome/fonts/**/*',
						dest: 'staging/theme/public/fonts/'
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
						dest: 'staging/theme/public/css/scss/'
					}
				]
			},

			sass_watchedfile: {
				expand: true,
				flatten: true,
				cwd: 'sources/scss/',
				src: 'modified/file.scss',
				dest: 'staging/theme/public/css/scss/'
			},

			scripts: {
				files: [
					{
						expand: true,
						cwd: 'sources/dependencies/',
						src: '**/*.js',
						dest: 'staging/theme/public/javascript/lib/'
					}
				]
			}
		},

		// Utilities
		// ---------

		clean: {
			project: [
				'staging/tmp',
				'staging/theme',
				'staging/server'
			],
			release: [
				'staging/theme/public/css/scss',
				'staging/theme/public/css/**/*.map',
				'staging/theme/public/css/**/*.patch',
				'staging/theme/public/javascript/jsx',
				'staging/theme/public/javascript/**/*.map'
			]
		},

		exec: {
			sass: {
				command: [
					'bundle exec sass',
					'--sourcemap',
					'--update staging/theme/public/css/scss/:staging/theme/public/css/',
					'--load-path sources/scss',
					'--style expanded',
					'-E utf-8'
				].join(' '),
				stdout: true,
				stderr: true
			}
		},

		compress: {
			release_theme: {
				options: {
					mode: 'zip',
					pretty: true,
					archive: 'releases/<%= buildname %>-theme.zip'
				},
				files: [
					{
						expand: true,
						cwd: 'staging/theme/',
						src: ['**/*'],
						dest: '.'
					}
				]
			},
			release_server: {
				options: {
					mode: 'zip',
					pretty: true,
					archive: 'releases/<%= buildname %>-server.zip'
				},
				files: [
					{
						expand: true,
						cwd: 'staging/server/',
						src: ['**/*'],
						dest: '.'
					}
				]
			}
		},

		concat: {
			vendorcss: {
				src: [ 'sources/dependencies/**/*.css' ],
				dest: 'staging/theme/public/css/vendor.css'
			}
		},

		replace: {
			serverfix: {
				src: 'staging/server/server.conf.json',
				overwrite: true, // overwrite matched source files
				replacements: [
					{
						// ensure draft server.conf.json can't be used as-is
						from: /do-not-use-these-keys-in-production/g,
						to: ''
					}
				]
			},
			removedevdeps: {
				src: 'staging/server/<%= pkg.version %>/package.json',
				overwrite: true, // overwrite matched source files
				replacements: [
					{
						// ensure draft server.conf.json can't be used as-is
						from: /\n[\t ]+\"devDependencies\"\: \{[^}]*\},/g,
						to: ''
					}
				]
			},
			cssmapsfix: {
				src: ['staging/theme/public/css/**/*.map'],
				overwrite: true, // overwrite matched source files
				replacements: [
					{
						from: /\\\\/g,
						to: '/'
					}
				]
			},
			jsmapsfix: {
				src: ['staging/theme/public/javascript/**/*.map'],
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
			theme: {
				options: {
					spawn: false,
					livereload: 8000
				},
				files: [ 'sources/theme/**/*.html' ],
				tasks: [ 'copy:watchedthemefile' ],
			},
			server_conf: {
				options: {
					spawn: false,
					livereload: 8000
				},
				files: [ 'sources/server.conf.json' ],
				tasks: [ 'copy:serverconf' ],
			},
			misc: {
				options: {
					spawn: false,
					livereload: 8000
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
					livereload: 8000,
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
				files: [ 'sources/javascript/**/*.js' ],
				tasks: [
					'react:watchedfile',
					'jshint:watchedfile',
					'uglify:project',
					'replace:jsmapsfix'
				]
			},
			vendorjs: {
				options: {
					spawn: false,
				},
				files: [ 'sources/lib/**/*.js' ],
				tasks: [
					'react:project',
					'copy:scripts',
					'jshint:project',
					'uglify:project',
					'replace:jsmapsfix',
				]
			},
			server: {
				options: {
					spawn: false,
					livereload: 8000
				},
				files: [ 'sources/server/**/*' ],
				tasks: [ 'copy:server' ]
			},
			express: {
				files:  [ 'sources/server/**/*' ],
				tasks:  [ 'express:project' ],
				options: {
					spawn: false
				}
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
			var relative_filepath = filepath.replace('sources/javascript/', '');
			grunt.config('react.watchedfile.src', relative_filepath);
			grunt.config('jshint.watchedfile', 'staging/theme/public/javascript/jsx/' + relative_filepath);
		}
		else if (target == 'images') {
			var relative_filepath = filepath.replace('sources/images/', '');
			grunt.config('imagemin.watchedfile.src', relative_filepath);
		}
		else if (target == 'theme') {
			var relative_filepath = filepath.replace('sources/theme/', '');
			grunt.config('copy.watchedthemefile.src', relative_filepath);
		}
	});

//// Task Definitions //////////////////////////////////////////////////////////

	// server
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-shell-spawn'); // used for mongodb instance
	grunt.loadNpmTasks('grunt-wait');

	// utilities
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-rename');

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
			'imagemin:project',
			// themes
			'copy:theme',
			'copy:publicfiles',
			// server tasks
			'copy:server',
			'copy:serverconf'
		]
	);

	// release task
	grunt.registerTask(
		'stage',
		[
			'default',
			'clean:release',
			'replace:serverfix',
			'copy:packageinfo',
			'replace:removedevdeps',
			'rename:server_conf'
		]
	);

	grunt.registerTask(
		'release',
		[
			'stage',
			'compress:release_server',
			'compress:release_theme'
		]
	);

	// server task
	grunt.registerTask(
		'server',
		[
			'default',
			'shell:mongodb',
			'wait:mongodb',
			'express:project',
			'watch'
		]
	);

};
