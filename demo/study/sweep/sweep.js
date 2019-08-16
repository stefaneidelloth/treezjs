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
	inputFileGenerator.sourceModelPath = 'root.models.genericInput';
	inputFileGenerator.inputPath = inputPath;
	
	inputFileGenerator.nameExpression = '<name>';
	inputFileGenerator.valueExpression = '<value>';
	
	//studies
	var studies = root.createStudies();

	//sweep	
	var sweep = studies.createSweep();
	sweep.id = 'myStudyId';
	sweep.description = 'myStudyDescription';	
	sweep.controlledModelPath = 'root.models';
	sweep.sourceModelPath = 'root.models.genericInput';
	
	var xRange = sweep.createDoubleRange('x');
	xRange.variablePath = 'root.models.genericInput.x';
	xRange.values = [1,2,3,4,5,6,7,8,9];
	
	var yRange = sweep.createDoubleRange('y');
	yRange.variablePath = 'root.models.genericInput.y';
	yRange.values = [10,20,30,40,50,60,70,80,90];


	//results
	var results = root.createResults();
		
	var data = results.createData();

	//var table = data.createTable();
	
	var page = results.createPage();
	
	var graph = page.createGraph();
	

	return root;

};