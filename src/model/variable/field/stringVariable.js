import Variable from './../variable.js';

export default class StringVariable extends Variable {
	
	constructor(name, value){
		super(name, value);
		this.image = 'stringVariable.png';
	}
	
	
	createVariableControl(parent, dTreez){
		var textField = parent.append('treez-text-field')
		.label(this.name)
		.bindValue(this, ()=>this.value);
    }

}