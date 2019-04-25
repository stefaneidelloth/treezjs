import Enum from './../../components/enum.js';

export default class DataMode extends Enum{}

if(window.DataMode){
	DataMode = window.DataMode;
} else {
	DataMode.table = new DataMode('table');
	DataMode.individualColumns = new DataMode('individualColumns');
	
	window.DataMode = DataMode;
}