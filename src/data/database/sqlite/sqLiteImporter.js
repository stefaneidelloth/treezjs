import Importer from './../importer.js';
import ColumnBlueprint from './../../column/columnBlueprint.js';
import TableData from './../tableData.js';
import SqLiteColumnTypeConverter from './sqLiteColumnTypeConverter.js';
import Row from './../../row/row.js';

export default class SqLiteImporter extends Importer {

	constructor() {
		
	}		

	static async importData(
			 filePath,
			 password,
			 tableName,
			 filterRowsByJobId,
			 jobId,
			 rowLimit,
			 rowOffset) {

		var columnBlueprints = await this.readTableStructure(filePath, password, tableName);

		var data = await this.__readData(filePath, password, tableName, filterRowsByJobId, jobId, rowLimit, rowOffset, columnBlueprints);

		return new TableData(columnBlueprints, data);		
	}

	static async importDataWithCustomQuery(filePath, password, customQuery, jobId, rowLimit, rowOffset) {

		var columnBlueprints = await this.readTableStructureWithCustomQuery(filePath, password, customQuery, jobId);

		var data = await this.__readDataWithCustomQuery(filePath, password, customQuery, jobId, rowLimit, rowOffset, columnBlueprints);

		return new TableData(columnBlueprints, data);		
	}
	
	static async numberOfRows(filePath, tableName) {
			
		var sizeQuery = "SELECT COUNT(*) FROM '" + tableName + "';";
		
		var data = await window.treezTerminal.sqLiteQuery(filePath, sizeQuery, true);
		
		return data[1][1];

	}

	static async numberOfRowsForCustomQuery(filePath, customQuery, jobId) {
		
		var subQuery = this.__removeTrailingSemicolon(customQuery);
		subQuery = this.__injectJobIdIfIncludesPlaceholder(subQuery, jobId);
		var sizeQuery = 'SELECT COUNT(*) FROM (' + subQuery + ');';
		
		var data = await window.treezTerminal.sqLiteQuery(filePath, sizeQuery, true);

		return data[1][1];

	}
	
	static async tableNames(filePath, password){
		
		var query = "SELECT name FROM sqlite_master WHERE type='table'";
		
		var data = await window.treezTerminal.sqLiteQuery(filePath, query, true);
		
		var tableNames= data.map(row => row[0]);

        //remove table name "header"
		tableNames.shift(); 

		//remove table names for internal sqlite tables
		tableNames = tableNames.filter(name=>name.substring(0,7) !== 'sqlite_');

		return tableNames;
		
	}

	static async readTableStructure(filePath, password, tableName) {
		
		var structureQuery = "PRAGMA table_info('" + tableName + "');";
		
		var data = await window.treezTerminal.sqLiteQuery(filePath, structureQuery, true);

        var headers = data[0];
        var nameIndex = headers.indexOf('name')
        
		var tableStructure = [];		

        var isVirtual = false;
		var isLinkedToSource = false;

		data.shift();
		
		for(var line of data){
			var name = line[nameIndex]; //available columns: cid, name, type, notnull, dflt_value, pk
			var type = SqLiteColumnTypeConverter.convert(line[nameIndex+1]);
			var isNullable = line[nameIndex+2] === '0';			
			var defaultValueString = line[nameIndex+3];
			if(defaultValueString === 'NULL'){
				defaultValueString = null;
			}
			var isPrimaryKey = line[nameIndex+4] !== '0';
			var legend = name;

			tableStructure.push(new ColumnBlueprint(
					name,
					legend,
					type,
					defaultValueString,
					isNullable,
					isPrimaryKey,
					isVirtual,					
					isLinkedToSource)
			);

		}				

		return tableStructure;
	}

	static async readTableStructureWithCustomQuery(filePath, password, customQuery, jobId) {
		
		var length = customQuery.length();
		if (length < 1) {
			throw new Error('Custom query must not be empty');
		}

		var firstLineQuery = customQuery;
		firstLineQuery = this.__removeTrailingSemicolon(customQuery);
		firstLineQuery = this.__injectJobIdIfIncludesPlaceholder(firstLineQuery, jobId);
		firstLineQuery += " LIMIT 1;";

		var data = await window.treezTerminal.sqLiteQuery(filePath, firstLineQuery, true);
		var headers = data[0];
		
		var dataTypes = await window.treezTerminal.sqLiteQueryTypes(filePath, firstLineQuery, true);
		
		var tableStructure = [];	
		for(var columnIndex =0; columnIndex < headers.length; columnIndex++){

			var name = headers[columnIndex];			
			var type = SqLiteColumnTypeConverter.convert(dataTypes[columnIndex]);
			var isNullable = true;
			var legend = name;
			var isLinkedToSource = false;
			
			tableStructure.add(new ColumnBlueprint(name, type, isNullable, legend, isLinkedToSource));
		}

		return tableStructure;
	}

	static async readForeignKeys(filePath, password, tableName) {

		//TODO:
		//PRAGMA foreign_key_list('table_name')
		//
		//The pragma command does not yield the name of the foreign key.
		//The name can be extracted from column sql in sqlite_master table.
		//That would however require some extra parsing. The parsing would
		//have to consider the existance of several foreign keys. Also see
		//http://stackoverflow.com/questions/41595152/how-to-get-the-names-of-foreign-key-constraints-in-sqlite
		//
		//SELECT sql FROM sqlite_master WHERE name = 'table_name'

		return null;
	}

	static async readIndices(filePath, password, tableName) {

		//TODO:
		//select * from sqlite_master where type='index' and tbl_name = 'table_name'
		//and
		//PRAGMA index_list('table_name')
		return null;

	}

	static async readColumnType(filePath, password, tableName, columnName) {
		
		var structureQuery = "PRAGMA table_info('" + tableName + "');";

		var data = await window.treezTerminal.sqLiteQuery(filePath, structureQuery, true);	

		for(var row of data){
			var currentColumnName = row[3];
			if(currentColumnName === columnName){
				SqLiteColumnTypeConverter.convert(row[4]);
			}
		}

		throw new Error('Could not determine type for column "' + columnName + '" of table"' + tableName + '"');
	}

	static async __readData(
		 filePath,
		 password,
		 tableName,
		 filterRowsByJobId,
		 jobId,
		 rowLimit,
		 rowOffset,
		 columnBlueprints
	) {
		
		var dataQuery = "SELECT * FROM '" + tableName + "'";

		var applyFilter = filterRowsByJobId && (jobId != null);
		if (applyFilter) {
			dataQuery += " WHERE job_id = '" + jobId + "'";
		}

		var offset = 0;
		if (rowOffset != null) {
			offset = rowOffset;
		}

		//if OFFSET is not efficient enough, also see
		//http://stackoverflow.com/questions/14468586/efficient-paging-in-sqlite-with-millions-of-records
		if(rowLimit){
			dataQuery += " LIMIT " + rowLimit; 
		}
		
		if(offset){
			dataQuery += " OFFSET " + offset; 
		}

		dataQuery += ";";
		
		var data = await window.treezTerminal.sqLiteQuery(filePath, dataQuery, true);

		data.shift(); //removes header row
		
		if (data.length < 1) {
			var message = 'Could not find any rows to read from table "' + tableName + '"';
			if (applyFilter) {
				message += ' for jobId "' + jobId + '"';
			}
			console.warn(message);
		}

		var dataWithoutIndex

		return data;
	}

	static async __readDataWithCustomQuery(
		 filePath,
		 password,
		 customQuery,
		 jobId,
		 rowLimit,
		 rowOffset,
		 columnBlueprints
	) {		

		var length = customQuery.length();
		if (length < 1) {
			throw new Error('Custom query must not be empty');
		}

		var dataQuery = this.__removeTrailingSemicolon(customQuery);
		dataQuery = this.__injectJobIdIfIncludesPlaceholder(dataQuery, jobId);

		var offset = 0;
		if (rowOffset != null) {
			offset = rowOffset;
		}

		//if OFFSET is not efficient enough, also see
		//http://stackoverflow.com/questions/14468586/efficient-paging-in-sqlite-with-millions-of-records
		dataQuery += " LIMIT " + rowLimit + " OFFSET " + offset + ";";

		var data = await window.treezTerminal.sqLiteQuery(filePath, structureQuery, true);

		array.shift(); //removes header row
		
		if (data.length < 1) {
			var message = 'Could not find any rows with query "' + dataQuery + '"';
			console.warn(message);
		}

		return data;
	}

	static async readRow(
		 filePath,
		 password,
		 tableName,
		 filterRowsByJobId,
		 jobId,
		 rowIndex,
		 table
	) {
		
		var dataQuery = "SELECT * FROM '" + tableName + "'";

		var applyFilter = filterRowsByJobId && jobId != null;
		if (applyFilter) {
			dataQuery += " WHERE job_id = '" + jobId + "'";
		}

		dataQuery += " LIMIT 1 OFFSET " + rowIndex + ";";
		return await this.__readRow(filePath, password, dataQuery, table);
	}

	static async readRows(
		 filePath,
		 password,
		 tableName,
		 filterRowsByJobId,
		 jobId,		 
		 table,
		 startIndex,
		 endIndex
	) {
		
		var dataQuery = "SELECT * FROM '" + tableName + "'";

		var applyFilter = filterRowsByJobId && jobId != null;
		if (applyFilter) {
			dataQuery += " WHERE job_id = '" + jobId + "'";
		}

		if(startIndex !== undefined){
			if(endIndex !== undefined){
				var limit = endIndex-startIndex+1;
                dataQuery += ' LIMIT ' + limit + ' OFFSET ' + startIndex + ';';
			} else {
                dataQuery += ' OFFSET ' + startIndex + ';';
			}
			
		}

		
		return await this.__readRows(filePath, password, dataQuery, table);
	}


	static async readRowWithCustomQuery(
		filePath,
		password,
		customQuery,
		jobId,
		rowIndex,
		table
	) {
				
		if (customQuery.length < 1) {
			throw new Error('Custom query must not be empty');
		}

		var dataQuery = this.__removeTrailingSemicolon(customQuery);
		dataQuery = this.__injectJobIdIfIncludesPlaceholder(dataQuery, jobId);
		dataQuery += " LIMIT 1 OFFSET " + rowIndex + ";";

		return await this.__readRow(filePath, password, dataQuery, table);
	}

	static async readRowsWithCustomQuery(
		filePath,
		password,
		customQuery,
		jobId,		
		table,
		startIndex,
		endIndex
	) {
				
		if (customQuery.length < 1) {
			throw new Error('Custom query must not be empty');
		}

		var dataQuery = this.__removeTrailingSemicolon(customQuery);
		dataQuery = this.__injectJobIdIfIncludesPlaceholder(dataQuery, jobId);


		if(startIndex !== undefined){
			if(endIndex !== undefined){
				var limit = endIndex-startIndex+1;
                dataQuery += ' LIMIT ' + limit + ' OFFSET ' + startIndex + ';';
			} else {
                dataQuery += ' OFFSET ' + startIndex + ';';
			}
			
		}

		return await this.__readRows(filePath, password, dataQuery, table);
	}

	static async __readRow(filePath, password, dataQuery, table) {
		var row = new Row(table);

		var data = await window.treezTerminal.sqLiteQuery(filePath, dataQuery, true);

		var headers = data[0];
		var columnCount = headers.length;

		for (var columnIndex = 1; columnIndex <= columnCount; columnIndex++) {
					var columnName = headers[columnIndex];
					var value = data[1][columnIndex];
					row.setEntry(columnName, value);
		}		

		return row;
	}	

	static async __readRows(filePath, password, dataQuery, table) {
		

		var data = await window.treezTerminal.sqLiteQuery(filePath, dataQuery, true);

		var headers = data[0];
		var columnCount = headers.length;

		var rowCount = data.length;

		var rows =[];

		for(var rowIndex =1; rowIndex < rowCount; rowIndex++){			
			var rowData = data[rowIndex];
			var row = table.createRow(rowData);
			rows.push(row);
		}			

		return rows;
	}	

	static async createTableIfNotExists(filePath, password, tableName, columnBlueprints){

        var columnDefinitions = [];
		for(var blueprint of columnBlueprints){
			var columnDefinition = "'" + blueprint.name + "'";			
			columnDefinition += " " + SqLiteColumnTypeConverter.convertBack(blueprint.type);
			if(blueprint.isPrimaryKey){
				columnDefinition += " PRIMARY KEY"
			}
			if(!blueprint.isNullable){
				columnDefinition += " NOT NULL"
			}
			columnDefinitions.push(columnDefinition);		 
		}

		var query = "CREATE TABLE IF NOT EXISTS '" + tableName + "' (" + columnDefinitions.join(', ') + ")";

		await window.treezTerminal.sqLiteQuery(filePath, query, false)
	}

	static async appendData(filePath, password, tableName, columnBlueprints, tableData){
		if(tableData.rows.length < 1){
			return;
		}

		var rowValues = [];
		for(var row of tableData.rows){

			var cellValues = [];

			for(var columnIndex=0; columnIndex < columnBlueprints.length; columnIndex++){
				var blueprint = columnBlueprints[columnIndex];
				var value = row[columnIndex];
				if(blueprint.isString){
					cellValues.push("'" + value + "'");
				} else {
					if(value === ''){
						cellValues.push('null');
					} else {
						cellValues.push(value);
					}					
				}
			}
			rowValues.push("(" + cellValues.join(", ") + ")")
		}

		var query = "INSERT INTO '" + tableName + "' ('" + tableData.headers.join("', '") + "') VALUES " + rowValues.join(", ");

		await window.treezTerminal.sqLiteQuery(filePath, query, false)
			.catch(error=>{
				console.error(error);
				throw error;
			});
	}

}
