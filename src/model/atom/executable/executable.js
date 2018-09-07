import Model from './../model.js';
import AddChildAtomTreeViewerAction from '../../../core/treeview/addChildAtomTreeViewerAction.js';
import InputFileGenerator from './../inputFileGenerator/inputFileGenerator.js';
import TableImport from './../tableImport/tableImport.js';

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
        this.copyInputFile = undefined;
        this.isIncludingDateInInputFile = undefined;
        this.isIncludingDateInInputFolder = undefined;
        this.isIncludingDateInInputSubFolder = undefined;
        this.isIncludingJobIndexInInputFile = undefined;
        this.isIncludingJobIndexInInputFolder = undefined;
        this.isIncludingJobIndexInInputSubFolder = undefined;
        this.outputArguments = undefined;
        this.outputPath = undefined;
        this.isIncludingDateInOutputFile = undefined;
        this.isIncludingDateInOutputFolder = undefined;
        this.isIncludingDateInOutputSubFolder = undefined;
        this.isIncludingJobIndexInOutputFile = undefined;
        this.isIncludingJobIndexInOutputFolder = undefined;
        this.isIncludingJobIndexInOutputSubFolder = undefined;
        this.logArguments = undefined;
        this.logFilePath = undefined;
        this.commandInfo = undefined;
        this.executionStatusInfo = undefined;
        this.jobIndexInfo = undefined;
	}

	copy() {
		//TODO
	}

	

    createComponentControl(tabFolder, d3){    
     
		const page = tabFolder.append('treez-tab')
            .attr('title','Data');

		this.createExecutableSection(page);  
       
        this.createInputSection(page);
        
        this.createInputModificationSection(page);
/*
        this.createOutputSection(page);
        this.createOutputModificationSection(page);
        this.createLoggingSection(page);
        this.createStatusSection(page);
	    */	   
	}

	createExecutableSection(tab) {

		const section = tab.append('treez-section')
            .attr('title','Executable');

        section.append('treez-section-action')
            .attr('image','resetJobIndex.png')
            .attr('title','Reset the job index to 1')
            .node().addAction(this.resetJobIndex);

        section.append('treez-section-action')
            .attr('image','run.png')
            .attr('title','Run external executable')
            .node().addAction(this.execute);  

        const sectionContent = section.append('div'); 

        sectionContent.append('treez-file-path')
            .attr('title','Executable')           
            .on('change',this.refreshStatus)
            .node()
            .bindValue(this,()=>this.executablePath);            
	}

	createInputSection(page) {
       
        const section = page.append('treez-section')
            .attr('title','Input'); 

        const sectionContent = section.append('div'); 

        sectionContent.append('treez-text-area')
            .attr('title','Input arguments')           
            .on('change',this.refreshStatus)
            .node()
            .bindValue(this,()=>this.inputArguments); 

		sectionContent.append('treez-file-or-directory-path')
            .attr('title','Input file or folder')            
            .on('change',this.refreshStatus)
            .node()
            .bindValue(this,()=>this.inputPath);            
	}

    

   createInputModificationSection(page) {

       const section = page.append('treez-section')
           .attr('title','Input modification')
           .attr('expanded','false');

       const sectionContent = section.append('div'); 

       sectionContent.append('treez-label')
       	   .attr('value','Include date in:')

       sectionContent.append('treez-checkbox')
		   .attr('label','Folder name')
		   .attr('value',false)
		   .on('change', this.refreshStatus)
		   .node()
		   .bindValue(this,()=>this.isIncludingDateInInputFolder);

	    sectionContent.append('treez-checkbox')
		   .attr('label','Extra folder')
		   .attr('value',false)		   
		   .on('change', this.refreshStatus)
		   .node()
		   .bindValue(this,()=>this.isIncludingDateInInputSubFolder);

	   	sectionContent.append('treez-checkbox')
		   .attr('label','File name')
		   .attr('value',false)
		    .on('change', this.refreshStatus)
		   .node()
		   .bindValue(this,()=>this.isIncludingDateInInputFile);


      	sectionContent.append('treez-label')
       	   .attr('value','Include job index in:') 
       	   
		sectionContent.append('treez-checkbox')
		   .attr('label','Folder name')
		   .attr('value',false)
		   .on('change', this.refreshStatus)
		   .node()
		   .bindValue(this,()=>this.isIncludingJobIndexInInputFolder);

	    sectionContent.append('treez-checkbox')
		   .attr('label','Extra folder')
		   .attr('value',false)
		   .on('change', this.refreshStatus)
		   .node()
		   .bindValue(this,()=>this.isIncludingJobIndexInInputSubFolder);

	   sectionContent.append('treez-checkbox')
		   .attr('label','File name')
		   .attr('value',false)
		   .on('change', this.refreshStatus)
		   .node()
		   .bindValue(this,()=>this.isIncludingJobIndexInInputFile);  
   }

/*
   createOutputSection(page) {
       const section = page.append('section')
           .attr('title','Output');

       TextField outputArgs = output.createTextField(outputArguments, this, "");
       outputArgs.setLabel("Output arguments");
       outputArgs.addModificationConsumer("updateStatus", updateStatusListener);

       FileOrDirectoryPath outputPathChooser = output.createFileOrDirectoryPath(outputPath, this,
               "Output file or folder", "", false);
       outputPathChooser.addModificationConsumer("updateStatus", updateStatusListener);

       CheckBox copyInputField = output.createCheckBox(copyInputFile, this, true);
       copyInputField.setLabel("Copy input file");
   }

   createOutputModificationSection(page) {
       const section = page.append('section')
           .attr('title','Output modification')
           .attr('expanded','false');

       outputModification.createLabel("includeDate", "Include date in:");

       CheckBox dateInFolderCheck = outputModification.createCheckBox(isIncludingDateInOutputFolder, this, false);
       dateInFolderCheck.setLabel("Folder name");
       dateInFolderCheck.addModificationConsumer("updateStatus", updateStatusListener);

       CheckBox dateInSubFolderCheck = outputModification.createCheckBox(isIncludingDateInOutputSubFolder, this, false);
       dateInSubFolderCheck.setLabel("Extra folder");
       dateInSubFolderCheck.addModificationConsumer("updateStatus", updateStatusListener);

       CheckBox dateInFileCheck = outputModification.createCheckBox(isIncludingDateInOutputFile, this, false);
       dateInFileCheck.setLabel("File name");
       dateInFileCheck.addModificationConsumer("updateStatus", updateStatusListener);

       @SuppressWarnings("unused")
       org.treez.core.atom.attribute.text.Label jobIndexLabel = outputModification.createLabel("jobIndexLabel",
               "Include job index in:");

       CheckBox jobIndexInFolderCheck = outputModification.createCheckBox(isIncludingJobIndexInOutputFolder, this, false);
       jobIndexInFolderCheck.setLabel("Folder name");
       jobIndexInFolderCheck.addModificationConsumer("updateStatus", updateStatusListener);

       CheckBox jobIndexInSubFolderCheck = outputModification.createCheckBox(isIncludingJobIndexInOutputSubFolder, this,
               false);
       jobIndexInSubFolderCheck.setLabel("Extra folder");
       jobIndexInSubFolderCheck.addModificationConsumer("updateStatus", updateStatusListener);

       CheckBox jobIndexInFileCheck = outputModification.createCheckBox(isIncludingJobIndexInOutputFile, this, false);
       jobIndexInFileCheck.setLabel("File name");
       jobIndexInFileCheck.addModificationConsumer("updateStatus", updateStatusListener);
   }

   createLoggingSection(page) {
       const section = page.append('section')
           .attr('title','Logging')
           .attr('expanded','false');

       TextField logArgumentsText = logging.createTextField(logArguments, this, "");
       logArgumentsText.setLabel("Log arguments");
       logArgumentsText.addModificationConsumer("updateStatus", updateStatusListener);

       FilePath logFilePathChooser = logging.createFilePath(logFilePath, this, "Log file", "", false);
       logFilePathChooser.addModificationConsumer("updateStatus", updateStatusListener);
   }

   createStatusSection(page) {
       const section = page.append('section')
           .attr('title','Status')
           .attr('expanded','false');

       //resulting command
       status.createInfoText(commandInfo, this, "Resulting command", "");

       //execution status
       status.createInfoText(executionStatusInfo, this, "Execution status", "Not yet executed.");

       //job index
       status.createInfoText(jobIndexInfo, this, "Next job index", "1");
   }

   */

   afterCreateControlAdaptionHook() {
       this.refreshStatus();
   }

   /**
    * Updates the status text labels with data from other attribute atoms
    */
	refreshStatus() {

			//this.commandInfo = this.buildCommand();
			this.executionStatusInfo = 'Not yet executed';
			this.jobIndexInfo = this.jobId;

       //const infoText = d3.select('#executionStatusInfo');
       //infoText.resetError();


	}

	doRunModel(refreshable, executableMonitor) {

		const startMessage = "Running " + this.constructor.name + " '" + this.name + "'.";
		LOG.info(startMessage);

		//initialize progress monitor
		const totalWork = 3;
		executableMonitor.setTotalWork(totalWork);

		this.delteOldOutputAndLogFiles();

		executableMonitor.setDescription("Running InputFileGenerator children if exist.");

		//execute input file generator child(ren) if exist
		try {
			this.executeInputFileGenerator(refreshable);
		} catch (exception) {
			LOG.error("Could not execute input file generator for executable " + this.name, exception);
			executableMonitor.cancel();
			return this.createEmptyModelOutput();
		}

		//update progress monitor
		executableMonitor.worked(1);
		executableMonitor.setDescription('Executing system command.');

		//create command
		const command = this.buildCommand();
		LOG.info("Executing " + command);

		//execute command
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

		//update progress monitor
		executableMonitor.worked(1);
		executableMonitor.setDescription("=>Post processing model output.");

		const modelOutput = this.createEmptyModelOutput();

		//execute data import child(ren) if exist
		try {
			const dataImportOutput = this.runDataImport(refreshable, executableMonitor);
			modelOutput.addChildOutput(dataImportOutput);
		} catch (exception) {
			LOG.error("Could not import results of " + this.name, exception);
			executableMonitor.cancel();
			return modelOutput;
		}

		//copy input file to output folder (modifies input file name)
		try {
			if (this.copyInputFile) {
				this.copyInputFileToOutputFolder();
			}
		} catch (exception) {
			LOG.error("Could not copy input file for " + this.name, exception);
			executableMonitor.cancel();
			return modelOutput;
		}

		//increase job index
		this.increasejobIndex();

		//inform progress monitor to be done
		executableMonitor.setDescription("finished\n");
		executableMonitor.done();

		return modelOutput;
	}

	increaseJobIndex() {
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
	 * Resets the error state of the status info text
	 */
	resetError() {
		if (this.executionStatusInfo != null) {
		    const infoText = d3.select('#executionStatusInfo');
		    //infoText.resetError();
		}

	}

	/**
	 * Shows the info text in error state
	 */
	highlightError() {
		if (this.executionStatusInfo != null) {
            const infoText = d3.select('#executionStatusInfo');
			//infoText.highlightError();
		}
	}

	/**
	 * Copies input file to output folder and modifies the file name
	 */
	copyInputFileToOutputFolder() {
		const inputFilePath = this.getModifiedInputPath();
		//TODO
		/*
		const inputFile = new File(inputFilePath);
		if (inputFile.exists()) {
			String destinationPath = null;
			try {
				destinationPath = getOutputPathToCopyInputFile();
			} catch (Exception exception) {
				LOG.warn("Input file is not copied to output folder since output folder is not known.");
			}
			if (destinationPath != null) {
				copyInputFileToOutputFolder(inputFile, destinationPath);
			}
		}
		*/

	}

	/**
	 * Copies the given inputFile to the given destination path
	 */
	copyInputFileToOutputFolder(inputFile, destinationPath) {
	    /*
		File destinationFile = new File(destinationPath);

		try {
			FileUtils.copyFile(inputFile, destinationFile);
		} catch (IOException exception) {
			String message = "Could not copy input file to output folder";
			LOG.error(message, exception);

		}
		*/
	}

	/**
	 * Returns the destination folder for the input file
	 */
	getOutputPathToCopyInputFile() {

		const outputPathString = this.provideFilePath();

		//split path with point to determine file extension if one exists

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

	/**
	 * Executes all children that are of type InputFileGenerator
	 */
	executeInputFileGenerator(refreshable){
		this.executeChildren(InputFileGenerator.class, refreshable);
	}

	/**
	 * Executes all children that are of type DataImport
	 */
	runDataImport(refreshable, monitor){
		const hasDataImportChild = this.hasChildModel(TableImport.class);
		if (hasDataImportChild) {
			const modelOutput =  this.runChildModel(TableImport.class, refreshable, monitor);
			return modelOutput;
		} else {
			LOG.info("No data has been imported since there is no DataImport child.");
			return this.createEmptyModelOutput();
		}
	}

	/**
	 * Deletes the old output and log files if some exist
	 */
	deleteOldOutputAndLogFiles(){
	    //TODO
	    /*
		File outputFile = new File(outputPath.get());
		if (outputFile.exists()) {
			outputFile.delete();
		}
		File logFile = new File(logFilePath.get());
		if (logFile.exists()) {
			logFile.delete();
		}
		*/
	}

	/**
	 * Builds the execution command from the individual paths and arguments
	 */
	buildCommand(){
		let command = "\"" + this.executablePath + "\"";
		command = this.addInputArguments(command);
		command = this.addOutputArguments(command);
		command = this.addLoggingArguments(command);
		return command;
	}

	addInputArguments(commandToExtend){
		let command = commandToExtend;
		if (this.inputArguments) {
			const modifiedInputArguments = this.injectStudyAndJobInfo(this.inputArguments);
			command += " " + modifiedInputArguments;
		}

		if (this.inputPath) {
			command += " " + this.getModifiedInputPath();
		}
		return command;
	}

	addOutputArguments(commandToExtend){
		let command = commandToExtend;

		if (this.outputArguments) {
			command += " " + outputArguments;
		}

		if (this.outputPath) {
			command += " " + provideFilePath();
		}
		return command;
	}

	addLoggingArguments(commandToExtend){
		let command = commandToExtend;
		if (this.logArguments) {
			command += " " + logArguments;
		}

		if (this.logFilePath) {
			command += " " + logFilePath;
		}
		return command;
	}

	/**
	 * If the input arguments contain place holders, those place holders are replaced by the actual studyId,
	 * studyDescription and jobId.
	 */
	injectStudyAndJobInfo(input){
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

	resetJobIndex(){
		this.jobId = "1";
		//this.refreshStatus();
	}

	extendContextMenuActions(actions, treeViewer) {

		const addInputFileGenerator = new AddChildAtomTreeViewerAction(
				InputFileGenerator.class,
				"inputFileGenerator",
				"inputFile.png",
				this,
				treeViewer);
		actions.push(addInputFileGenerator);

		const addDataImport = new AddChildAtomTreeViewerAction(
				TableImport.class,
				"tableImport",
				"tableImport.png",
				this,
				treeViewer);
		actions.push(addDataImport);

		return actions;
	}

	getModifiedInputPath() {
		const inputPathModifier = new InputPathModifier(this);
		return inputPathModifier.getModifiedInputPath(inputPath);
	}

	createInputFileGenerator(name) {
		const child = new InputFileGenerator(name);
		addChild(child);
		return child;
	}

	createTableImport(name) {
		const child = new TableImport(name);
		addChild(child);
		return child;
	}

	provideFilePath() {
		const outputPathModifier = new OutputPathModifier(this);
		return outputPathModifier.getModifiedOutputPath(outputPath);
	}

}
