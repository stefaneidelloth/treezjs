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
		this.type = type;		
		this.defaultValue = defaultValue;
		this.isNullable = isNullable;
		this.isPrimaryKey = isPrimaryKey;
		this.isVirtual = isVirtual;		
		this.isLinkedToSource = isLinkedToSource;
	}

	

}