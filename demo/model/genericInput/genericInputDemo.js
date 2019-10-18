import Root from './src/root/root.js';

window.createModel = function(){

	var root = new Root();
	
	var models = root.createModels();	

	//generic input
	var genericInput = models.createGenericInput();
	
	genericInput.createDoubleVariable('x', 10.0);
	genericInput.createDoubleVariable('y', 20.0);	
	
	return root;

};

