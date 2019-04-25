import Variable from './../variable.js';

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

}