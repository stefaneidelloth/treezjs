import Importer from './../importer.js';
import ColumnType from './../../column/columnType.js';

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
		
		var headerData = isUsingCustomColumnHeaders
							?customColumnHeaders
							:this.trimHeaderData(lineData[0]);
							
		var rowData = isUsingCustomColumnHeaders
						?lineData
						:lineData.slice(1);
				

		//check data size (number of lines > 1, number of columns equal)
		var firstRowIndex = numberOfHeaderLinesToSkip + numberOfRowsForHeaders;
		TextImporter.__checkDataSizes(headerData, rowData, firstRowIndex);
		
		//TODO: implement filtering of rows for jobId
						
		var tableData = {
				headerData: headerData,
				rowData: rowData,
				columnType: ColumnType.string
		}			

		return tableData;
	}

	static trimHeaderData(headerData){
		return headerData.map((entry)=>entry.trim());
	}


	static __checkDataSizes(headerData, rowData, firstRowIndex) {
		
		if (rowData.length < 1) {
			throw new Error('The imported text file must contain at least one data row');
		}
		
		var numberOfColumns = headerData.length;

		var relativeRowIndex = 0;
		for(var row of rowData){
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
