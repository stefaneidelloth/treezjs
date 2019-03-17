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
        this.columnSeparator = ';';
        this.customJobId = 'myCustomJobId';
       
        this.customQuery = '';

        this.host = 'host';
		this.image = 'tableImport.png';

        this.isAppendingData= false;
        this.isFilteringforJobId = false;
        this.isInheritingSourceFilePath = true;
        this.isLinkingSource = false;
		this.isRunnable=true;

        this.isUsingCustomQuery= false;
        this.password = 'password';
        this.port = 'port';

        this.resultTableModelPath= 'root.results.data.table';
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

	copy() {
		//TODO
	}

	createComponentControl(tabFolder){    
	     
		const page = tabFolder.append('treez-tab')
            .label('Data');
				
		this.__createSourceTypeSection(page); 
		this.__createSourceDataSection(page);
        this.__createTargetSection(page);            
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
									  monitor.done();
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

		this.__sourceFilePathSelection = section.append('treez-file-path')
			.label('Source file')
			.bindValue(this, ()=>this.sourceFilePath);
		
		this.__columnSeparatorSelection = section.append('treez-text-field')
			.label('Column separator')
			.bindValue(this, ()=>this.columnSeparator);
		
		this.__hostSelection = section.append('treez-text-field')
			.label('Host')
			.bindValue(this, ()=>this.host);
		
		this.__portSelection = section.append('treez-text-field')
			.label('Port')
			.bindValue(this, ()=>this.port);
		
		this.__userSelection = section.append('treez-text-field')
			.label('User')
			.bindValue(this, ()=>this.user);
		
		this.__passwordSelection = section.append('treez-text-field')
			.label('Password')
			.bindValue(this, ()=>this.password);
		
		this.__schemaSelection = section.append('treez-text-field')
			.label('Schema name')
			.bindValue(this, ()=>this.schema);
		
		this.__tableNameSelection = section.append('treez-text-field')
			.label('Table name')
			.bindValue(this, ()=>this.tableName);
		
		this.__isFilteringforJobIdSelection = sectionContent.append('treez-check-box')
			.label('Filter rows with JobId')			
			.bindValue(this, ()=>this.isFilteringforJob)
			.onChange(()=>this.__showAndHideJobComponents());		

		this.__customJobIdSelection = section.append('treez-text-field')
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

		this.__customQuerySelection = section.append('treez-text-field')
			.label('Custom query')
			.bindValue(this, ()=>this.customQuery);	

	}
	
	__createTargetSection(page) {
		
		var section = page.append('treez-section')
		.label('Target data');
	
		var sectionContent = section.append('div');
		
		//target result table (must already exist for manual execution of the TableImport)
		sectionContent.append('treez-model-path')
			.label('Result table')
			.nodeAttr('atomClasses', [Table])
			.bindValue(this, ()=>this.resultTableModelPath);

		
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
			var message = 'The TableSourceType ' + this.sourceType + ' is not yet implemented.';
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

		monitor.info('Running ' + this.constructor.name + ' "' + this.name + '"');

		if (!this.resultTableModelPath) {
			throw new Error('The table import must define a target result table.');
		}

		try {
			this.getChildFromRoot(this.resultTableModelPath);
		} catch (error) {
			var message = 'Could not find target result table ' + this.resultTableModelPath;
			throw new Error(message);
		}

		var table;		
		if (this.isLinkingToSource) {
			table = this.__linkTargetTableToSource(this.resultTableModelPath);
		} else {
			var tableData = await this.__importTableData();			
			table = this.__writeDataToTargetTable(tableData, this.resultTableModelPath, this.isAppendingData);
		}

		//create a copy of the target table to be able to conserve it as a model output for the current run
		var outputTableName = this.name + 'Output';
		var outputTable = table.copy();
		outputTable.name = outputTableName;		

		monitor.info(this.constructor.name + ' "' + this.name + ' finished.');

		//return model output
		return outputTable;
	}

	async importTableData() {			
		switch (this.tableSourceType) {
		case TableSourceType.csv:
			return await TextDataTableImporter.importData(this.sourcePath, this.columnSeparator, this.rowLimit);			
		case TableSourceType.sqLite:
			return await SqLiteImporter.importData(this.sourcePath, this.password, this.tableName, this.isFilteringforJobId, this.jobId, this.rowLimit, 0);			
		case TableSourceType.mySql:			
			var url = this.host + ":" + this.port + "/" + this.schema;
			return await MySqlImporter.importData(url, this.user, this.password, this.tableName, this.isFilteringforJobId, this.jobId, this.rowLimit, 0);			
		default:
			throw new Error('The TableSourceType "' + tableSourceType + '" is not yet implemented.');
		}
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

	__linkTargetTableToSource(targetModelPath, tableSource) {
		var table = this.getChildFromRoot(targetModelPath);
		table.removeChildrenByClass(TableSource);
		
		var newTableSource = new TableSource(tableSource);
		table.addChild(newTableSource);
		table.refresh();
		return table;
	}


	__writeDataToTargetTable(tableData, tableModelPath, appendData) {

		var table = this.getChildFromRoot(tableModelPath);
		
		this.__checkAndPrepareColumnsIfRequired(tableData, treezTable);
		
		if (!this.isAppendingData) {
			table.deleteAllRows();
		}
		
		for (var rowEntries of tableData.getRowData()) {
			table.addRow(rowEntries);
		}

		return table;
	}

	static checkAndPrepareColumnsIfRequired(tableData, table) {
		var headers = tableData.getHeaderData();		
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
				columnFolder.createColumn(header, ColumnType.string);
			}
		}
	}	

	set jobId(jobId) {
		super.jobId = jobId;
		this.customJobId = jobId;		
	}

}
