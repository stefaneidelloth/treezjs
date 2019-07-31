import Variable from './../variable.js';
import IntegerRange from './../range/integerRange.js';
import ColumnType from './../../data/column/columnType.js';

export default class IntegerVariable extends Variable {
	
	constructor(name, value){
		super(name, value);
		this.image='integerVariable.png';
		this.columnType = ColumnType.integer;
	}
		
	createVariableControl(parent, dTreez){

		var textField = parent.append('treez-integer')
			.label(this.name)
			.bindValue(this, ()=>this.value);	
    	
    }
	
	createRange(name){
    	return new IntegerRange(name);
    }

    get helpPath(){
    	return 'variable/field/integerVariable.md';
    }

}