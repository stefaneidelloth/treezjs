import Variable from './../variable.js';

export default class BooleanVariable extends Variable {
	
	constructor(name, value){
		super(name, value);
		this.image='booleanVariable.png';
	}
		
	createVariableControl(parent, dTreez){

		var checkBox = parent.append('treez-check-box')
			.label(this.name)
			.bindValue(this, ()=>this.value);	
    	
    }

}