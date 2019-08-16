import Model from './../model.js';
import AddChildAtomTreeViewAction from './../../core/treeview/addChildAtomTreeViewAction.js';
import GenericInput from './../genericInput/genericInput.js';
import SqLiteImporter from './../../data/database/sqlite/sqLiteImporter.js';
import ColumnBlueprint from './../../data/column/columnBlueprint.js';
import TableTargetType from './../../data/table/tableTargetType.js';

export default class SqLiteAppender extends Model { 

	constructor(name) {		
		super(name);
		this.image = 'databaseAppender.png';
		this.isRunnable=true;	

		this.sourceFilePath = 'C:/output.sqlite';
		this.targetFilePath = 'C:/cumulatedOutput.sqlite';
				
		this.isAppendingExplicitTables = false;
		this.explicitTableNames = [];

		this.__explicitTableNamesSelection = undefined;
        
	}	

    createComponentControl(tabFolder){    
     
		const page = tabFolder.append('treez-tab')
            .label('Data');
		
		const section = page.append('treez-section')
        	.label('SqLite appender'); 

		this.createHelpAction(section, 'model/sqLiteAppender/sqLiteAppender.md');
		
		 section.append('treez-section-action')
	        .image('run.png')
	        .label('Append')
	        .addAction(()=>this.execute(this.__treeView)
	        				   .catch(error => {
	        					   	console.error('Could not execute  ' + this.constructor.name + ' "' + this.name + '"!', error);            					   
	        				   })
	        );  

		const sectionContent = section.append('div');     

		sectionContent.append('treez-file-path')
	        .label('Source') 
	        .nodeAttr('pathMapProvider', this)
	        .bindValue(this,()=>this.sourceFilePath);  
		
		sectionContent.append('treez-file-path')
	        .label('Target') 
	        .nodeAttr('pathMapProvider', this)
			.bindValue(this,()=>this.targetFilePath); 
			
		sectionContent.append('treez-check-box')
	        .label('Only append explicit tables') 
	        .onChange(()=>this.__showOrHideDependendComponents())	       
			.bindValue(this,()=>this.isAppendingExplicitTables); 
			
		this.__explicitTableNamesSelection = sectionContent.append('treez-string-list')
	        .label('Names of tables to append') 	       
	        .bindValue(this,()=>this.explicitTableNames);

	    this.__showOrHideDependendComponents();
	}
	

	extendContextMenuActions(actions, parentSelection, treeView) {
		return actions;
	}

    async doRunModel(treeView, monitor) {
    	    	    	
		const startMessage = 'Running ' + this.constructor.name + ' "' + this.name + 
		                     '" (studyId: ' + this.studyId + ', jobId: ' + this.jobId + ').';
		monitor.info(startMessage);

		var tableNames = this.isAppendingExplicitTables
			?this.explicitTableNames
			:await SqLiteImporter.tableNames(this.fullPath(this.sourceFilePath), this.password);	
				
		monitor.totalWork = tableNames.length;			
		
		for(var tableName of tableNames){
			monitor.info('Appending table "' + tableName +'".');
			await this.__appendTable(tableName);
			monitor.worked(1);	
		}	
		
		monitor.done();				

		return null;
    } 

	__showOrHideDependendComponents(){
		if(this.isAppendingExplicitTables){
			this.__explicitTableNamesSelection.show();
		} else {
			this.__explicitTableNamesSelection.hide();
		}
	}

    
    
    async __appendTable(tableName){

    	var columnBlueprints = await SqLiteImporter.readTableStructure(this.fullPath(this.sourceFilePath), this.password, tableName);
    	this.__disablePrimaryKeys(columnBlueprints);
		columnBlueprints = this.__insertStudyIdAndJobIdColumns(columnBlueprints);
    	
    	await SqLiteImporter.createTableIfNotExists(this.fullPath(this.targetFilePath), this.password, tableName, columnBlueprints);

    	var tableData = await SqLiteImporter.importData(this.fullPath(this.sourceFilePath), this.password, tableName);
    	tableData = this.__insertStudyIdAndJobId(tableData);

    	await SqLiteImporter.appendData(this.fullPath(this.targetFilePath), this.password, tableName, columnBlueprints, tableData);    	
    }

    __disablePrimaryKeys(columnBlueprints){
    	for(var columnBlueprint of columnBlueprints){
    		columnBlueprint.isPrimaryKey=false;
    	}
    }

    __insertStudyIdAndJobIdColumns(columnBlueprints){
    	columnBlueprints.splice(0,0,
    		new ColumnBlueprint(
    			'jobId',
    			'jobId',
				ColumnType.string,
				this.jobId,
				false,
				false,
				false
			)	
		);

    	columnBlueprints.splice(0,0,
    		new ColumnBlueprint(
    			'studyId',
    			'studyId',
				ColumnType.string,
				this.studyId,
				false,
				false,			
				false
			)
		);

		return columnBlueprints;
    }

    __insertStudyIdAndJobId(tableData){

    	tableData.headers.splice(0,0,'jobId');
    	tableData.headers.splice(0,0,'studyId');

    	var studyId = this.studyId === undefined
    					?'undefined'
    					:this.studyId;
    					
    	var jobId = this.jobId;

    	for(var row of tableData.rows){
			row.splice(0,0,jobId);
			row.splice(0,0,studyId);
    	}

    	return tableData;
    }      

}
