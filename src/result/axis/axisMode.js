import Enum from './../../components/enum.js';

export default class AxisMode extends Enum {}

if(window.AxisMode){
	AxisMode = window.AxisMode;
} else {
	AxisMode.quantitative = new AxisMode('quantitative');
	AxisMode.ordinal = new AxisMode('ordinal');
	//AxisMode.time = new AxisMode('time');
	
	window.AxisMode = AxisMode;
}