import Enum from '../../components/enum.js';

export default class ChordMode extends Enum {}

if(window.ChordMode){
	ChordMode = window.ChordMode;
} else {
	ChordMode.source = new ChordMode('source');
	ChordMode.target = new ChordMode('target');
	ChordMode.sourceAndTarget = new ChordMode('sourceAndTarget');
	ChordMode.value = new ChordMode('value');	
	
	window.ChordMode = ChordMode;
}