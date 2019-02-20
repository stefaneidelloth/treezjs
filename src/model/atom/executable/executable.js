import Model from './../model.js';
import AddChildAtomTreeViewerAction from '../../../core/treeview/addChildAtomTreeViewerAction.js';
import InputFileGenerator from './../inputFileGenerator/inputFileGenerator.js';
import TableImport from './../tableImport/tableImport.js';
import InputModification from './inputModification.js';
import OutputModification from './outputModification.js';

export default class Executable extends Model {

    static get LOG() {
        return new Log4js.getLogger(Executable.constructor.name);
    }

	constructor(name) {
		super(name);
		this.image = 'run.png';
		this.isRunnable=true;
        
		this.executablePath = 'notepad.exe';
        
        this.inputArguments = 'a b c';
        this.inputPath = undefined;
               
        this.outputArguments = undefined;
        this.outputPath = undefined;
        this.copyInputFileToOutputFolder = undefined;        
       
        this.logArguments = undefined;
        this.logFilePath = undefined;
        
        this.commandInfo = undefined;
        this.executionStatusInfo = 'Not yet executed.';
        this.jobIndexInfo = '1';
	}

	copy() {
		// TODO
	}

    createComponentControl(tabFolder, dTreez){    
     
		const page = tabFolder.append('treez-tab')
            .title('Data');

		this.__createExecutableSection(page); 
        this.__createInputSection(page);      
        this.__createOutputSection(page);       
        this.__createLoggingSection(page);
        this.__createStatusSection(page);
	     
	}

	provideFilePath() {
		return this.__getModifiedOutputPath();		
	}

	extendContextMenuActions(actions, parentSelection, treeView) {

		const addInputFileGenerator = new AddChildAtomTreeViewerAction(
				InputFileGenerator,
				"inputFileGenerator",
				"inputFile.png",
				parentSelection,
				this,
				treeView);
		actions.push(addInputFileGenerator);
		
		const addInputModification = new AddChildAtomTreeViewerAction(
				InputModification,
				"inputModification",
				"inputModification.png",
				parentSelection,
				this,
				treeView);
		actions.push(addInputModification);
		
		const addOutputModification = new AddChildAtomTreeViewerAction(
				OutputModification,
				"outputModification",
				"outputModification.png",
				parentSelection,	
				this,
				treeView);
		actions.push(addOutputModification);

		const addDataImport = new AddChildAtomTreeViewerAction(
				TableImport,
				"tableImport",
				"tableImport.png",
				parentSelection,
				this,
				treeView);
		actions.push(addDataImport);

		return actions;
	}

	afterCreateControlAdaptionHook() {
       this.__refreshStatus();
    }	

    	doRunModel(refreshable, executableMonitor) {

		const startMessage = "Running " + this.constructor.name + " '" + this.name + "'.";
		LOG.info(startMessage);

		// initialize progress monitor
		const totalWork = 3;
		executableMonitor.setTotalWork(totalWork);

		this.delteOldOutputAndLogFiles();

		executableMonitor.setDescription("Running InputFileGenerator children if exist.");

		// execute input file generator child(ren) if exist
		try {
			this.executeInputFileGenerator(refreshable);
		} catch (exception) {
			LOG.error("Could not execute input file generator for executable " + this.name, exception);
			executableMonitor.cancel();
			return this.createEmptyModelOutput();
		}

		// update progress monitor
		executableMonitor.worked(1);
		executableMonitor.setDescription('Executing system command.');

		// create command
		const command = this.buildCommand();
		LOG.info("Executing " + command);

		// execute command
		const executor = new ExecutableExecutor(this);

		try {
			const success = executor.executeCommand(command, executableMonitor);
			if (!success) {
				const message = '"Executing system command failed.';
				executableMonitor.setDescription(message);
				LOG.error(message);
				executableMonitor.cancel();
				return createEmptyModelOutput();
			}
		} catch (exception) {
			LOG.error("Could not execute " + this.name, exception);
			executableMonitor.cancel();
			return this.createEmptyModelOutput();
		}

		// update progress monitor
		executableMonitor.worked(1);
		executableMonitor.setDescription("=>Post processing model output.");

		const modelOutput = this.createEmptyModelOutput();

		// execute data import child(ren) if exist
		try {
			const dataImportOutput = this.runDataImport(refreshable, executableMonitor);
			modelOutput.addChildOutput(dataImportOutput);
		} catch (exception) {
			LOG.error("Could not import results of " + this.name, exception);
			executableMonitor.cancel();
			return modelOutput;
		}

		// copy input file to output folder (modifies input file name)
		try {
			if (this.copyInputFileToOutputFolder) {
				this.copyInputFileToOutputFolder();
			}
		} catch (exception) {
			LOG.error("Could not copy input file to output folder for " + this.name, exception);
			executableMonitor.cancel();
			return modelOutput;
		}

		// increase job index
		this.increasejobIndex();

		// inform progress monitor to be done
		executableMonitor.setDescription("finished\n");
		executableMonitor.done();

		return modelOutput;
	}

	createInputFileGenerator(name) {
		const child = new InputFileGenerator(name);
		this.addChild(child);
		return child;
	}

	createInputModification(name) {
		const child = new InputModification(name);
		this.addChild(child);
		return child;
	}

	createOutputModification(name) {
		const child = new OutputModification(name);
		this.addChild(child);
		return child;
	}

	createTableImport(name) {
		const child = new TableImport(name);
		addChild(child);
		return child;
	}

    __createExecutableSection(tab) {

		const section = tab.append('treez-section')
            .title('Executable');

        section.append('treez-section-action')
            .image('resetJobIndex.png')
            .title('Reset the job index to 1')
            .addAction(this.__resetJobIndex);

        section.append('treez-section-action')
            .image('run.png')
            .title('Run external executable')
            .addAction(this.__execute);  

        const sectionContent = section.append('div'); 

        sectionContent.append('treez-file-path')
            .title('Executable')           
            .onChange(()=>this.__refreshStatus())           
            .bindValue(this,()=>this.executablePath);            
	}
	
    __execute(){
		
	}

	__createInputSection(page) {
       
        const section = page.append('treez-section')
            .title('Input'); 

        const sectionContent = section.append('div'); 

        sectionContent.append('treez-text-area')
            .title('Input arguments')           
            .onChange(()=>this.__refreshStatus())           
            .bindValue(this,()=>this.inputArguments); 

		sectionContent.append('treez-file-or-directory-path')
            .title('Input file or folder')            
            .onChange(()=>this.__refreshStatus())           
            .bindValue(this,()=>this.inputPath);            
	}   
  
	__createOutputSection(page) {
       const section = page.append('treez-section')
           .title('Output');

       const sectionContent = section.append('div'); 

       sectionContent.append('treez-text-area')
            .title('Output arguments')           
            .onChange(()=>this.__refreshStatus())          
            .bindValue(this,()=>this.outputArguments); 

       sectionContent.append('treez-file-or-directory-path')
            .title('Output file or folder')            
            .onChange(()=>this.__refreshStatus())           
            .bindValue(this,()=>this.outputPath); 

       sectionContent.append('treez-check-box')
		   .label('Copy input file to output folder')
		   .value(true)
		   .onChange(()=>this.__refreshStatus())		  
		   .bindValue(this,()=>this.copyInputFileToOutputFolder);       
   }  

	__createLoggingSection(page) {
       const section = page.append('treez-section')
           .title('Logging')
           .attr('expanded','false');

       const sectionContent = section.append('div'); 

       sectionContent.append('treez-text-area')
            .title('Log arguments')           
            .onChange(()=>this.__refreshStatus())          
            .bindValue(this,()=>this.logArguments); 

       sectionContent.append('treez-file-path')
            .title('Log file')            
            .onChange(()=>this.__refreshStatus())          
            .bindValue(this,()=>this.logFilePath);
      
   }

	__createStatusSection(page) {
       const section = page.append('treez-section')
           .title('Status')
           .attr('expanded','false');

       const sectionContent = section.append('div'); 
     
       sectionContent.append('treez-text-area')
            .title('Resulting command') 
            .disable() 
            .bindValue(this,()=>this.commandInfo);  
     
       sectionContent.append('treez-text-area')
            .title('Execution status') 
            .disable()
            .bindValue(this,()=>this.executionStatusInfo);       
     
       sectionContent.append('treez-text-area')
            .title('Next job index') 
            .disable() 
            .bindValue(this,()=>this.jobIndexInfo); 
   }   

   

   __refreshStatus() {
		this.commandInfo = this.__buildCommand();
		this.executionStatusInfo = 'Not yet executed';
		this.jobIndexInfo = this.jobId;
	}



	__increaseJobIndex() {
		let currentIndex = 0;
		try {
			currentIndex = Integer.parse(this.jobId);
		} catch (exception) {
			LOG.warn("Could not interpret last jobId as Integer. "
					+ "Starting with 1 for the next job index of the executable.");
		}
		const newIndex = currentIndex + 1;
		this.jobId = "" + newIndex;
		this.refreshStatus();
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
		 * LOG.warn("Input file is not copied to output folder since output
		 * folder is not known."); } if (destinationPath != null) {
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
		 * (IOException exception) { String message = "Could not copy input file
		 * to output folder"; LOG.error(message, exception); }
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
			const newInputFileName = Utils.includeNumberInFileName(inputFileName, "#" + getJobId());
			const destinationPath = folderPath + "/" + newInputFileName;
			return destinationPath;
		} else {
			return null;
		}

	}

	
	__runInputFileGenerators(refreshable){
		this.executeChildren(InputFileGenerator.class, refreshable);
	}

	
	__runDataImports(refreshable, monitor){
		const hasDataImportChild = this.hasChildModel(TableImport.class);
		if (hasDataImportChild) {
			const modelOutput =  this.runChildModel(TableImport.class, refreshable, monitor);
			return modelOutput;
		} else {
			LOG.info("No data has been imported since there is no DataImport child.");
			return this.createEmptyModelOutput();
		}
	}

	__deleteOldOutputAndLogFilesIfExist(){
	    // TODO
	    /*
		 * File outputFile = new File(outputPath.get()); if
		 * (outputFile.exists()) { outputFile.delete(); } File logFile = new
		 * File(logFilePath.get()); if (logFile.exists()) { logFile.delete(); }
		 */
	}


	__buildCommand(){
		let command = "\"" + this.executablePath + "\"";
		command = this.__addInputArguments(command);
		command = this.__addOutputArguments(command);
		command = this.__addLoggingArguments(command);
		return command;
	}

	__addInputArguments(commandToExtend){
		let command = commandToExtend;
		if (this.inputArguments) {
			const modifiedInputArguments = this.__injectStudyAndJobInfoIfPlaceholdersAreUsed(this.inputArguments);
			command += " " + modifiedInputArguments;
		}

		if (this.inputPath) {
			command += " " + this.__getModifiedInputPath();
		}
		return command;
	}	
	
	/**
	 * If the passed input contains place holders, those place holders are
	 * replaced by the actual studyId, studyDescription and jobId.
	 * Otherwise the input is not modified. 
	 */
	__injectStudyAndJobInfoIfPlaceholdersAreUsed(input){
		const studyIdKey = "{$studyId$}";
        const studyDescriptionKey = "{$studyDescription$}";
        const jobIdKey = "{$jobId$}";

        let currentInputArguments = input;

		if (currentInputArguments.includes(studyIdKey)) {

			if (this.studyId == null) {
				currentInputArguments = currentInputArguments.replace(studyIdKey, "");
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
		
		const inputModification = null;
		try{
			inputModification = this.getChildByClass(InputModification);
		} catch(error){			
		}		
		
		return inputModification
			?inputModification.getModifiedPath(this)
			:this.inputPath;		
	}

	__getModifiedInputPath() {
		const outputModification = null;
		try{
			outputModification= this.getFirstChildByClass(OutputModification);
		} catch(error){			
		}
		
		return outputModification
			?outputModification.getModifiedPath(this)
			:this.inputPath;		
	}

	__addOutputArguments(commandToExtend){
		let command = commandToExtend;

		if (this.outputArguments) {
			command += " " + this.outputArguments;
		}

		if (this.outputPath) {
			command += " " + this.__getModifiedOutputPath();
		}
		return command;
	}

	__addLoggingArguments(commandToExtend){
		let command = commandToExtend;
		if (this.logArguments) {
			command += " " + logArguments;
		}

		if (this.logFilePath) {
			command += " " + logFilePath;
		}
		return command;
	}

	

	__resetJobIndex(){
		this.jobId = "1";
		this.__refreshStatus();
	}
	
	

	

}
