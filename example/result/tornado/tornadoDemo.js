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
    
    var label = columns.createColumn('label');
   
    var input_base = columns.createColumn('input_base');
    input_base.type = ColumnType.integer;
    
    var input_left = columns.createColumn('input_left');
    input_left.type = ColumnType.integer;
    
    var input_right = columns.createColumn('input_right');
    input_right.type = ColumnType.integer;

    var output_base = columns.createColumn('output_base');
    output_base.type = ColumnType.integer;
    
    var output_left = columns.createColumn('output_left');
    output_left.type = ColumnType.integer;
    
    var output_right = columns.createColumn('output_right');
    output_right.type = ColumnType.integer;

    table.createRow(['a', 100, 90, 110, 10, 9, 11]);
    table.createRow(['b', 20, 18, 22, 10, 8, 12]);
    table.createRow(['c', 300, 270, 330, 10, 7, 13]);


    var page = results.createPage();
    var graph = page.createGraph();

    var xAxis = graph.createAxis('x');
    xAxis.data.borderMin = BorderMode.twentyFive;
    xAxis.data.borderMax = BorderMode.twentyFive;

    var yAxis = graph.createAxis('y');
    yAxis.data.direction = Direction.vertical;

    var tornado = graph.createTornado();
    tornado.data.tablePath = 'root.results.data.table';
    
    tornado.data.inputBase = 'root.results.data.table.columns.input_base';
    tornado.data.inputLeft = 'root.results.data.table.columns.input_left';
    tornado.data.inputRight = 'root.results.data.table.columns.input_right';
    
     tornado.data.outputBase = 'root.results.data.table.columns.output_base';
    tornado.data.outputLeft = 'root.results.data.table.columns.output_left';
    tornado.data.outputRight = 'root.results.data.table.columns.output_right';
    

    return root;

}