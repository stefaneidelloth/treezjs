import Variable from './../variable.js';

export default class DoubleVariable extends Variable {
	
	constructor(name){
		super(name);
		this.image='doubleVariable.png';
	}
	
	
	createVariableControl(parent, dTreez){

		var textField = parent.append('treez-text-field')
		.label(this.name)
		.bindValue(this, ()=>this.value);
		
    	
    }

}