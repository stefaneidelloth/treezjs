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
        this.password = '';        
        
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
	}
	

	extendContextMenuActions(actions, parentSelection, treeView) {
		return actions;
	}

    async doRunModel(treeView, monitor) {
    	    	    	
		const startMessage = 'Running ' + this.constructor.name + ' "' + this.name + '".';
		monitor.info(startMessage);

		var tableNames = await SqLiteImporter.tableNames(this.fullPath(this.sourceFilePath), this.password);		
		monitor.totalWork = tableNames.length;			
		
		for(var tableName of tableNames){
			await this.__appendTable(tableName);
			monitor.worked(1);	
		}	
		
		monitor.done();				

		return null;
    } 
    
    async __appendTable(tableName){

    	var columnBlueprints = await SqLiteImporter.readTableStructure(this.fullPath(this.sourceFilePath), this.password, tableName);
		columnBlueprints = this.__insertStudyIdAndJobIdColumns(columnBlueprints);
    	
    	await SqLiteImporter.createTableIfNotExists(this.fullPath(this.targetFilePath), this.password, tableName, columnBlueprints);

    	var tableData = await SqLiteImporter.importData(this.fullPath(this.sourceFilePath), this.password, tableName);
    	tableData = this.__insertStudyIdAndJobId(tableData);

    	await SqLiteImporter.appendData(this.fullPath(this.targetFilePath), this.password, tableName, columnBlueprints, tableData);    	
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
