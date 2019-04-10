import Enum from './../../components/enum.js';

export default class ColumnType extends Enum {
			
	constructor(name, clazz){
		super(name);		
		this.associatedClass = clazz;
	}
	
	get isNumeric() {
		return !(this === ColumnType.string);
	}
}

ColumnType.integer = new ColumnType('number', Number);
ColumnType.double = new ColumnType('double', Number);
ColumnType.string = new ColumnType('string', String);

