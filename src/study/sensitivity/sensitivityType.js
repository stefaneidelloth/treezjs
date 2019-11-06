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
	
	//Specify variation using positions of neighboring points in relation to the working point {p} : specify "where" 
	//the other points are, e.g.the position is 90 %, 110 % of the absolute working point value => (0.9*p), {p}, (1.1*p)
	SensitivityType.relativePosition = new SensitivityType('relativePosition');
	
	//Specify variation using absolute distance of neighboring points e.g. -5, 10 for a working point value of {p=10}
	// => 5, {p=10}, 20
	SensitivityType.absoluteDistance = new SensitivityType('absoluteDistance');
		
	
	window.SensitivityType = SensitivityType;
}