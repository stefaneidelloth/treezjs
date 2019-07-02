

export default class TableData {

	constructor(columnBlueprints, rows) {
		this.__columnBlueprints = columnBlueprints;
		this.__rows = rows;
		this.__headers = [];

		this.__extractHeadersFromColumnBlueprints();
	}

	static parseTableTextTo2DArray(text, columnSeparator){
		var lines = text.trim().split('\n');

		var data = [];
		for(var line of lines){	
			if(line){
				var cells = line.trim().split(columnSeparator);
				cells.shift(); //removes index column
				data.push(cells);
			}	
		}

		return data;		
	}

	__extractHeadersFromColumnBlueprints() {
		
		for (var columnBlueprint of this.__columnBlueprints) {
			this.__headers.push(columnBlueprint.name);
		}
	}

	get headers() {
		return this.__headers;
	}

	get rows() {
		return this.__rows;
	}

	columnType(header) {

		for (var columnBlueprint of this.__columnBlueprints) {
			if (columnBlueprint.name === header) {
				return columnBlueprint.type;
			}
		}
		throw new Error('Could not determine ColumnType for column "' + header + '"');
	}	

}
