import Enum from '../../components/enum.js';

export default class SankeyFillMode extends Enum {}

if(window.SankeyFillMode){
	SankeyFillMode = window.SankeyFillMode;
} else {
	SankeyFillMode.source = new SankeyFillMode('source');
	SankeyFillMode.target = new SankeyFillMode('target');
	SankeyFillMode.sourceAndTarget = new SankeyFillMode('sourceAndTarget');
	SankeyFillMode.value = new SankeyFillMode('value');	
	
	window.SankeyFillMode = SankeyFillMode;
}