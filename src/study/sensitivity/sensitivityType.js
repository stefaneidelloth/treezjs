import Enum from './../../components/enum.js';

export default class SensitivityType extends Enum {
	
	get isRelative(){
		return this === SensitivityType.relativeDistance || this === SensitivityType.relativePosition;
	}
}

if(window.RelationType){
	SensitivityType = window.SensitivityType;
} else {
	
	//Specify variation using relative distance of neighboring points to working point {p}: specify "how far" the other
	//points are away, e.g. the distance is +-10 % of the absolute working point value => (p-p*0.1), {p}, (p+p*0.1)
	SensitivityType.relativeDistance = new SensitivityType('relativeDistance');
	
	//Specify variation using distances of neighboring points to the working point {p} : specify "how far" the other
	//points are away, e.g.the absolute distance is 1 => (p-1), {p}, (p+1)
	SensitivityType.relativePosition = new SensitivityType('relativePosition');
	
	//Specify variation using absolute distance of neighboring points e.g. -5, 10 for a working point value of {p=10}
	// => 5, {p=10}, 20
	SensitivityType.absoluteDistance = new SensitivityType('absoluteDistance');
		
	
	window.SensitivityType = SensitivityType;
}