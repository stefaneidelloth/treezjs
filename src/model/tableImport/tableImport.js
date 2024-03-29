import Model from './../model.js';
import Table from './../../data/table/table.js';
import TableSourceType from './../../data/table/tableSourceType.js';
import TextImporter from './../../data/database/text/textImporter.js';
import SqLiteImporter from './../../data/database/sqlite/sqLiteImporter.js';
import MySqlImporter from './../../data/database/mysql/mySqlImporter.js';
import ColumnType from './../../data/column/columnType.js';
export default class TableImport extends Model {	

	constructor(name) {		
		super(name);
              
        this.columnSeparator = ',';
        this.customColumnHeaders = '';
        this.customJobId = '1';
        this.customQuery = '';

        this.host = 'host';

		this.image = 'tableImport.png';
        this.isAppendingData= false;        
        this.isFilteringforJobId = false;       
        this.isLinkingSource = false;
        this.isReplacingColumnHeaders = false;
		this.isRunnable=true;
        this.isUsingCustomQuery= false;

        this.numberOfHeaderLinesToSkip=0;

        this.password = '';
        this.port = '';
       
        this.rowLimit = 1000;

        this.schema = 'my_schema';
        this.filePath = 'C:/data.csv';
        this.type = TableSourceType.csv;

        this.tableName = 'table_name';

        this.user = 'user';

        this.__typeSelection = undefined;	
		this.__isLinkingSourceSelection = undefined;
		this.__isReplacingColumnHeadersSelection = undefined;
		this.__rowLimitSelection = undefined;       
		this.__filePathSelection = undefined;		
		this.__columnSeparatorSelection = undefined;		
		this.__hostSelection = undefined;		
		this.__portSelection = undefined;		
		this.__userSelection = undefined;		
		this.__passwordSelection = undefined;		
		this.__schemaSelection = undefined;		
		this.__tableNameSelection = undefined;		
		this.__isFilteringforJobIdSelection = undefined;	
		this.__customJobIdSelection = undefined;
		this.__isUsingCustomQuerySelection = undefined;
		this.__customQuerySelection = undefined;
	}	

	createComponentControl(tabFolder){    
	     
		const page = tabFolder.append('treez-tab')
            .label('Data');
				
		this.__createSourceSection(page); 
		this.__createImportSection(page); 

		this.__showAndHideDependentComponents();
	}

	

	__createSourceSection(page) {
		
		var section = page.append('treez-section')
			.label('Source');

		this.createHelpAction(section, 'model/tableImport/tableImport.md#source');
			
		section.append('treez-section-action')
	    	.image('run.png')
	        .label('Import table')
	        .addAction(()=>this.execute(this.__treeView)
	        		 			.catch(error => {
									  console.error('Could not execute  ' + this.constructor.name + ' "' + this.name + '"!', error);									 
								  })
	        );
		 
		var sectionContent = section.append('div');
		 
		this.__typeSelection = sectionContent.append('treez-enum-combo-box')
			.label('Type')
			.nodeAttr('enum', TableSourceType)
			.onChange(()=>this.__showAndHideDependentComponents())	
			.bindValue(this,()=>this.type);			
		
		this.__filePathSelection = sectionContent.append('treez-file-path')
			.label('File')
			.nodeAttr('pathMapProvider', this)
			.bindValue(this, ()=>this.filePath);
			
		this.__columnSeparatorSelection = sectionContent.append('treez-text-field')
			.label('Column separator')
			.bindValue(this, ()=>this.columnSeparator);
		
		this.__hostSelection = sectionContent.append('treez-text-field')
			.label('Host')
			.bindValue(this, ()=>this.host);
		
		this.__portSelection = sectionContent.append('treez-text-field')
			.label('Port')
			.bindValue(this, ()=>this.port);
		
		this.__userSelection = sectionContent.append('treez-text-field')
			.label('User')
			.bindValue(this, ()=>this.user);
		
		this.__passwordSelection = sectionContent.append('treez-text-field')
			.label('Password')
			.bindValue(this, ()=>this.password);
		
		this.__schemaSelection = sectionContent.append('treez-text-field')
			.label('Schema name')
			.bindValue(this, ()=>this.schema);
		
		this.__tableNameSelection = sectionContent.append('treez-text-field')
			.label('Table name')
			.bindValue(this, ()=>this.tableName);
	}

	

	__createImportSection(page) {
		
		var section = page.append('treez-section')
			.label('Import');
		
		var sectionContent = section.append('div');	


		this.createHelpAction(section, 'model/tableImport/tableImport.md#import');			
	

		this.__numberOfHeaderLinesToSkipSelection = sectionContent.append('treez-text-field')
			.label('Number of header lines to skip')
			.bindValue(this, ()=>this.numberOfHeaderLinesToSkip);

		this.__rowLimitSelection = sectionContent.append('treez-text-field')
			.label('Row limit (too many imported rows might crash user interface)')			
			.bindValue(this,()=>this.rowLimit);	

		this.__isReplacingColumnHeadersSelection = sectionContent.append('treez-check-box')
			.label('Replace column headers')
			.bindValue(this, ()=>this.isReplacingColumnHeaders)
			.onChange(()=>this.__showAndHideCustomColumnHeaders());

		this.__customColumnHeadersSelection = sectionContent.append('treez-text-field')
			.label('Custom column headers (as comma separated list)' )
			.bindValue(this, ()=>this.customColumnHeaders);

		//if true, the target table is linked to the original source
		//pro: for huge tables only the first few rows need to be loaded and the
		//remaining data can be loaded lazily.
		//con: if the source is replaced/changed/deleted, e.g. in a sweep, the
		//link does not work.
		this.__isLinkingSourceSelection = sectionContent.append('treez-check-box')
			.label('Link table to source')
			.bindValue(this, ()=>this.isLinkingSource)
			.onChange(()=>this.__showAndHideDependentComponents());
		
		
		this.__isFilteringforJobIdSelection = sectionContent.append('treez-check-box')
			.label('Filter rows by jobId (requires column "job_id")')			
			.bindValue(this, ()=>this.isFilteringforJobId)
			.onChange(()=>this.__showAndHideJobComponents());		

		this.__customJobIdSelection = sectionContent.append('treez-text-field')
			.label('Custom jobId')			
			.bindValue(this, ()=>this.customJobId)
			.onChange(()=>{
				if (this.jobId !== this.customJobId) {
					this.jobId = this.customJobId;
				}
			});

		this.__isUsingCustomQuerySelection = sectionContent.append('treez-check-box')
			.label('Use custom query')			
			.bindValue(this, ()=>this.isUsingCustomQuery)
			.onChange(()=>this.__showAndHideQueryComponents());

		this.__customQuerySelection = sectionContent.append('treez-text-field')
			.label('Custom query')
			.bindValue(this, ()=>this.customQuery);			
		
		sectionContent.append('treez-check-box')
			.label('Append data of subsequent runs')			
			.bindValue(this, ()=>this.isAppendingData);

	}
	
	__showAndHideLinkComponents() {		
		if (this.isLinkingSource) {
			this.__rowLimitSelection.hide();
			this.__appendDataSelection.hide();			
		} else {
			this.__rowLimitSelection.show();
			this.__appendDataSelection.show();
		}
	}	

	afterCreateControlAdaptionHook() {
		this.__showAndHideDependentComponents();		
	}


	__showAndHideDependentComponents() {	

		if(this.__typeSelection){
			switch (this.type) {
			case TableSourceType.csv:
				this.__showAndHideCompontentsForCsv();
				break;
			case TableSourceType.sqLite:
				this.__showAndHideCompontentsForSqLite();
				break;
			case TableSourceType.mySql:
				this.__showAndHideCompontentsForMySql();
				break;
			default:
				var message = 'The TableSourceType "' + this.type + '" is not yet implemented.';
				throw new Error(message);
			}

			this.__showAndHideCustomColumnHeaders();
		}	
		
	}

	__showAndHideCustomColumnHeaders(){
		if(this.isReplacingColumnHeaders){
			this.__customColumnHeadersSelection.show()
		} else {
			this.__customColumnHeadersSelection.hide()
		}
	}

	__showAndHideCompontentsForCsv() {

		this.__isLinkingSourceSelection.hide(); //TODO: check if csv can be read paginated. If so, it might make sense to show this
		
		this.__isFilteringforJobIdSelection.show();		
		this.__showAndHideJobComponents()	
		
		this.__filePathSelection.show();
		this.__columnSeparatorSelection.show();	

		this.__numberOfHeaderLinesToSkipSelection.show();
		

		this.__hostSelection.hide();
		this.__portSelection.hide();
		this.__userSelection.hide();
		this.__passwordSelection.hide();
		this.__schemaSelection.hide();
		this.__tableNameSelection.hide();

		this.__isUsingCustomQuerySelection.hide();
		this.__customQuerySelection.hide();
	}

	__showAndHideCompontentsForSqLite() {
		
		this.__isLinkingSourceSelection.show(); 
		this.__isFilteringforJobIdSelection.show();		
		
		this.__filePathSelection.show();

		this.__numberOfHeaderLinesToSkipSelection.hide();
		
		this.__columnSeparatorSelection.hide();
		
		this.__hostSelection.hide();
		this.__portSelection.hide();
		this.__userSelection.hide();		
		this.__passwordSelection.show();
		
		this.__schemaSelection.hide();
		this.__tableNameSelection.show();
		
		this.__isUsingCustomQuerySelection.show();			
		
		this.__showAndHideQueryComponents();
	}

	__showAndHideCompontentsForMySql() {

		this.__isLinkingSourceSelection.show(); 
		this.__isFilteringforJobIdSelection.show();	
	
		this.__filePathSelection.hide();
		this.__numberOfHeaderLinesToSkipSelection.hide();	
		this.__columnSeparatorSelection.hide();
		
		this.__hostSelection.show();
		this.__portSelection.show();
		this.__userSelection.show();
		this.__passwordSelection.show();
		
		this.__schemaSelection.show();
		this.__tableNameSelection.show();
		
		this.__isUsingCustomQuerySelection.show();	
		
		this.__showAndHideQueryComponents();
		
	}
	
	__showAndHideQueryComponents() {		
		if (this.isUsingCustomQuery) {
			this.__customQuerySelection.show();
			this.__tableNameSelection.hide();
			this.__isFilteringforJobIdSelection.hide();
			this.__customJobIdSelection.show();
		} else {
			this.__customQuerySelection.hide();
			this.__tableNameSelection.show();
			this.__isFilteringforJobIdSelection.show();
			this.__showAndHideJobComponents();
		}
	}
	
	__showAndHideJobComponents() {		
		if (this.isFilteringforJobId) {
			this.__customJobIdSelection.show();
		} else {
			this.__customJobIdSelection.hide();
		}
	}

	async doRunModel(treeView, monitor) {
		
		monitor.totalWork = 2;

		monitor.info('Running ' + this.constructor.name + ' "' + this.name + '".');		

		var table;		
		if (this.isLinkingToSource) {
			table = this.__linkTargetTableToSource();
		} else {
			var tableData = await this.__importTableData();			
			table = this.__writeDataToTargetTable(tableData);
		}
		
		monitor.worked(1);

		treeView.refresh(this);

		//create a copy of the target table to be able to conserve it as a model output for the current run
		var outputTableName = this.name + 'Output';
		var outputTable = table.copy();
		outputTable.name = outputTableName;		

		monitor.done();
		monitor.info(this.constructor.name + ' "' + this.name + '" finished.');

		//return model output
		return outputTable;
	}

	async __importTableData() {			
		switch (this.type.name) {
		case TableSourceType.csv.name:	
			return await TextImporter.importData(
				this.sourcePath, 
				this.numberOfHeaderLinesToSkip, 
				this.customColumnHeaderArray, 
				this.columnSeparator, 
				this.isFilteringForJobId,
				this.jobId,
				this.rowLimit				
				);	
			
		case TableSourceType.sqLite.name:
			var rowOffset = 0;
			return await SqLiteImporter.importData(
				this.sourcePath, 
				this.password, 
				this.tableName, 
				this.isFilteringforJobId, 
				this.jobId, 
				this.rowLimit,
				rowOffset);	
			
		case TableSourceType.mySql.name:			
			var url = this.host + ":" + this.port + "/" + this.schema;
			var rowOffset = 0;
			return await MySqlImporter.importData(
				url, this.user, 
				this.password,
				 this.tableName, 
				 this.isFilteringforJobId, 
				 this.jobId, 
				 this.rowLimit, 
				 rowOffset);
			
		default:
			throw new Error('The TableSourceType "' + this.type + '" is not yet implemented.');
		}
	}
	
	get customColumnHeaderArray(){

		if(!this.customColumnHeaders){
			return [];
		}

		var customColumnHeaders = [];
		var customHeaders = this.customColumnHeaders.split(',');
		for(var header of customHeaders){
			customColumnHeaders.push(header.trim());
		}
		return customColumnHeaders;
	}

	get sourcePath() {		
		return this.resolvedPath(this.filePath);				
	}


	

	__linkTargetTableToSource(tableSource) {
		this.__createTableIfNotExists();		
		var table = this.childByClass(Table);
		table.removeChildrenByClass(TableSource);
		
		var newTableSource = new TableSource(tableSource);
		table.addChild(newTableSource);
		table.refresh();
		return table;
	}


	__writeDataToTargetTable(tableData, tableModelPath, appendData) {
		this.__createTableIfNotExists();		
		var table = this.childByClass(Table);
		
		TableImport.__checkAndPrepareColumnsIfRequired(tableData, table);
		
		if (!this.isAppendingData) {
			table.deleteAllRows();
		}
		
		for (var rowEntries of tableData.rows) {
			var values = rowEntries.map((valueString)=>valueString);
			table.createRow(values);
		}

		return table;
	}
	
	__createTableIfNotExists(){
		if(this.children.length < 1){
			this.createTable('table');
		}
	}

	createTable(name){
		return this.createChild(Table,name);
	}

	static __checkAndPrepareColumnsIfRequired(tableData, table) {
		var headers = tableData.headers;		
		if (table.hasColumns) {			
			var columnNamesAreOk = table.checkHeaders(headers);
			if (!columnNamesAreOk) {
				var message = 'The result table already has columns but the column names are wrong.';
				throw new Error(message);
			}
		} else {
			
			var columnFolder = table.columnFolder;
			if(!columnFolder) {
				columnFolder = table.createColumnFolder();
			}

			if(headers){				
				for (var header of headers) {
					var columnType = tableData.columnType(header)
					columnFolder.createColumn(header, columnType);
				}
			}
		}
	}	

	set jobId(jobId) {
		super.jobId = jobId;
		this.customJobId = jobId;		
	}

}
