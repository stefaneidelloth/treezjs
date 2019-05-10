import Variable from './../variable.js';
import DoubleRange from './../range/doubleRange.js';

export default class DoubleVariable extends Variable {
	
	constructor(name, value){
		super(name, value);
		this.image='doubleVariable.png';
	}	
	
	createVariableControl(parent, dTreez){

		var textField = parent.append('treez-double')
			.label(this.name)
			.bindValue(this, ()=>this.value);		
    	
    }
	
	createRange(name){
    	return new DoubleRange(name);
    }

}