import Root from './src/root/root.js';

window.createModel = function(){

	var root = new Root();
	
	var models = root.createModels();
	

	//generic input
	var genericInput = models.createGenericInput();
	
	genericInput.createDoubleVariable("x", 10.0);
	genericInput.createDoubleVariable("y", 20.0);
	
	var resourcePath = "D:/treezjs/example/";

	//executable
	var inputPath = resourcePath + "input.txt";
	var outputPath = resourcePath + "outputData.txt";

	var executable = models.createExecutable();
	executable.executablePath = resourcePath + "executable.bat";
	executable.inputPath = inputPath;
	executable.outputPath = outputPath;
		
	var inputFileGenerator = executable.createInputFileGenerator();
	inputFileGenerator.templatePath = resourcePath + "template.txt";
	inputFileGenerator.inputPath = inputPath;
	
	inputFileGenerator.nameExpression = '<name>';
	inputFileGenerator.valueExpression = '<value>';	
	
	return root;

};