import Root from './treezjs/src/root/root.js';
import ColumnType from './treezjs/src/data/column/columnType.js';
import TableSourceType from './treezjs/src/data/table/tableSourceType.js';

window.createModel = function(){

    var root = new Root();

	var models = root.createModels();

	var executable = models.createExecutable();
	var tableImport = executable.createTableImport();
	tableImport.type = TableSourceType.sqLite;
	tableImport.linkSource = true;
	tableImport.inheritSourceFilePath = false;
	tableImport.sourceFilePath = 'D:/EclipseJava/workspaceTreez/TreezExamples/resources/example.sqlite';
	tableImport.tableName = 'example';
	tableImport.resultTableModelPath = 'root.results.data.table';

	var results = root.createResults();
	var data = results.createData();
	data.createTable();
	
	return root;
	
}
