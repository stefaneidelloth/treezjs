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
        this.customJobId = 'myCustomJobId';
        this.customQuery = '';

        this.host = 'host';

		this.image = 'tableImport.png';
        this.isAppendingData= false;        
        this.isFilteringforJobId = false;
        this.isInheritingSourceFilePath = false;
        this.isLinkingSource = false;
		this.isRunnable=true;
        this.isUsingCustomQuery= false;

        this.numberOfHeaderLinesToSkip=0;

        this.password = 'password';
        this.port = 'port';
       
        this.rowLimit = 1000;

        this.schema = 'my_schema';
        this.sourceFilePath = 'C:/data.csv';
        this.sourceType = TableSourceType.csv;

        this.tableName = 'table_name';

        this.user = 'user';

        this.__sourceTypeSelection = undefined;	
		this.__isLinkingSourceSelection = undefined;
		this.__rowLimitSelection = undefined;
        this.__isInheritingSourceFilePathSelection = undefined;
		this.__sourceFilePathSelection = undefined;		
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
				
		this.__createSourceTypeSection(page); 
		this.__createSourceDataSection(page);                
	}

	

	__createSourceTypeSection(page) {
		
		var section = page.append('treez-section')
			.label('Source type');
			
		 section.append('treez-section-action')
	         .image('run.png')
	         .label('Import data')
	         .addAction(()=>this.execute(this.__treeView)
	        		 			.catch(error => {
									  console.error('Could not execute  ' + this.constructor.name + ' "' + this.name + '"!', error);									 
								  })
	         );
		 
		 var sectionContent = section.append('div');
		 
		this.__sourceTypeSelection = sectionContent.append('treez-enum-combo-box')
			.label('Source type')
			.nodeAttr('options', TableSourceType)			
			.bindValue(this,()=>this.sourceType)
			.onChange(()=>this.__showAndHideDependentComponents());
		
		
		//if true, the target table is linked to the original source
		//pro: for huge tables only the first few rows need to be initialized and the
		//remaining data can be loaded lazily.
		//con: if the source is replaced/changed/deleted, e.g. in a sweep, the
		//link might not give meaningful data.
		this.__isLinkingSourceSelection = sectionContent.append('treez-check-box')
			.label('Link source')
			.bindValue(this, ()=>this.isLinkingSource)
			.onChange(()=>this.__showAndHideDependentComponents());

		

		this.__rowLimitSelection = sectionContent.append('treez-text-field')
			.label('Row limit')			
			.bindValue(this,()=>this.rowLimit);		

	}

	

	__createSourceDataSection(page) {
		
		var section = page.append('treez-section')
			.label('Source data');
		
		var sectionContent = section.append('div');
		
		//inherit source file path : take (modified) parent output path
		this.__isInheritingSourceFilePathSelection = sectionContent.append('treez-check-box')
			.label('Inherit source file path')			
			.bindValue(this, ()=>this.isInheritingSourceFilePath)
			.onChange(()=>this.__showAndHideDependentComponents());

		this.__sourceFilePathSelection = sectionContent.append('treez-file-path')
			.label('Source file')
			.bindValue(this, ()=>this.sourceFilePath);

		this.__numberOfHeaderLinesToSkipSelection = sectionContent.append('treez-text-field')
			.label('Number of header lines to skip')
			.bindValue(this, ()=>this.numberOfHeaderLinesToSkip);

		this.__customColumnHeadersSelection = sectionContent.append('treez-text-field')
			.label('Custom column headers (as comma separated list)' )
			.bindValue(this, ()=>this.customColumnHeaders);
		
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
		
		this.__isFilteringforJobIdSelection = sectionContent.append('treez-check-box')
			.label('Filter rows with JobId')			
			.bindValue(this, ()=>this.isFilteringforJobId)
			.onChange(()=>this.__showAndHideJobComponents());		

		this.__customJobIdSelection = sectionContent.append('treez-text-field')
			.label('JobId')			
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
			.label('Append data')			
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
		this.__updatedInheritedSourcePath();
	}

	__updatedInheritedSourcePath() {		
		if (this.isInheritingSourceFilePath) {
			this.sourceFilePath = this.sourcePath;
		}
	}

	__showAndHideDependentComponents() {		
		switch (this.sourceType) {
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
			var message = 'The TableSourceType "' + this.sourceType + '" is not yet implemented.';
			throw new Error(message);
		}
	}

	__showAndHideCompontentsForCsv() {

		this.__isLinkingSourceSelection.hide(); //TODO: check if csv can be read paginated. If so, it might make sense to show this
		
		this.__isFilteringforJobIdSelection.show();		
		this.__showAndHideJobComponents()

		this.__isInheritingSourceFilePathSelection.show();
	
		if(this.isInheritingSourceFilePath){
			this.__sourceFilePathSelection.hide();
			this.__columnSeparatorSelection.hide();
		} else {
			this.__sourceFilePathSelection.show();
			this.__columnSeparatorSelection.show();
		}

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

		this.__isInheritingSourceFilePathSelection.show();
		
		if(this.isInheritingSourceFilePath){
			this.__sourceFilePathSelection.hide();			
		} else {
			this.__sourceFilePathSelection.show();			
		}

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

		this.__isInheritingSourceFilePathSelection.hide();
		this.__sourceFilePathSelection.hide();
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

		treeView.refresh();

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
		switch (this.sourceType) {
		case TableSourceType.csv:	
			return await TextImporter.importData(
				this.sourcePath, 
				this.numberOfHeaderLinesToSkip, 
				this.customColumnHeaderArray, 
				this.columnSeparator, 
				this.isFilteringForJobId,
				this.jobId,
				this.rowLimit				
				);	
			
		case TableSourceType.sqLite:
			var rowOffset = 0;
			return await SqLiteImporter.importData(
				this.sourcePath, 
				this.password, 
				this.tableName, 
				this.isFilteringforJobId, 
				this.jobId, 
				this.rowLimit,
				rowOffset);	
			
		case TableSourceType.mySql:			
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
			throw new Error('The TableSourceType "' + this.sourceType + '" is not yet implemented.');
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
		if (this.isInheritingSourceFilePath) {
			return this.__getSourcePathFromParent();
		} else {
			return this.sourceFilePath;
		}		
	}


	__getSourcePathFromParent() {		
		if (!this.parent) {
			return '';
		}
		
		if(this.parent.provideFilePath){
			return this.parent.provideFilePath();
		} else {
			var message = 'The parent atom "' + parent.name + '" does not have a method provideFilePath.'
			+ 'Therefore the soruce file path could not be inherited. Please deactivate the inheritance or implement the missing method.';
			throw new Error(message);
		}		
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
		
		for (var rowEntries of tableData.rowData) {
			var doubleEntries = rowEntries.map((valueString)=>parseFloat(valueString));
			table.createRow(doubleEntries);
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
		var headers = tableData.headerData;		
		if (table.hasColumns) {			
			var columnNamesAreOk = table.checkHeaders(headers);
			if (!columnNamesAreOk) {
				var message = 'The result table already has columns but the column names are wrong.';
				throw new Error(message);
			}
		} else {
			
			var columnFolder;
			try {
				columnFolder = table.getColumnFolder();
			} catch (error) {
				columnFolder = table.createColumnFolder();
			}

			for (var header of headers) {
				columnFolder.createColumn(header, ColumnType.double);
			}
		}
	}	

	set jobId(jobId) {
		super.jobId = jobId;
		this.customJobId = jobId;		
	}

}
