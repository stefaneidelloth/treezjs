var TEST_REGEXP = /(spec)\.js$/i;
var allTestFiles = [];

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
    // then do not normalize the paths
    var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '');
    allTestFiles.push(normalizedTestModule);
	
	console.log(normalizedTestModule);
  }
});

var moduleFolder = '/node_modules';

console.log('configuring requirejs');

require.config({
	
	baseUrl : '/base',
	paths : {
		'd3' : moduleFolder + '/d3/d3.min',				
		'jquery' : moduleFolder + '/jquery/dist/jquery.min',
		'golden-layout' : moduleFolder + '/golden-layout/dist/goldenlayout.min',
		'codemirror' : moduleFolder + '/codemirror',
		'squire': moduleFolder + '/Squire.js/src/Squire'
	},
	bundles : {
		'lib/orion/code_edit/built-codeEdit-amd' : ['orion/codeEdit', 'orion/Deferred']
	},

	// dynamically load all test files
	deps: allTestFiles,

	// we have to kickoff jasmine, as it is asynchronous
	callback: window.__karma__.start
});