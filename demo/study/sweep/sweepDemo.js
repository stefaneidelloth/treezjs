import Root from './src/root/root.js';

window.createModel = function(){

	var root = new Root();

	var models = root.createModels();
	

	//generic input
	var genericInput = models.createGenericInput();
	
	genericInput.createDoubleVariable('x', 10.0);
	genericInput.createDoubleVariable('y', 20.0);
	
	var resourcePath = 'D:/treez/example/';
	
	//executable
	var inputPath = resourcePath + 'input.txt';
	var outputPath = resourcePath + 'outputData.txt';

	var executable = models.createExecutable();
	executable.executablePath = resourcePath + 'executable.bat';
	executable.inputPath = inputPath;
	executable.outputPath = outputPath;
	executable.includejobIdInInputFile = true;
	executable.includejobIdInOutputFile = true;

	//input file generator
	var inputFileGenerator = executable.createInputFileGenerator();
	inputFileGenerator.templateFilePath = resourcePath + 'template.txt';
	inputFileGenerator.inputPath = inputPath;
	
	inputFileGenerator.nameExpression = '<name>';
	inputFileGenerator.valueExpression = '<value>';
	
	inputFileGenerator.includejobIdInInputFile = true;
	inputFileGenerator.idDeletingUnassignedRows = false;

	//table import
	var tableImport = model.createTableImport();
	tableImport.resultTableModelPath = 'root.results.data.table';
	tableImport.appendData = false;	

	//studies------------------------------------------------------------
	var studies = root.createStudies();
	
	//sweep
	let sweep = studies.createSweep();
	sweep.studyId = 'myStudyId';
	sweep.studyDescription = 'myStudyDescription';
	sweep.modelToRunModelPath = 'root.models';
	sweep.sourceModelPath = 'root.models.genericInput';
	

	var xRange = sweep.createIntegerRange('x');
	xRange.relativeSourceVariableModelPath = 'x';
	xRange.values = [1,2,3,4,5,6,7,8,9];

	var yRange = sweep.createIntegerRange('y');
	yRange.relativeSourceVariableModelPath = 'y';
	yRange.values = [10,20,30,40,50,60,70,80,90];

	var studyInfoExport = sweep.createStudyInfoExport();
	studyInfoExport.studyInfoExportType = StudyInfoExportType.MYSQL;
	studyInfoExport.host = 'dagobah';
	studyInfoExport.port = '3366';
	studyInfoExport.user = 'root';
	studyInfoExport.password = '***';
	studyInfoExport.schema = '170817_eload_hh+mob+hp';

	//results------------------------------------------------------------
	var results = root.createResults();
		
	var data = results.createData();

	var table = data.createTable();
	
	return root;

}

