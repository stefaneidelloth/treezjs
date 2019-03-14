import Enum from './../../core/enum/enum.js';

export default class ColumnType extends Enum {
			
	constructor(name, clazz){
		super(name);		
		this.associatedClass = clazz;
	}
	
	get isNumeric() {
		return !(this === ColumnType.String);
	}
}

ColumnType.Integer = new ColumnType('Number', Number);
ColumnType.Double = new ColumnType('Double', Number);
ColumnType.String = new ColumnType('String', String);

