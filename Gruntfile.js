module.exports = function(grunt) {
	'use strict';

	var mozjpeg = require('imagemin-mozjpeg');

	require('time-grunt')(grunt);
	require('jit-grunt')(grunt, {
		customTasksDir: 'pack/grunt'
	});

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		pureConfig: grunt.file.readJSON('config.json'),
		devPath: pureConfig.dirs.mode + '/' + pureConfig.path.dev,
		prodPath: pureConfig.dirs.mode + '/' + pureConfig.path.prod,
		deployPath: pureConfig.path.deploy,
		garbagePath: pureConfig.dirs.mode + '/' + pureConfig.path.garbage,
		releasePath: pureConfig.path.release,

		// Postcss Config
		postcss: {
			options: {
				processors: [
					require('pixrem')(), // add fallbacks for rem units
					require('autoprefixer')({
						// https://github.com/ai/browserslist
						browsers:  [
							'Android 2.3',
							'Android >= 4',
							'Chrome >= 36',
							'Firefox >= 33',
							'Explorer >= 8',
							'iOS >= 6',
							'Opera >= 26',
							'Safari >= 6'
						]
					}),
					require('cssnano')() // minify the result
				],
				map: true
			},
			prefix: {
				src: 'garbage/css/main.css',
				dest: '<%= devPath %>/css/main.css'
			}
		},

		// Combine Media Queries Config
		combine_mq: {
			main: {
				options: {
					beautify: false
				},
				src: 'src/test.css',
				dest: '<%= devPath %>/main.css'
			}
		},

		// Clean Config
		clean: {
			dev: ['<%= devPath %>/'],
			prod: ['<%= prodPath %>/'],
			deploy: ['<%= deployPath %>/'],
			garbage: ['<%= garbagePath %>/'],
			release: ['<%= releasePath %>/<%= pkg.version %>'],
			maps: [
				'<%= devPath %>/assets/css/*.map',
				'<%= devPath %>/assets/js/*.map'],
			all: [
				'<%= devPath %>/',
				'<%= prodPath %>/',
				'<%= deployPath %>/',
				'<%= garbagePath %>/',
				'<%= releasePath %>/<%= pkg.version %>'
			]
		},

		// Concat Config
		concat: {
			options: {
				stripBanners: true,
				banner: '<%= pureConfig.banner %>\n'
			},
			js: {
				options: {
					sourceMap: true
				},
				src: ['<%= envPath %>/css/main.css', 'src/sass/plugins/jquery.mmenu.all.css'],
				dest: '<%= envPath %>/css/main.css'
			},
			vendor: {
				src: ['<%= envPath %>/css/main.css', 'src/sass/plugins/jquery.mmenu.all.css'],
				dest: '<%= envPath %>/css/main.css'
			},
			css: {
				src: ['<%= envPath %>/css/main.css', 'src/sass/plugins/jquery.mmenu.all.css'],
				dest: '<%= envPath %>/css/main.css'
			}
		},

		// Copy Config
		copy: {
			fonts: {
				expand: true,
				cwd: '<%= srcPath %>',
				src: ['fonts/**'],
				dest: '<%= envPath %>/css/'
			},
			vendor: {
				expand: true,
				cwd: '<%= srcPath %>',
				src: ['vendor/**'],
				dest: '<%= envPath %>/css/'
			},
			js: {
				expand: true,
				cwd: '<%= srcPath %>',
				src: ['fonts/**'],
				dest: '<%= envPath %>/css/'
			},
			css: {
				expand: true,
				cwd: '<%= srcPath %>',
				src: ['fonts/**'],
				dest: '<%= envPath %>/css/'
			},
			img: {
				expand: true,
				cwd: '<%= srcPath %>',
				src: ['img/**/*.{png,jpg,gif,svg}'],
				dest: '<%= envPath %>/css/'
			},
			deploy: {
				expand: true,
				cwd: '<%= srcPath %>',
				src: ['**', '!*.html'],
				dest: '<%= envPath %>/css/'
			},
			components: {
				files: [
					{
						src: ['bower_components/classlist/classList.min.js'],
						dest: 'src/js/libs/classList.min.js',
						filter: 'isFile'
					},
					{
						src    : ['bower_components/html5shiv/dist/html5shiv.min.js'],
						dest   : 'src/vendor/html5shiv.min.js',
						filter : 'isFile'
					},
					{
						src    : ['bower_components/jquery/dist/jquery.min.js'],
						dest   : 'src/vendor/jquery.min.js',
						filter : 'isFile'
					},
					{
						expand : true,
						cwd    : 'bower_components/bootstrap-sass-official/assets/javascripts/',
						src    : ['bootstrap.js'],
						dest   : 'src/vendor/'
					},
					{
						expand : true,
						cwd    : 'bower_components/bootstrap-sass-official/assets/stylesheets/',
						src    : ['bootstrap/**'],
						dest   : 'src/sass/'
					}
				]
			}
		},

		// Cssmin Config
		cssmin: {
			options: {
				keepSpecialComments: 1,
				shorthandCompacting: false,
				roundingPrecision: -1,
				restructuring: false,
				rebase: false
			},
			target: {
				files: [{
					expand: true,
					cwd: 'release/css',
					src: ['*.css', '!*.min.css'],
					dest: 'release/css',
					ext: '.min.css'
				}]
			}
		},

		// Imgmin Config
		imagemin: {
			dynamic: {
				options: {
					// Target options
					optimizationLevel: 7, // png
					progressive: true, // jpg
					interlaced: true, // gif
					svgoPlugins: [
						{ removeViewBox: false },               // don't remove the viewbox atribute from the SVG
						{ removeUselessStrokeAndFill: false },  // don't remove Useless Strokes and Fills
						{ removeEmptyAttrs: false }             // don't remove Empty Attributes from the SVG
					],
					use: [mozjpeg()]
				},
				// Another target
				files: [{
					expand: true,                  // Enable dynamic expansion
					cwd: 'src/',                   // Src matches are relative to this path
					src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
					dest: 'dist/'                  // Destination path prefix
				}]
			}
		},

		// Jshint Config : grunt jshint:beforeconcat concat jshint:afterconcat
		jshint: {
			options: {
				"node": true,
				"browser": true,
				"esnext": true,
				"bitwise": true,
				"camelcase": true,
				"curly": true,
				"eqeqeq": true,
				"immed": true,
				"indent": 4,
				"newcap": true,
				"noarg": true,
				"quotmark": "single",
				"undef": true,
				"unused": "vars",
				"strict": true,
				"trailing": true,
				"smarttabs": true,
				"devel": true,
				"latedef": true,
				"globals": {
					"console": true,
					"$": false,
					"jQuery": false
				}
			},
			beforeconcat: ['src/foo.js', 'src/bar.js'],
			afterconcat: ['dist/output.js']
		},

		// Uglify Config
		uglify: {
			my_target: {
				options: {
					banner: '<%= pureConfig.banner %>\n',
					sourceMap: true
				},
				files: [{
					expand: true,
					cwd: 'src/js',
					src: '**/*.js',
					dest: 'dest/js'
				}]
			}
		},

		// Replace Config
		replace: {
			dist: {
				options: {
					patterns: [
						{
							match: 'foo',
							replacement: 'bar'
						}
					]
				},
				files: [{
					expand: true,
					flatten: true,
					src: ['src/index.html'],
					dest: 'build/'
				}]
			}
		},

		// Notify Config
		// This is optional!
		notify_hooks: {
			options: {
				enabled: true,
				max_jshint_notifications: 5, // maximum number of notifications from jshint output
				title: "Project Name", // defaults to the name in package.json, or will use project directory's name
				success: false, // whether successful grunt executions should be notified automatically
				duration: 3 // the duration of notification in seconds, for notify-send only
			}
		},
		notify: {
			task_name: {
				options: {
					// Task-specific options go here.
				}
			},
			watch: {
				options: {
					title: 'Task Complete',  // optional
					message: 'SASS and Uglify finished running' //required
				}
			},
			server: {
				options: {
					message: 'Server is ready!'
				}
			}
		},

		// Watch Config
		watch: {
			sass: {
				files: "app/scss/*.scss",
				tasks: ['sass'],
				options: {
					interrupt: true,
					debounceDelay: 250,
					event: ['added', 'deleted'], // all|changed|added|deleted
					reload: true
				}
			},
			js: {
				files: "app/scss/*.scss",
				tasks: ['sass']
			},
			vendor: {
				files: "app/scss/*.scss",
				tasks: ['sass']
			},
			jade: {
				files: "app/scss/*.scss",
				tasks: ['sass']
			},
			img: {
				files: "app/scss/*.scss",
				tasks: ['sass']
			},
			font: {
				files: "app/scss/*.scss",
				tasks: ['sass']
			}
		},

		// SASS Config
		sass: {
			dist: {
				files: [{
					expand: true,
					cwd: 'styles',
					src: ['*.scss'],
					dest: '../public',
					ext: '.css'
				}]
			}
		},

		// Preprocess Config
		preprocess : {
			options: {
				context : {
					DEBUG: false
				}
			},
			html : {
				src : 'test/test.html',
				dest : 'test/test.processed.html'
			},
			js : {
				src : 'test/test.js',
				dest : 'test/test.processed.js'
			}
		},

		// Jade Config
		jade: {
			theme_basic: {
				options: {
					data: {
						debug: false
					}
				},
				files: {
					"path/to/dest.html": ["path/to/templates/*.jade", "another/path/tmpl.jade"]
				}
			},
			release: {
				options: {
					data: {
						debug: false
					}
				},
				files: {
					"release.html": "test.jade"
				}
			}
		},

		// Browsersync Config
		browserSync: {
			dev: {
				bsFiles: {
					src : 'assets/css/style.css'
				},
				options: {
					// Change the default port
					ui: {
						port: 3000
					},
					// Use a specific port (instead of the one auto-detected by Browsersync)
					port: 8080,
					files: ["app/css/style.css", "app/js/*.js"],
					// When your app also uses web sockets
					// NOTE: requires 2.8.1 or above
					proxy: {
						target: "http://yourlocal.dev",
						ws: false
					},
					// Multiple base directories
					server: {
						baseDir: ["app", "dist"]
					},
					// Here you can disable/enable each feature individually
					ghostMode: {
						clicks: true,
						forms: true,
						scroll: true
					},
					// Show me additional info about the process
					logLevel: "debug",
					logPrefix: "My Awesome Project",
					// Will not attempt to determine your network status, assumes you're ONLINE.
					online: true,
					// Open the localhost URL
					open: "local", // false|local|external|ui|tunnel
					// Open the site in Chrome & Firefox
					browser: ["google chrome", "firefox"],
					// Append '.xip.io' to the hostname. (eg: http://192.168.0.4.xip.io:3002)
					xip: true,
					// don't auto-reload all browsers following a Browsersync reload
					reloadOnRestart: false,
					// Don't show any notifications in the browser.
					notify: false,
					// Wait for 2 seconds before any browsers should try to inject/reload a file.
					reloadDelay: 2000,
					// Don't minify the client-side JS
					minify: false,
					// Override host detection if you know the correct IP to use
					host: "192.168.1.1",
					// Don't send any file-change events to browsers
					codeSync: false
				}
			}
		},

		// Pageres Config
		pageres: {
			screenshot: {
				options: {
					urls: 'yeoman.io',
					sizes: ['1200x800', '800x600'],
					dest: 'dist',
//					Available variables:
//
//					url: The URL in slugified form, eg. http://yeoman.io/blog/ becomes yeoman.io!blog
//					size: Specified size, eg. 1024x1000
//					width: Width of the specified size, eg. 1024
//					height: Height of the specified size, eg. 1000
//					crop: Outputs -cropped when the crop option is true
//					date: The current date (Y-M-d), eg. 2015-05-18
//					time: The current time (h-m-s), eg. 21-15-11
					filename: '{{date}} - {{url}}-{{size}}{{crop}}',
//					selector: '',
//					username: '',
//					password: '',
//					scale: 1,
//					format: 'jpg', // jpg|png
//					userAgent: '',
//					headers: ''
				}
			},
			multipleUrls: {
				options: {
					urls: ['todomvc.com', 'google.com'],
					sizes: ['800x1000', '400x1000'],
					dest: 'dist',
					crop: true
				}
			}
		}
	});

};