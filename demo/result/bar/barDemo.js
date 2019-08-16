import Root from './treezjs/src/root/root.js';
import ColumnType from './treezjs/src/data/column/columnType.js';
import Direction from './treezjs/src/result/axis/direction.js';
import BorderMode from './treezjs/src/result/axis/borderMode.js';

window.createModel = function(){

    var root = new Root();		

	var results = root.createResults();
	var data = results.createData();
	
	var table = data.createTable();
	
	var columns = table.createColumnFolder();
	
	var x = columns.createColumn('x');
	x.type = ColumnType.integer;

	var y = columns.createColumn('y');
	y.type = ColumnType.integer;

	table.addRow(1, 1);
	table.addRow(2, 4);
	table.addRow(3, 6);

	var page = results.createPage();
	var graph = page.createGraph();
	
	var xAxis = graph.createAxis('x');
	xAxis.data.borderMin = BorderMode.twentyFive;
	xAxis.data.borderMax = BorderMode.twentyFive;

	var yAxis = graph.createAxis('y');
	yAxis.data.direction = Direction.vertical;

	var bar = graph.createBar();
	bar.data.barPositions = 'root.results.data.table.columns.x';
	bar.data.barLengths = 'root.results.data.table.columns.y';
	bar.data.horizontalAxis = 'root.results.page.graph.x';
	bar.data.verticalAxis = 'root.results.page.graph.y';
	bar.fill.color = '#00ff00';

	return root;
	
}
