import Root from './treezjs/src/root/root.js';
import ColumnType from './treezjs/src/data/column/columnType.js';
import TableSourceType from './treezjs/src/data/table/tableSourceType.js';

window.createModel = function(){

    var root = new Root();

	var results = root.createResults();
	var data = results.createData();
	var table = data.createTable();

	var tableSource = table.createTableSource();
	tableSource.type = TableSourceType.mySql;
	tableSource.host = 'localhost';
	tableSource.port = '3306';
	tableSource.schema = 'treez';
	tableSource.user = 'root';
	tableSource.password = 'password';

	tableSource.tableName = 'country';

	return root;
	
}
