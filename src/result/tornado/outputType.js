import Enum from './../../components/enum.js';

export default class OutputType extends Enum {
	
	get isRelative(){
		return this === OutputType.relativeDistance;
	}
}

if(window.OutputType){
	OutputType = window.OutputType;
} else {
	
	OutputType.relativeDistance = new OutputType('relativeDistance');	

	OutputType.absoluteDistance = new OutputType('absoluteDistance');
			
	window.OutputType = OutputType;
}