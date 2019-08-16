import Root from './treezjs/src/root/root.js';
import ColumnType from './treezjs/src/data/column/columnType.js';
import TableSourceType from './treezjs/src/data/table/tableSourceType.js';

window.createModel = function(){

    var root = new Root();

	var results = root.createResults();
	var data = results.createData();
	var table = data.createTable();

	var tableSource = table.createTableSource();
	tableSource.type = TableSourceType.sqLite;
	
	var treezExamplePath = 'D:/EclipseJava/workspaceTreez/TreezExamples';
	var sqLitePath = treezExamplePath + '/resources/example.sqlite';
		
	tableSource.filePath = sqLitePath;
	tableSource.tableName = 'example';

	return root;
	
}	
