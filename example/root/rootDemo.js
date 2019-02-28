import Root from './src/root/root.js';

window.createModel = function(){

	var root = new Root();	
	
	root.createModels();

	root.createStudies();
	
	root.createResults();
	
	return root;

};
