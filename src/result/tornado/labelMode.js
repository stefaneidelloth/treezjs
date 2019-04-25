import Enum from './../../components/enum.js';

export default class LabelMode extends Enum{}

if(window.LabelMode){
	LabelMode = window.LabelMode;
} else {
	LabelMode.absolute = new LabelMode('absolute');
	LabelMode.percent = new LabelMode('percent');
	LabelMode.difference = new LabelMode('difference');
	LabelMode.differenceInPercent = new LabelMode('differenceInPercent');
	
	window.LabelMode = LabelMode;
}