import Enum from '../../components/enum.js';

export default class SankeyMode extends Enum {}

if(window.SankeyMode){
	SankeyMode = window.SankeyMode;
} else {
	SankeyMode.source = new SankeyMode('source');
	SankeyMode.target = new SankeyMode('target');
	SankeyMode.sourceAndTarget = new SankeyMode('sourceAndTarget');
	SankeyMode.value = new SankeyMode('value');	
	
	window.SankeyMode = SankeyMode;
}