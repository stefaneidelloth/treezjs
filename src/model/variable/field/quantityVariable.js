import Variable from './../variable.js';

export default class QuantityVariable extends Variable {
	
	constructor(name, value){
		super(name, value);
		this.image='quantityVariable.png';
	}
	
	
	createVariableControl(parent, dTreez){
		//TODO add and show unit
		var textField = parent.append('treez-text-field')
		.label(this.name)
		.bindValue(this, ()=>this.value);
		
    	
    }

}