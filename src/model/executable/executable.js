import Model from './../model.js';
import AddChildAtomTreeViewAction from './../../core/treeview/addChildAtomTreeViewAction.js';
import InputFileGenerator from './../inputFileGenerator/inputFileGenerator.js';

import InputModification from './inputModification.js';
import OutputModification from './outputModification.js';
import LoggingArguments from './loggingArguments.js';

export default class Executable extends Model { 	

	constructor(name) {		
		super(name);
		this.image = 'run.png';
		this.isRunnable=true;	
        
		this.executablePath = 'notepad.exe';
        
        this.inputArguments = '';
        this.inputPath = '';
               
        this.outputArguments = '';
        this.outputPath = '';       
        
        this.__commandInfo = ''; 
        
        this.treeView=undefined;
	}	

    createComponentControl(tabFolder){    
     
		const page = tabFolder.append('treez-tab')
            .label('Data');

		this.__createExecutableSection(page); 
		this.__createInterimSections(page);
        this.__createInputSection(page);      
        this.__createOutputSection(page); 
        this.__createStatusSection(page);
	}

	providePath() {
		return this.__getModifiedOutputPath();		
	}

	provideInputPath() {
		return this.__getModifiedInputPath();		
	}

	extendContextMenuActions(actions, parentSelection, treeView) {
		
		this.treeView=treeView;		
		
		actions.push(new AddChildAtomTreeViewAction(
				InputModification,
				'inputModification',
				'inputModification.png',
				parentSelection,
				this,
				treeView));		
		
		actions.push(new AddChildAtomTreeViewAction(
				OutputModification,
				'outputModification',
				'outputModification.png',
				parentSelection,	
				this,
				treeView));		
		
		actions.push(new AddChildAtomTreeViewAction(
				LoggingArguments,
				'loggingArguments',
				'loggingArguments.png',
				parentSelection,	
				this,
				treeView));		

		return actions;
	}

	afterCreateControlAdaptionHook() {
       this.refreshStatus();
    }	

    async doRunModel(treeView, monitor) {
    	    	    	
		const startMessage = 'Running ' + this.constructor.name + ' "' + this.name + '".';
		monitor.info(startMessage);
	
		const totalWork = 2;
		monitor.totalWork = totalWork;	
		
		monitor.description = 'Executing system command.';
		const command = this.__buildCommand();

		monitor.worked(1);		
		
		monitor.info('Executing ' + command);
		await this.__executeCommand(command, monitor);

		this.increaseJobId();		
		
		monitor.done();
		
    }  
    
    async __executeCommand(command, monitor){

    	var self = this;

    	return await new Promise(function(resolve, reject){
	    	try {				
				window.treezTerminal.execute(command, messageHandler, errorHandler, finishedHandler);

				function messageHandler(message){
					monitor.info(message);
				}						
					
				function errorHandler(message){
					
					if(message.startsWith('WARNING')){
						messageHandler(message);
						return;
					}
					
					const errorTitle = 'Executing system command failed:\n';
					monitor.description = errorTitle;
					monitor.error(errorTitle + message);
					monitor.cancel();
					
					reject(errorTitle+ message);					
				}

				function finishedHandler(){
					resolve();
				}
				
			} catch (exception) {
				let errorTitle  = 'Could not execute "' + self.name + '"\n';
				monitor.error(errorTitle, exception);
				monitor.cancel();
				reject(errorTitle + exception.toString());
			}	
    	});	
    }
    
	createInputModification(name) {
		return this.createChild(InputModification, name);
	}

	createOutputModification(name) {
		return this.createChild(OutputModification, name);
	}
	
	createLoggingArguments(name) {
		return this.createChild(LoggingArguments, name);
	}

    __createExecutableSection(tab) {

		const section = tab.append('treez-section')
            .label('Executable'); 

        this.createHelpAction(section, 'model/executable/executable.md#executable-1');

		section.append('treez-section-action')
	        .image('resetjobId.png')
	        .label('Reset jobId to 1')
	        .addAction(()=>this.resetJobId());

        section.append('treez-section-action')
            .image('run.png')
            .label('Run executable')
            .addAction(()=>this.execute(this.__treeView)
            				   .catch(error => {
            					   	console.error('Could not execute  ' + this.constructor.name + ' "' + this.name + '"!', error);            					   
            				   })
            );  

        const sectionContent = section.append('div'); 

        sectionContent.append('treez-file-path')
            .label('Executable')           
            .onChange(()=>this.refreshStatus())    
            .nodeAttr('pathMapProvider', this)
            .bindValue(this,()=>this.executablePath);            
	}  
    
    __createInterimSections(page){
    	//can be overridden by inheriting classes
    }

	__createInputSection(page) {
       
        const section = page.append('treez-section')
            .label('Input'); 

        this.createHelpAction(section, 'model/executable/' + this.atomType + '.md#input');

        const sectionContent = section.append('div'); 

        sectionContent.append('treez-text-area')
            .label('Input arguments')           
            .onChange(()=>this.refreshStatus())           
            .bindValue(this,()=>this.inputArguments); 

		sectionContent.append('treez-file-or-directory-path')
            .label('Input file or directory')  
            .nodeAttr('pathMapProvider', this)
            .onChange(()=>this.refreshStatus())           
            .bindValue(this,()=>this.inputPath);            
	}   
  
	__createOutputSection(page) {
       const section = page.append('treez-section')
           .label('Output');

       this.createHelpAction(section, 'model/executable/' + this.atomType + '.md#output');

       const sectionContent = section.append('div'); 

       sectionContent.append('treez-text-area')
            .label('Output arguments')           
            .onChange(()=>this.refreshStatus())          
            .bindValue(this,()=>this.outputArguments); 

       sectionContent.append('treez-file-or-directory-path')
            .label('Output file or directory')   
            .nodeAttr('pathMapProvider', this)
            .onChange(()=>this.refreshStatus())           
            .bindValue(this,()=>this.outputPath);
	}  	

	__createStatusSection(page) {
       const section = page.append('treez-section')
           .label('Status')
           .attr('expanded','false');

       this.createHelpAction(section, 'model/executable/' + this.atomType + '.md#status');

       const sectionContent = section.append('div'); 
     
       sectionContent.append('treez-text-area')
            .label('Resulting command') 
            .disable() 
            .bindValue(this,()=>this.__commandInfo); 
     
       sectionContent.append('treez-text-area')
            .label('Next jobId') 
            .disable() 
            .bindValue(this,()=>this.__jobId); 
   }

   refreshStatus() {
		this.__commandInfo = this.__buildCommand();
	}	

	__buildCommand(){
		let fullExecutablePath = this.fullPath(this.executablePath);
		let command = '';
		if(fullExecutablePath){
			command = command + '"' + fullExecutablePath + '"';
		} 
		command = this.__addInputArguments(command);
		command = this.__addOutputArguments(command);
		command = this.__addLoggingArguments(command);
		return command;
	}

	__addInputArguments(commandToExtend){
		let command = commandToExtend;
		if (this.inputArguments) {
			const modifiedInputArguments = this.__injectStudyAndJobInfoIfPlaceholdersAreUsed(this.inputArguments);
			if(command){
				command += ' ';
			}
			command += modifiedInputArguments;
		}

		if (this.inputPath) {
			command += ' ' + this.__getModifiedInputPath();
		}
		return command;
	}	
	
	/**
	 * If the passed input contains place holders, those place holders are
	 * replaced by the actual studyId, studyDescription and jobId.
	 * Otherwise the input is not modified. 
	 */
	__injectStudyAndJobInfoIfPlaceholdersAreUsed(input){
		const studyIdKey = '{$studyId$}';
        const studyDescriptionKey = '{$studyDescription$}';
        const jobIdKey = '{$jobId$}';

        let currentInputArguments = input;

		if (currentInputArguments.includes(studyIdKey)) {

			if (this.studyId == null) {
				currentInputArguments = currentInputArguments.replace(studyIdKey, '');
			} else {
				currentInputArguments = currentInputArguments.replace(studyIdKey, this.studyId);
			}
		}

		if (currentInputArguments.includes(studyDescriptionKey)) {
			currentInputArguments = currentInputArguments.replace(studyDescriptionKey, this.studyDescription);
		}

		if (currentInputArguments.includes(jobIdKey)) {
			currentInputArguments = currentInputArguments.replace(jobIdKey, this.jobId);
		}

		return currentInputArguments;
	}

	__getModifiedInputPath() {
		
		var inputModification = null;
		try{
			inputModification = this.childByClass(InputModification);
		} catch(error){			
		}		
		
		return inputModification
			?inputModification.getModifiedPath(this)
			:this.fullPath(this.inputPath);		
	}

	__getModifiedOutputPath() {
		var outputModification = null;
		try{
			outputModification= this.childByClass(OutputModification);
		} catch(error){			
		}
		
		return outputModification
			?outputModification.getModifiedPath(this)
			:this.fullPath(this.outputPath);		
	}

	__addOutputArguments(commandToExtend){
		let command = commandToExtend;

		if (this.outputArguments) {
			command += ' ' + this.outputArguments;
		}

		if (this.outputPath) {
			command += ' ' + this.__getModifiedOutputPath();
		}
		return command;
	}

	__addLoggingArguments(commandToExtend){
		
		var loggingArguments = null;
		try{
			loggingArguments = this.childByClass(LoggingArguments);
		} catch(error){			
		}		
		
		return loggingArguments
			?loggingArguments.addLoggingArguments(commandToExtend)
			:commandToExtend;
	}		

}

