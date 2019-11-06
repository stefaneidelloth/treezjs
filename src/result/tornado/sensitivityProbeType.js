import Enum from './../../components/enum.js';

export default class SensitivityProbeType extends Enum {
	
	get isRelative(){
		return this === SensitivityProbeType.relativeDistance;
	}
}

if(window.SensitivityProbeType){
	SensitivityProbeType = window.SensitivityProbeType;
} else {
	
	SensitivityProbeType.relativeDistance = new SensitivityProbeType('relativeDistance');	

	SensitivityProbeType.absoluteDistance = new SensitivityProbeType('absoluteDistance');
			
	window.SensitivityProbeType = SensitivityProbeType;
}