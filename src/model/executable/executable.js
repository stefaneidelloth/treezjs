import Model from './../model.js';
import AddChildAtomTreeViewAction from './../../core/treeview/addChildAtomTreeViewAction.js';
import InputFileGenerator from './../inputFileGenerator/inputFileGenerator.js';
import TableImport from './../tableImport/tableImport.js';
import InputModification from './inputModification.js';
import OutputModification from './outputModification.js';
import LoggingArguments from './loggingArguments.js';


export default class Executable extends Model {   

	//static variable __finishedString is defined below class definition

	constructor(name) {		
		super(name);
		this.image = 'run.png';
		this.isRunnable=true;	
        
		this.executablePath = 'notepad.exe';
        
        this.inputArguments = '';
        this.inputPath = undefined;
               
        this.outputArguments = undefined;
        this.outputPath = undefined;
        this.isCopyingInputFileToOutputFolder = false; 
        
        this.commandInfo = undefined;
        this.executionStatusInfo = 'Not yet executed.';
        this.jobIdInfo = '1';
        
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

	provideFilePath() {
		return this.__getModifiedOutputPath();		
	}

	extendContextMenuActions(actions, parentSelection, treeView) {
		
		this.treeView=treeView;
		
		actions.push(new AddChildAtomTreeViewAction(
				InputFileGenerator,
				'inputFileGenerator',
				'inputFile.png',
				parentSelection,
				this,
				treeView));		
		
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
		
		actions.push(new AddChildAtomTreeViewAction(
				TableImport,
				'tableImport',
				'tableImport.png',
				parentSelection,
				this,
				treeView));

		return actions;
	}

	afterCreateControlAdaptionHook() {
       this.__refreshStatus();
    }	

    async doRunModel(treeView, monitor) {
    	    	    	
		const startMessage = 'Running ' + this.constructor.name + ' "' + this.name + '".';
		monitor.info(startMessage);

		//initialize progress monitor
		const totalWork = 3;
		monitor.totalWork = totalWork;

		await this.__deleteOldOutputAndLogFilesIfExist();

		monitor.description = 'Running InputFileGenerator children if exist.';

		//execute input file generator child(ren) if exist		
		
		try {
			await this.__runInputFileGenerators(treeView, monitor);
		} catch (exception) {
			monitor.error('Could not execute input file generator for executable ' + this.name, exception);
			monitor.cancel();
			return this.__createEmptyModelOutput();			
		}
		

		//create command
		monitor.description = 'Executing system command.';
		const command = this.__buildCommand();
		monitor.info('Executing ' + command);

		//execute command
		await this.__executeCommand(command, monitor);

		monitor.worked(1);			
		
		//post process execution results
		var modelOutput = await this.__postProcessExecution(treeView, monitor);
		
		monitor.done();				

		return modelOutput;
    }  
    
    async __executeCommand(command, monitor){

    	var self = this;

    	return await new Promise(function(resolve, reject){
	    	try {
				var exitingCommand = command + " & exit";
				window.treezTerminal.execute(exitingCommand, messageHandler, errorHandler, finishedHandler);

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
    
    async __postProcessExecution(treeView, monitor){
    	    		
			// update progress monitor		
			monitor.description = '=>Post processing model output.';

			const modelOutput = this.__createEmptyModelOutput();

			// execute data import child(ren) if exist
			try {
				const dataImportOutput = await this.__runDataImports(treeView, monitor);
				modelOutput.addChild(dataImportOutput);
			} catch (exception) {
				monitor.error('Could not import results of ' + this.name, exception);
				monitor.cancelAll();				
				return modelOutput;
			}

			// copy input file to output folder (modifies input file name)
			try {
				if (this.isCopyingInputFileToOutputFolder) {
					await this.__copyInputFileToOutputFolder();
				}
			} catch (exception) {
				monitor.error('Could not copy input file to output folder for ' + this.name, exception);
				monitor.cancel();
				return modelOutput;
			}

			// increase job index
			this.__increaseJobId();

			// inform progress monitor to be done
			monitor.description = 'finished\n';			

			return modelOutput;	
	}

    

	createInputFileGenerator(name) {
		return this.createChild(InputFileGenerator, name);		
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

	createTableImport(name) {
		return this.createChild(TableImport, name);
	}

    __createExecutableSection(tab) {

		const section = tab.append('treez-section')
            .label('Executable');

        section.append('treez-section-action')
            .image('resetjobId.png')
            .label('Reset jobId to 1')
            .addAction(()=>this.__resetJobId());

        section.append('treez-section-action')
            .image('run.png')
            .label('Run external executable')
            .addAction(()=>this.execute(this.__treeView)
            				   .catch(error => {
            					   	console.error('Could not execute  ' + this.constructor.name + ' "' + this.name + '"!', error);            					   
            				   })
            );  

        const sectionContent = section.append('div'); 

        sectionContent.append('treez-file-path')
            .label('Executable')           
            .onChange(()=>this.__refreshStatus())           
            .bindValue(this,()=>this.executablePath);            
	}  
    
    __createInterimSections(page){
    	//can be overridden by inheriting classes
    }

	__createInputSection(page) {
       
        const section = page.append('treez-section')
            .label('Input'); 

        const sectionContent = section.append('div'); 

        sectionContent.append('treez-text-area')
            .label('Input arguments')           
            .onChange(()=>this.__refreshStatus())           
            .bindValue(this,()=>this.inputArguments); 

		sectionContent.append('treez-file-or-directory-path')
            .label('Input file or directory')            
            .onChange(()=>this.__refreshStatus())           
            .bindValue(this,()=>this.inputPath);            
	}   
  
	__createOutputSection(page) {
       const section = page.append('treez-section')
           .label('Output');

       const sectionContent = section.append('div'); 

       sectionContent.append('treez-text-area')
            .label('Output arguments')           
            .onChange(()=>this.__refreshStatus())          
            .bindValue(this,()=>this.outputArguments); 

       sectionContent.append('treez-file-or-directory-path')
            .label('Output file or directory')            
            .onChange(()=>this.__refreshStatus())           
            .bindValue(this,()=>this.outputPath); 

       sectionContent.append('treez-check-box')
		   .label('Copy input file to output folder')
		   .value(false)
		   .onChange(()=>this.__refreshStatus())		  
		   .bindValue(this,()=>this.isCopyingInputFileToOutputFolder);       
   }  

	

	__createStatusSection(page) {
       const section = page.append('treez-section')
           .label('Status')
           .attr('expanded','false');

       const sectionContent = section.append('div'); 
     
       sectionContent.append('treez-text-area')
            .label('Resulting command') 
            .disable() 
            .bindValue(this,()=>this.commandInfo);  
     
       sectionContent.append('treez-text-area')
            .label('Execution status') 
            .disable()
            .bindValue(this,()=>this.executionStatusInfo);       
     
       sectionContent.append('treez-text-area')
            .label('Next job index') 
            .disable() 
            .bindValue(this,()=>this.jobIdInfo); 
   }   

   

   __refreshStatus() {
		this.commandInfo = this.__buildCommand();
		this.executionStatusInfo = 'Not yet executed';
		this.jobIdInfo = ''+ this.jobId;
	}	

	/**
	 * Copies input file to output folder and modifies the file name
	 */
	__copyInputFileToOutputFolder() {
		const inputFilePath = this.getModifiedInputPath();
		// TODO
		/*
		 * const inputFile = new File(inputFilePath); if (inputFile.exists()) {
		 * String destinationPath = null; try { destinationPath =
		 * getOutputPathToCopyInputFile(); } catch (Exception exception) {
		 * LOG.warn('Input file is not copied to output folder since output
		 * folder is not known.'); } if (destinationPath != null) {
		 * copyInputFileToOutputFolder(inputFile, destinationPath); } }
		 */

	}

	/**
	 * Copies the given inputFile to the given destination path
	 */
	__copyInputFileToOutputFolder(inputFile, destinationPath) {
	    /*
		 * File destinationFile = new File(destinationPath);
		 * 
		 * try { FileUtils.copyFile(inputFile, destinationFile); } catch
		 * (IOException exception) { String message = 'Could not copy input file
		 * to output folder'; LOG.error(message, exception); }
		 */
	}

	/**
	 * Returns the destination folder for the input file
	 */
	__getOutputPathToCopyInputFile() {

		const outputPathString = this.provideFilePath();

		// split path with point to determine file extension if one exists

		const isFilePath = Utils.isFilePath(outputPathString);
		let folderPath = outputPathString;
		if (isFilePath) {
			folderPath = Utils.extractParentFolder(outputPathString);
		}

		const inputPathString = this.getModifiedInputPath();
		const inputPathIsFilePath = Utils.isFilePath(inputPathString);
		if (inputPathIsFilePath) {
			const inputFileName = Utils.extractFileName(inputPathString);
			const newInputFileName = Utils.includeNumberInFileName(inputFileName, '#' + getJobId());
			const destinationPath = folderPath + '/' + newInputFileName;
			return destinationPath;
		} else {
			return null;
		}

	}

	
	async __runInputFileGenerators(refreshable, monitor){
		await this.executeChildren(InputFileGenerator, refreshable, monitor);
	}

	
	__runDataImports(refreshable, monitor){
		const hasDataImportChild = this.hasChildModel(TableImport);
		if (hasDataImportChild) {
			const modelOutput =  this.runChildModel(TableImport, refreshable, monitor);
			return modelOutput;
		} else {
			monitor.info('No data has been imported since there is no DataImport child.');
			return this.__createEmptyModelOutput();
		}
	}

	async __deleteOldOutputAndLogFilesIfExist(){
	    // TODO
	    /*
		 * File outputFile = new File(outputPath.get()); if
		 * (outputFile.exists()) { outputFile.delete(); } File logFile = new
		 * File(logFilePath.get()); if (logFile.exists()) { logFile.delete(); }
		 */
	}


	__buildCommand(){
		let command = '"' + this.executablePath + '"';
		command = this.__addInputArguments(command);
		command = this.__addOutputArguments(command);
		command = this.__addLoggingArguments(command);
		return command;
	}

	__addInputArguments(commandToExtend){
		let command = commandToExtend;
		if (this.inputArguments) {
			const modifiedInputArguments = this.__injectStudyAndJobInfoIfPlaceholdersAreUsed(this.inputArguments);
			command += ' ' + modifiedInputArguments;
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
			:this.inputPath;		
	}

	__getModifiedOutputPath() {
		var outputModification = null;
		try{
			outputModification= this.childByClass(OutputModification);
		} catch(error){			
		}
		
		return outputModification
			?outputModification.getModifiedPath(this)
			:this.outputPath;		
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

	__increaseJobId() {		
		this.jobId = this.jobId+1;
		this.__refreshStatus();
	}

	__resetJobId(){
		this.jobId = 1;
		this.__refreshStatus();
	}
	
	getJobId(){
		return this.jobId;
	}

	

}

Executable.__finishedString = '_treezExecutionFinished_';