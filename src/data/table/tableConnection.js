import SqLiteImporter from './../database/sqlite/sqLiteImporter.js';
import MySqLImporter from './../database/mysql/mySqlImporter.js';
import TableSourceType from './tableSourceType.js';
import Row from './../row/row.js';

export default class TableConnection {

    static async loadTableStructureFromSource(table, tableSource) {		
		var sourceType = tableSource.type;

		switch(sourceType){
			case TableSourceType.sqLite:
				table.deleteColumnsIfExist();
				var tableStructure = await this.__readTableStructureForSqLiteTable(tableSource);
				table.createColumnsFromBlueprints(tableStructure);
				break;
			case TableSourceType.mySql:
				table.deleteColumnsIfExist();
				var tableStructure = this.__readTableStructureForMySqlTable(tableSource);
				table.createColumnsFromBlueprints(tableStructure);
				break;
			default:
				throw new Error('Not yet implemented for source type ' + sourceType);
		}

	}

	static async readRowFromTableSource(table, tableSource, rowIndex) {
		switch(tableSource.type){
			case TableSourceType.sqLite:
				return await this.__readRowFromSqLiteTable(tableSource, rowIndex);
				break;
			case TableSourceType.mySql:
				return await this.__readRowFromMySqlTable(tableSource, rowIndex);
				break;
			default:
				throw new Error('not yet implemented for source type ' + tableSource.type);
		};
	}

	static async readRowsFromTableSource(table, tableSource, startIndex, endIndex) {
		switch(tableSource.type){
			case TableSourceType.sqLite:
				return await this.__readRowsFromSqLiteTable(table, tableSource, startIndex, endIndex);
				break;
			case TableSourceType.mySql:
				return await this.__readRowsFromMySqlTable(table, tableSource, startIndex, endIndex);
				break;
			default:
				throw new Error('not yet implemented for source type ' + tableSource.type);
		};
	}


	static async __readTableStructureForSqLiteTable(tableSource) {
		var sqLiteFilePath = tableSource.filePath;
		var password = tableSource.password;

		var isUsingCustomQuery = tableSource.isUsingCustomQuery;
		if (isUsingCustomQuery) {
			var customQuery = tableSource.customQuery;
			var jobId = tableSource.jobId;
			var tableStructure = await SqLiteImporter.readTableStructureWithCustomQuery(sqLiteFilePath, password, customQuery, jobId);
			return tableStructure;
		} else {
			var tableName = tableSource.tableName;
			var tableStructure = await SqLiteImporter.readTableStructure(sqLiteFilePath, password, tableName);
			return tableStructure;
		}

	}

	async __readTableStructureForMySqlTable(tableSource) {
		var host = tableSource.host;
		var port = tableSource.port;
		var schema = tableSource.schema;
		var url = host + ':' + port + '/' + schema;

		var user = tableSource.user;
		var password = tableSource.password;

		var isUsingCustomQuery = tableSource.isUsingCustomQuery;
		if (isUsingCustomQuery) {
			return  await MySqlImporter.readTableStructureWithCustomQuery(url, user, password, tableSource.customQuery, tableSource.jobId);
		} else {
			return  await MySqlImporter.readTableStructure(url, user, password, tableSource.tableName);
		}
	}

	

	static async __readRowFromSqLiteTable(table, tableSource, rowIndex) {
		var sqLiteFilePath = tableSource.filePath;

		var password = tableSource.password;
		var jobId = tableSource.jobId;

		var isUsingCustomQuery = tableSource.isUsingCustomQuery;
		if (isUsingCustomQuery) {
			var customQuery = tableSource.customQuery;
			return await SqLiteImporter.readRowWithCustomQuery(sqLiteFilePath, password, customQuery, jobId, rowIndex, table);
		} else {
			return await SqLiteImporter.readRow(sqLiteFilePath, password, tableSource.tableName, tableSource.isFilteringForJob, jobId, rowIndex, table);
		}
	}

	static async __readRowsFromSqLiteTable(table, tableSource, startIndex, endIndex) {
		var sqLiteFilePath = tableSource.filePath;

		var password = tableSource.password;
		var jobId = tableSource.jobId;

		var isUsingCustomQuery = tableSource.isUsingCustomQuery;
		if (isUsingCustomQuery) {
			var customQuery = tableSource.customQuery;
			return await SqLiteImporter.readRowsWithCustomQuery(sqLiteFilePath, password, customQuery, jobId, table, startIndex, endIndex);
		} else {
			return await SqLiteImporter.readRows(sqLiteFilePath, password, tableSource.tableName, tableSource.isFilteringForJob, jobId, table, startIndex, endIndex);
		}
	}

	static async __readRowFromMySqlTable(table, tableSource, rowIndex) {
		var host = tableSource.host;
		var port = tableSource.port;
		var schema = tableSource.schema;
		var url = host + ":" + port + "/" + schema;

		var user = tableSource.user;
		var password = tableSource.password;

		var jobId = tableSource.jobId;

		var isUsingCustomQuery = tableSource.isUsingCustomQuery;
		if (isUsingCustomQuery) {
			var customQuery = tableSource.customQuery;
			return await MySqlImporter.readRowWithCustomQuery(url, user, password, customQuery, jobId, rowIndex, table);

		} else {
			return await MySqlImporter.readRow(url, user, password, tableSource.tableName, tableSource.isFilteringForJob, jobId, rowIndex, this);
		}
	}

	static async __readRowsFromMySqlTable(table, tableSource, startIndex, endIndex) {
		var host = tableSource.host;
		var port = tableSource.port;
		var schema = tableSource.schema;
		var url = host + ":" + port + "/" + schema;

		var user = tableSource.user;
		var password = tableSource.password;

		var jobId = tableSource.jobId;

		var isUsingCustomQuery = tableSource.isUsingCustomQuery;
		if (isUsingCustomQuery) {
			var customQuery = tableSource.customQuery;
			return await MySqlImporter.readRowsWithCustomQuery(url, user, password, customQuery, jobId, table, startIndex, endIndex);

		} else {
			return await MySqlImporter.readRows(url, user, password, tableSource.tableName, tableSource.isFilteringForJob, jobId, this, startIndex, endIndex);
		}
	}

}