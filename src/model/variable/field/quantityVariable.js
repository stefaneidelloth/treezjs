import Variable from './../variable.js';

export default class QuantityVariable extends Variable {
	
	constructor(name){
		super(name);
		this.image='quantityVariable.png';
	}
	
	
	createVariableControl(parent, dTreez){
		//TODO add and show unit
		var textField = parent.append('treez-text-field')
		.label(this.name)
		.bindValue(this, ()=>this.value);
		
    	
    }

}