import Enum from './../../components/enum.js';

export default class DataMode extends Enum{}

if(window.DataMode){
	DataMode = window.DataMode;
} else {	
	DataMode.sensitivityProbeTable = new DataMode('sensitivityProbeTable');
	DataMode.tornadoTable = new DataMode('tornadoTable');
	DataMode.individualColumns = new DataMode('individualColumns');
	
	window.DataMode = DataMode;
}