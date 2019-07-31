import Model from './../model.js';
import AddChildAtomTreeViewAction from './../../core/treeview/addChildAtomTreeViewAction.js';
import GenericInput from './../genericInput/genericInput.js';

import TableTargetType from './../../data/table/tableTargetType.js';

export default class CodeModel extends Model {   

	//static variable __finishedString is defined below class definition

	constructor(name) {		
		super(name);		
		this.isRunnable=true;	
		
		this.sourceModelPath = 'root.models.genericInput';
        
        this.code = "";  
		
		this.__codeSelection = undefined;        
        this.__codeInfo = undefined;
        
	}

	get mode(){
		return 'javascript';
	}	

    createComponentControl(tabFolder){    
     
		const page = tabFolder.append('treez-tab')
            .label('Data');
		
		this.createSourceModelSection(page); 		
		this.createCodeSection(page);       
        this.createStatusSection(page);
	}

	extendContextMenuActions(actions, parentSelection, treeView) {
		return actions;
	}

	afterCreateControlAdaptionHook() {
       this.refreshStatus();
    }	

    async doRunModel(treeView, monitor) {
    	    	    	
		const startMessage = 'Running ' + this.constructor.name + ' "' + this.name + '".';
		monitor.info(startMessage);

		//initialize progress monitor
		
		monitor.totalWork = 2;	
		
		const code = this.buildCode();
		
		monitor.worked(1);			
		
		//monitor.info('Executing "' + code + '"');		
		await this.executeCode(code, monitor);
		
		monitor.done();				

		return null;
    }  
    
    async executeCode(code, monitor){
    	
    	throw new Error('Not yet implemented');
    }  
    
    createSourceModelSection(page) {

    	const section = page.append('treez-section')
            .label('Source model'); 

        this.createHelpAction(section, 'model/code/' + this.atomType + '.md#source-model');

        const sectionContent = section.append('div'); 

        this.__codeSelection = sectionContent.append('treez-model-path')
        	.label('Source model')
        	.nodeAttr('atomClasses', [GenericInput])        	
        	.bindValue(this, ()=>this.sourceModelPath);
    }
   
	createCodeSection(page) {
       
        const section = page.append('treez-section')
            .label('Code'); 

        this.createHelpAction(section, 'model/code/' + this.atomType + '.md#code');
        
        section.append('treez-section-action')
	        .image('resetjobId.png')
	        .label('Reset jobId to 1')
	        .addAction(()=>this.resetJobId());
        
        section.append('treez-section-action')
	        .image('run.png')
	        .label('Run code')
	        .addAction(()=>this.execute(this.__treeView)
	        				   .catch(error => {
	        					   	console.error('Could not execute  ' + this.constructor.name + ' "' + this.name + '"!', error);            					   
	        				   })
	        );  

        const sectionContent = section.append('div'); 

        sectionContent.append('treez-code-area') 
        	.attr('mode', this.mode)          
            .onChange(()=>this.refreshStatus())           
            .bindValue(this,()=>this.code);
		          
	}   	

	createStatusSection(page) {
		const section = page.append('treez-section')
           .label('Status')
           .attr('expanded','false');

		this.createHelpAction(section, 'model/code/' + this.atomType + '.md#status');

		const sectionContent = section.append('div'); 
     
		sectionContent.append('treez-text-area')
            .label('Resulting code with injected values') 
            .disable() 
            .bindValue(this,()=>this.__codeInfo);       
   }      

   refreshStatus() {
		this.__codeInfo = this.buildCode();			
	}		

	buildCode(){
		
		let code = this.__injectStudyAndJobInfoIfUsed(this.code);
		code = this.__injectVariableValuesIfUsed(code);
		
		return code;
	}	

	__injectStudyAndJobInfoIfUsed(code){
		const studyIdKey = '{$studyId$}';
        const studyDescriptionKey = '{$studyDescription$}';
        const jobIdKey = '{$jobId$}';

        let currentCode = code;

		if (currentCode.includes(studyIdKey)) {

			if (this.studyId) {
				currentCode = currentCode.replace(studyIdKey, this.studyId);				
			} else {
				currentCode = currentCode.replace(studyIdKey, '');
			}
		}

		if (currentCode.includes(studyDescriptionKey)) {
			currentCode = currentCode.replace(studyDescriptionKey, this.studyDescription);
		}

		if (currentCode.includes(jobIdKey)) {
			currentCode = currentCode.replace(jobIdKey, this.jobId);
		}

		return currentCode;
	}
	
	__injectVariableValuesIfUsed(code){
		
		if(this.sourceModelPath){
		
			var sourceModel = this.childFromRoot(this.sourceModelPath);

			if(!sourceModel){
				return code;
			}
			
			var variables = sourceModel.enabledVariables;
			variables.forEach((variable)=>{
				var variableName = variable.name;
				var valueString = variable.value;			
	
				var placeholderExpression = '{$' + variableName  + '$}';
					
				code = this.__replaceAll(code, placeholderExpression, valueString);
			});
		}
		
		return code;		
	}
	
	__replaceAll(text, expressionToReplace, expressionToInject){
		var escapedExpression = expressionToReplace.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		var regularExpression = new RegExp(escapedExpression, 'g')
        return text.replace(regularExpression, expressionToInject);
	}	

}
