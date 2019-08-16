import Root from './src/root/root.js';
import Direction from './src/result/axis/direction.js';
import ColumnType from './src/data/column/columnType.js';

window.createModel = function(){	

	var root = new Root();	

	var results = root.createResults();

	var data = results.createData();
	var table = data.createTable();
	var columnFolder = table.createColumnFolder();
	var xColumn = columnFolder.createColumn('x');
	xColumn.type = ColumnType.integer;

	var yColumn = columnFolder.createColumn('y');
	yColumn.type = ColumnType.integer;

	table.addRow(1, 1);
	table.addRow(2, 4);
	table.addRow(3, 6);

	var page = results.createPage();
	var graph = page.createGraph();

	var xAxis = graph.createAxis('x');

	var yAxis = graph.createAxis('y');
	yAxis.data.direction = Direction.vertical;

	var xy = graph.createXy();
	xy.data.xAxis = 'root.results.page.graph.x';
	xy.data.yAxis = 'root.results.page.graph.y';

	xy.data.xData = 'root.results.data.table.columns.x';
	xy.data.yData = 'root.results.data.table.columns.y';

	
	return root;
	
}
