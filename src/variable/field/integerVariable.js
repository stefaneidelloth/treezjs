import Variable from './../variable.js';
import IntegerRange from './../range/integerRange.js';

export default class IntegerVariable extends Variable {
	
	constructor(name, value){
		super(name, value);
		this.image='integerVariable.png';
	}
		
	createVariableControl(parent, dTreez){

		var textField = parent.append('treez-text-field')
			.label(this.name)
			.bindValue(this, ()=>this.value);	
    	
    }
	
	createRange(name){
    	return new IntegerRange(name);
    }

}