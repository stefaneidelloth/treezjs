import ColumnType from './columnType.js';

export default class ColumnBlueprint {

	constructor(
			name, 
			legend=name, 
			type=ColumnType.string, 
			defaultValue, 
			isNullable=true, 
			isPrimaryKey=false, 
			isVirtual=false, 
			isLinkedToSource=false
		) {
		this.name = name;		
		this.legend = legend;	
		if(!(type instanceof ColumnType)){
			throw new Error('Type must be ColumnType and not ' + typeof type);
		}	
		this.type = type;		
		this.defaultValue = defaultValue;
		this.isNullable = isNullable;
		this.isPrimaryKey = isPrimaryKey;
		this.isVirtual = isVirtual;		
		this.isLinkedToSource = isLinkedToSource;
	}

	get isString(){
		return this.type === ColumnType.string;
	}

	

}
