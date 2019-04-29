import Model from './../model.js';
import AddChildAtomTreeViewAction from './../../core/treeview/addChildAtomTreeViewAction.js';
import GenericInput from './../genericInput/genericInput.js';

import TableTargetType from './../../data/table/tableTargetType.js';

export default class DatabaseModifier extends Model {   

	//static variable __finishedString is defined below class definition

	constructor(name) {		
		super(name);
		this.image = 'databaseModifier.png';
		this.isRunnable=true;	

		this.sourceModelPath = 'root.models.genericInput';
		
		this.targetType = TableTargetType.sqLite;

		this.targetFilePath = 'C:/data.sqlite';
        
        this.host = 'host';
        this.port = '3128';
        this.user = 'user';
        this.password = ''; 
        
        this.query = "UPDATE 'my_table' SET 'my_column'= {$my_variable$} WHERE name='Fred'";

        this.__targetTypeSelection = undefined;			
		this.__targetFilePathSelection = undefined;		
		
		this.__hostSelection = undefined;		
		this.__portSelection = undefined;		
		this.__userSelection = undefined;		
		this.__passwordSelection = undefined;
		
		
		this.__querySelection = undefined;
        
        this.__queryInfo = undefined;
        this.__executionStatusInfo = 'Not yet executed.';
        this.__jobIdInfo = '1';   
        
	}	

    createComponentControl(tabFolder){    
     
		const page = tabFolder.append('treez-tab')
            .label('Data');

		this.__createSourceModelSection(page); 
		this.__createTargetDatabaseSection(page); 
		this.__showAndHideComponents();
		this.__createQuerySection(page);       
        this.__createStatusSection(page);
	}

	extendContextMenuActions(actions, parentSelection, treeView) {
		return actions;
	}

	afterCreateControlAdaptionHook() {
       this.__refreshStatus();
    }	

    async doRunModel(treeView, monitor) {
    	    	    	
		const startMessage = 'Running ' + this.constructor.name + ' "' + this.name + '".';
		monitor.info(startMessage);

		//initialize progress monitor
		
		monitor.totalWork = 2;	
		
		const query = this.__buildQuery();
		
		monitor.worked(1);			
		
		monitor.info('Executing ' + query);		
		await this.__executeQuery(query, monitor);
		
		monitor.done();				

		return null;
    }  
    
    async __executeQuery(query, monitor){
    	
    	switch(this.targetType){
    		case TableTargetType.sqLite:
    			var connectionString = this.targetFilePath;
    			var query = this.__buildQuery();
    			await window.treezTerminal.sqLiteQuery(connectionString, query, false)
    				.catch((error)=>{
    					monitor.error(error);
    					monitor.cancel();
    				});
    			break;
    		case TableTargetType.mySql:
    			throw new Error('Not yet implemented');
    		default:
    			throw new Error('Not yet implemented');    		
    	}    	
    }   

    __createSourceModelSection(page) {

    	const section = page.append('treez-section')
            .label('Source model'); 

        const sectionContent = section.append('div'); 

        sectionContent.append('treez-model-path')
        	.label('Source model')
        	.nodeAttr('atomClasses', [GenericInput])        	
        	.bindValue(this, ()=>this.sourceModelPath);
    }

    __createTargetDatabaseSection(page) {

		const section = page.append('treez-section')
            .label('Target database'); 

        const sectionContent = section.append('div'); 
        
        sectionContent.append('treez-enum-combo-box')
        	.label('Type')
        	.nodeAttr('options', TableTargetType)
        	.onChange(() => this.__showAndHideComponents())
        	.bindValue(this, ()=>this.targetType);

        this.__targetFilePathSelection = sectionContent.append('treez-file-path')
            .label('Database file')           
            .onChange(()=>this.__refreshStatus())           
            .bindValue(this,()=>this.targetFilePath);  
        
        this.__hostSelection = sectionContent.append('treez-text-field')
        	.label('Host')
        	.bindValue(this,()=>this.host);
        
        this.__portSelection = sectionContent.append('treez-text-field')
	    	.label('Port')
	    	.bindValue(this,()=>this.port);
        
        this.__userSelection = sectionContent.append('treez-text-field')
	    	.label('User')
	    	.bindValue(this,()=>this.user);
        
        this.__passwordSelection = sectionContent.append('treez-text-field')
	    	.label('Password')
	    	.bindValue(this,()=>this.password);
                  
	}  

	__showAndHideComponents(){
		switch(this.targetType){
			case TableTargetType.sqLite:
				this.__showAndHideComponentsForSqLite();
				break;
			case TableTargetType.mySql:
			this.__showAndHideComponentsForMySql();
				break;
			default:
				throw new Error('Not yet implemented');
		}
	}

	__showAndHideComponentsForSqLite(){		
		this.__hostSelection.hide();		
		this.__portSelection.hide();	
		this.__userSelection.hide();	
		this.__passwordSelection.show();	
		this.__targetFilePathSelection.show();	
	}

	__showAndHideComponentsForMySql(){
		this.__hostSelection.show();		
		this.__portSelection.show();	
		this.__userSelection.show();	
		this.__passwordSelection.show();	
		this.__targetFilePathSelection.hide();	
	}
    
   
	__createQuerySection(page) {
       
        const section = page.append('treez-section')
            .label('Query'); 
        
        section.append('treez-section-action')
	        .image('run.png')
	        .label('Run query')
	        .addAction(()=>this.execute(this.__treeView)
	        				   .catch(error => {
	        					   	console.error('Could not execute  ' + this.constructor.name + ' "' + this.name + '"!', error);            					   
	        				   })
	        );  

        const sectionContent = section.append('div'); 

        sectionContent.append('treez-text-area')
            .label('Query')           
            .onChange(()=>this.__refreshStatus())           
            .bindValue(this,()=>this.query);
		          
	}   	

	__createStatusSection(page) {
       const section = page.append('treez-section')
           .label('Status')
           .attr('expanded','false');

       const sectionContent = section.append('div'); 
     
       sectionContent.append('treez-text-area')
            .label('Resulting query') 
            .disable() 
            .bindValue(this,()=>this.__queryInfo);  
     
       sectionContent.append('treez-text-area')
            .label('Execution status') 
            .disable()
            .bindValue(this,()=>this.__executionStatusInfo);
      
   }      

   __refreshStatus() {
		this.__queryInfo = this.__buildQuery();
		this.__executionStatusInfo = 'Not yet executed';		
	}		

	__buildQuery(){
		
		let query = this.__injectStudyAndJobInfoIfUsed(this.query);
		query = this.__injectVariableValuesIfUsed(query);
		
		return query;
	}	

	__injectStudyAndJobInfoIfUsed(query){
		const studyIdKey = '{$studyId$}';
        const studyDescriptionKey = '{$studyDescription$}';
        const jobIdKey = '{$jobId$}';

        let currentQuery = query;

		if (currentQuery.includes(studyIdKey)) {

			if (this.studyId) {
				currentQuery = currentQuery.replace(studyIdKey, this.studyId);				
			} else {
				currentQuery = currentQuery.replace(studyIdKey, '');
			}
		}

		if (currentQuery.includes(studyDescriptionKey)) {
			currentQuery = currentQuery.replace(studyDescriptionKey, this.studyDescription);
		}

		if (currentQuery.includes(jobIdKey)) {
			currentQuery = currentQuery.replace(jobIdKey, this.jobId);
		}

		return currentQuery;
	}
	
	__injectVariableValuesIfUsed(query){
		
		var sourceModel = this.childFromRoot(this.sourceModelPath);
		
		var variables = sourceModel.getEnabledVariables();
		variables.forEach((variable)=>{
			var variableName = variable.name;
			var valueString = variable.value;			

			var placeholderExpression = '{$' + variableName  + '$}';
				
			query = this.__replaceAll(query, placeholderExpression, valueString);
		});
		
		return query;
		
	}
	
	__replaceAll(text, expressionToReplace, expressionToInject){
		var escapedExpression = expressionToReplace.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		var regularExpression = new RegExp(escapedExpression, 'g')
        return text.replace(regularExpression, expressionToInject);
	}	

}
