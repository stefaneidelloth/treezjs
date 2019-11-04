

export default class Row {

	constructor(table) {
		this.__table = table;
		this.__entryMap = {};
		this.__NULL_STRING = '[null]';
		this.__hasValidationErrors = false;
	}
	

	toString() {
		let stringItems = [];
		
		for(var columnName of this.columnNames){

			let value = this.entry(columnName);
			let column = this.column(columnName);
			let columnType = column.type;
			
			if(columnType.isString){
				stringItems.push('"' + value + '"');
			} else {
				stringItems.push('' + value);
			}
		}		

		return '[' + stringItems.join(', ') + ']';		
	}	

	entry(columnName) {
		return this.__entryMap[columnName];
	}

	setEntryUnchecked(columnName, value) {
		this.__entryMap[columnName] = value;
	}

	/**
	 * Sets a value in this row for a given column header. The value is checked to be compatible to the column.
	 */
	setEntry(columnName, value) {

		var table = this.__table;

		var columnExists = table.columnNames.indexOf(columnName) > -1;
		if (columnExists) {
			var columnType = table.columnType(columnName);			
			if (columnType.isCompatible(value)) {
				this.__entryMap[columnName] = value;
			} else {
				var message = 'The type "' + (typeof value) + '" of the given value "' + value + '" is not compatible to the ' + 
				' column type "' + columnType + '"';
				throw new Error(message);
			}
		} else {
			var message = 'The column name "' + columnName + '" does not exist and the value "' + value + '" could not be set.';
			throw new Error(message);
		}
	}	

	getEntryAsString(columnName) {
		var value = this.getEntry(columnName);

		if (value) {
			return value.toString();
		} else {
			return this.__NULL_STRING;
		}
	}	

	isNullString(value) {
		return value === this.__NULL_STRING;		
	}	

	get index() {
		return this.__table.rows.indexOf(this);
	}

	get columnNames(){
		return this.__table.columnNames;
	}

	get headers(){
		return this.__table.headers;
	}

	get values(){		
        return this.columnNames.map(columnName=>this.__entryMap[columnName]);
	}	


	get isEmpty() {
		var isEmpty = true;
		for (var columnName of this.columnNames) {
			var entry = this.__entryMap[columnName];
			if (entry instanceof String) {
				if (entry) {
					isEmpty = false;
					break;
				}
			}

			//TODO: check for other types

		}
		return isEmpty;
	}

	get isLastRow() {
		var size = this.__table.rows.length;
		return (this.index === size - 1);
	}
	

}
