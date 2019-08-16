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

    var x_base = columns.createColumn('x_base');
    x_base.type = ColumnType.integer;
    
    var x_left = columns.createColumn('x_left');
    x_left.type = ColumnType.integer;
    
    var x_right = columns.createColumn('x_right');
    x_right.type = ColumnType.integer;

    var y_base = columns.createColumn('y_base');
    y_base.type = ColumnType.integer;
    
    var y_left = columns.createColumn('y_left');
    y_left.type = ColumnType.integer;
    
    var y_right = columns.createColumn('y_right');
    y_right.type = ColumnType.integer;

    table.createRow([100, 90, 110, 10, 9, 11]);
    table.createRow([200, 180, 220, 20, 18, 22]);
    table.createRow([300, 270, 330, 30, 27, 33]);
  

    return root;

}