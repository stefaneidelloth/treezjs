

export default class Row {

	constructor(table) {
		this.__table = table;
		this.__entryMap = {};
		this.__NULL_STRING = '[null]';
		this.__hasValidationErrors = false;
	}
	
	
	get values(){
		return Object.values(this.__entryMap);
	}	

	toString() {
		var rowCommand = 'addRow(';
		
		var valueAdded = false;
		for (var value of this.__entryMap.values()) {
			valueAdded = true;
			var isString = value instanceof String;
			if (isString) {
				rowCommand += '"' + value + '", ';
			} else {
				rowCommand += value.toString() + ', ';
			}
		}

		if (valueAdded) {
			rowCommand = rowCommand.substring(0, rowCommand.length - 2);
		}
		rowCommand += ');';
		return rowCommand;
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

	get index() {
		return this.__table.rows.indexOf(this);
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

		var columnExists = this.__table.headers.indexOf(columnHeader) > -1;
		if (columnExists) {
			if (value !== null && value instanceof Object) {
				
				
				var valueClass = value.construtor;
				var valueColumnType = ColumnType.forClass(valueClass);
				var columnType = table.getColumnType(columnHeader);

				var columnTypeFitsToValue = valueColumnType === columnType;
				if (columnTypeFitsToValue) {
					
					this.__entryMap[columnHeader] = value;
				} else {
					var message = 'The class "' + valueClass.name + '" of the given value "' + value + '" is not compatible to the ' + 
					' column type "' + columnType + '"';

					throw new Error(message);
				}
			} else {
				this.__entryMap[columnHeader] = value;
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

	

}
