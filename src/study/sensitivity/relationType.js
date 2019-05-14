import Enum from './../../components/enum.js';

export default class RelationType extends Enum {}

if(window.RelationType){
	RelationType = window.RelationType;
} else {
	
	//Specify values indirectly, in terms of percentages in relation to the working point value, e.g. a percentage of
	//"10" with a working point value of 1000 gives a final value of 1000 * 10/100= 100.
	RelationType.percentage = new RelationType('percentage');
	
	//Specify values indirectly, in terms of factors in relation to the working point value, e.g. a factor of "0.1"
	//with a working point value of 1000 gives a final value of 0.1*1000 = 100
	RelationType.factor = new RelationType('factor');
	
	//Specify values indirectly, in terms of a change in exponent (magnitude, order), e.g. an exponent of "2" with a
	//working point value of 100 gives a final value of 10^2 * 1000 = 100.000
	RelationType.exponent = new RelationType('exponent');
	
	window.RelationType = RelationType;
}