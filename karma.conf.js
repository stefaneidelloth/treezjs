// Karma configuration
// Generated on Wed Jul 31 2019 16:46:09 GMT+0200 (GMT+02:00)



module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'requirejs'],


    // list of files / patterns to load in the browser
    files: [
		'node_modules/requirejs/require.js', 	
		'node_modules/karma-requirejs/lib/adapter.js', 			
        {pattern: 'bower_components/**/*.js', included: false},	
		{pattern: 'lib/**/*.js', included: false},	
		{pattern: 'src/**/*.js', included: false},	   
		{pattern: 'test/**/*.spec.js', included: false},	   
		'test/test-main.js'
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
	// needed to transform es6 tests to es5, since karma does not
	// support es6. 
	// Also see
	// https://stackoverflow.com/questions/47923536/using-es2015-with-mocha-karma-and-headless-chrome-for-testing
    preprocessors: {
		'test/**/*.spec.js': [ 'webpack'] //preprocess with webpack
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'kjhtml'],

	// setting up webpack configuration
    webpack: require('./webpack.test.config'),

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

	customLaunchers: {
		ChromeDebugging: {
		  base: 'Chrome',
		  flags: [ 'http://localhost:9876/debug.html' ] //'--auto-open-devtools-for-tabs',
		}
    },

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeDebugging'],
	
	plugins: [			   
            'karma-jasmine',                      
            'karma-chrome-launcher',  				
			'karma-jasmine-html-reporter',
			'karma-webpack',
			'karma-requirejs'
        ],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
