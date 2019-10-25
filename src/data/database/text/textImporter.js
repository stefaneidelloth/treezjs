import Importer from './../importer.js';
import ColumnType from './../../column/columnType.js';
import TableData from './../tableData.js';
import ColumnBlueprint from './../../column/columnBlueprint.js';

export default class TextImporter extends Importer {

	constructor() {
		
	}

	static async importData(filePath, numberOfHeaderLinesToSkip, customColumnHeaders, columnSeparator, isFilteringForJobId, jobId, rowLimit) {

		var isUsingCustomColumnHeaders = customColumnHeaders.length > 0;
		
		var numberOfRowsForHeaders = isUsingCustomColumnHeaders
											?0
											:1;
		
		var maxNumberOfRowsToRead = rowLimit+numberOfRowsForHeaders;
		
		var lineData = await TextImporter.__readLines(filePath, numberOfHeaderLinesToSkip, columnSeparator, maxNumberOfRowsToRead);
		
		var headers = isUsingCustomColumnHeaders
							?customColumnHeaders
							:this.trimHeaders(lineData[0]);
							
		var rows = isUsingCustomColumnHeaders
						?lineData
						:lineData.slice(1);
				

		//check data size (number of lines > 1, number of columns equal)
		var firstRowIndex = numberOfHeaderLinesToSkip + numberOfRowsForHeaders;
		TextImporter.__checkDataSizes(headers, rows, firstRowIndex);
		
		//TODO: implement filtering of rows for jobId

		let columnBlueprints = [];
		for(let header of headers){
			let columnBlueprint = new ColumnBlueprint(header, header, ColumnType.string);
			columnBlueprints.push(columnBlueprint);			
		}

		let tableData = new TableData(columnBlueprints, rows);

		return tableData;
	}

	static trimHeaders(headers){
		return headers.map((entry)=>entry.trim());
	}


	static __checkDataSizes(headers, rows, firstRowIndex) {
		
		if (rows.length < 1) {
			throw new Error('The imported text file must contain at least one data row');
		}
		
		var numberOfColumns = headers.length;

		var relativeRowIndex = 0;
		for(var row of rows){
			if(row.length !== numberOfColumns){				
				var lineNumber = firstRowIndex + relativeRowIndex;
				var message = 'The number of columns in line ' + lineNumber + ' has to be ' + numberOfColumns + ' but is ' + row.length + '. Line: "' + row + '"';
				throw new Error(message);			
			}
			relativeRowIndex++;
		}	

	}


	static async __readLines(filePath, numberOfHeaderLinesToSkip, columnSeparator, maxNumberOfRowsToRead){
		
		var text = await window.treezTerminal.readTextFile(filePath); //TODO: consider maxNumberOfRowsToRead
		
		var trimmedText = text.trim(); //removes empty lines

		var allLineStrings = trimmedText.split('\n');
		var lineStrings = allLineStrings.slice(numberOfHeaderLinesToSkip);
		
        var splitExpression = columnSeparator.replace('\\t','\t').replace('\\n','\n').replace('\\r','\r'); 

		var lines = [];
		for(var lineString of lineStrings){
			lines.push(lineString.split(splitExpression));
		}		

		return lines;
	}

	

}
