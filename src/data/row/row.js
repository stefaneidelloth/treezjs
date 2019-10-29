

export default class Row {

	constructor(table) {
		this.__table = table;
		this.__entryMap = {};
		this.__NULL_STRING = '[null]';
		this.__hasValidationErrors = false;
	}
	

	toString() {
		let stringItems = [];
		
		for(var header of this.headers){

			let value = this.entry(header);
			let columnType = this.__table.columnType(header);
			
			if(columnType.isString){
				stringItems.push('"' + value + '"');
			} else {
				stringItems.push('' + value);
			}
		}		

		return '[' + stringItems.join(', ') + ']';		
	}	

	entry(columnHeader) {
		return this.__entryMap[columnHeader];
	}

	setEntryUnchecked(columnHeader, value) {
		this.__entryMap[columnHeader] = value;
	}

	/**
	 * Sets a value in this row for a given column header. The value is checked to be compatible to the column.
	 */
	setEntry(columnHeader, value) {

		var table = this.__table;

		var columnExists = table.headers.indexOf(columnHeader) > -1;
		if (columnExists) {
			var columnType = table.columnType(columnHeader);			
			if (columnType.isCompatible(value)) {
				this.__entryMap[columnHeader] = value;
			} else {
				var message = 'The type "' + (typeof value) + '" of the given value "' + value + '" is not compatible to the ' + 
				' column type "' + columnType + '"';
				throw new Error(message);
			}
		} else {
			var message = 'The columnHeader "' + columnHeader + '" does not exist and the value "' + value + '" could not be set.';
			throw new Error(message);
		}
	}	

	getEntryAsString(header) {
		var value = this.getEntry(header);

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

	get headers(){
		return this.__table.headers;
	}

	get values(){		
        return this.headers.map(header=>this.__entryMap[header]);
	}	


	get isEmpty() {
		var empty = true;
		for (var header of this.__table.headers) {
			var entry = this.__entryMap[header];
			if (entry instanceof String) {
				if (entry) {
					empty = false;
					break;
				}
			}

			//TODO: check for other types

		}
		return empty;
	}

	get isLastRow() {
		var size = this.__table.rows.length;
		return (this.index === size - 1);
	}

	

	

}
