import ComponentAtom from './../core/component/componentAtom.js';
import Model from './../model/model.js';
import ModelInput from './../model/input/modelInput.js';
import Monitor from './../core/monitor/monitor.js';
import AddChildAtomTreeViewAction from './../core/treeview/addChildAtomTreeViewAction.js';
import PythonExport from './pythonExport/pythonExport.js';
import Variable from './../variable/variable.js';
import StudyInfoExport from './studyInfoExport/studyInfoExport.js';

export default class Study extends ComponentAtom {
			
	constructor(name){
		super(name);
		this.isRunnable=true;
		
		this.id = '';
		this.description = '';
		
		this.controlledModelPath = undefined;
		this.sourceModelPath = undefined;
		
		this.isConcurrent = false;
		
		this.__inputGenerator = undefined;
		
		this.__page = undefined;
		this.__sectionContent = undefined;
		this.__sourceModelPathSelection = undefined;

		this.__numberOfRemainingModelJobs = undefined;
		this.__isCanceled = false;
	}
	
	createComponentControl(tabFolder){   
	     
		this.__page = tabFolder.append('treez-tab')
            .label('Data');		

		const section = this.__page.append('treez-section')
        	.label(this.constructor.name); 

       	this.createHelpAction(section, 'study/' + this.atomType + '/' + this.atomType + '.md');
		
		section.append('treez-section-action')
		 	.label('Run')
	        .image('run.png')	       
	        .addAction(()=>this.execute(this.__treeView));		
		

		this.__sectionContent = section.append('div'); 	     

		this.__sectionContent.append('treez-text-field')
        	.label('Id')
        	.bindValue(this, ()=>this.id);
        
		this.__sectionContent.append('treez-text-field')
	    	.label('Description')
	    	.bindValue(this, ()=>this.description);
	   
		this.__sectionContent.append('treez-model-path')
        	.label('Model to run')
        	.nodeAttr('atomClasses', [Model])
        	.bindValue(this, ()=>this.controlledModelPath);
		
		this.__sourceModelPathSelection = this.__sectionContent.append('treez-model-path')
	    	.label('Variable source model (provides variables)')
	    	.nodeAttr('atomClasses', [Model])	    	
	    	.bindValue(this, ()=>this.sourceModelPath);
		

		this.__sectionContent.append('treez-check-box')
			.label('Concurrent execution')
			.bindValue(this, ()=>this.isConcurrent);
	    
    }
	
	appendContextMenuActions(actions, parentSelection, treeView) {

		if(window.treezConfig.isSupportingPython){
				
			actions.push(new AddChildAtomTreeViewAction(
					PythonExport,
					"pythonExport",
					"pythonExport.png",
					parentSelection,
					this,
					treeView));
		}

		actions.push(new AddChildAtomTreeViewAction(
				StudyInfoExport,
				"studyInfoExport",
				"studyInfoExport.png",
				parentSelection,
				this,
				treeView));
	
		return actions;
	}
	
	async execute(treeView, monitor) {
		
		var studyName = this.name;
		if(!monitor){
			var monitorTitle = this.constructor.name + ' "' + studyName + '"';
			monitor = new Monitor(monitorTitle, treeView);
			monitor.showInMonitorView();
			monitor.clear();
		}
		await this.__doExecute(treeView, monitor)
			  .catch((exception)=> {
					monitor.error('Could not execute study "' + studyName + '"!', exception);
					monitor.cancel();
			  });
	}	
	
	async __doExecute(treeView, monitor){
		this.treeView = treeView;
		this.__isCanceled = false;
		
		var className = this.constructor.name;

		var startMessage = 'Executing ' + className + ' "' + this.name + '"';
		monitor.info(startMessage);		
	
		var studyTitle = "Running " + className;
		monitor.title = studyTitle;

		var numberOfSimulations = this.inputGenerator.numberOfSimulations;
		monitor.totalWork = numberOfSimulations;
				
		monitor.info("Total number of simulations: " + numberOfSimulations);

		//reset job index to 1
		ModelInput.resetIdCounter();

		//create model inputs
		var modelInputs = this.inputGenerator.modelInputs;

		//prepare result structure
		this.prepareResultStructure(monitor);
		treeView.refresh();

		//get study output atom		
		var studyOutputAtom = this.childFromRoot(this.studyOutputAtomPath);

		//remove all old children if they exist
		studyOutputAtom.removeAllChildren();

		//execute target model for all model inputs
		this.__numberOfRemainingModelJobs = numberOfSimulations;

		if (!monitor.isCanceled) {
			var jobFinishedHook = () => this.__finishOrCancelIfDone(treeView, monitor);

			if (this.isConcurrent) {
				await this.__executeTargetModelConcurrently(treView, numberOfSimulations, modelInputs, studyOutputAtom, monitor, jobFinishedHook);
			} else {
				await this.__executeTargetModelOneAfterAnother(treeView, numberOfSimulations, modelInputs, studyOutputAtom, monitor, jobFinishedHook);
			}
		}		
	}
	
	
	__finishOrCancelIfDone(treeView, monitor) {

		if (this.__isCanceled) {
				return;
		}

		if(monitor.isChildCanceled){
			monitor.cancel();			
		}		

		if (monitor.isCanceled) {			
			
			this.__isCanceled = true;
			monitor.markIssue();
			monitor.description = 'Canceled!';
			this.__logAndShowCancelMessage(monitor);
			treeView.refresh();			
		}

		var numberOfRemainingJobs = this.__numberOfRemainingModelJobs-1;
		this.__numberOfRemainingModelJobs = numberOfRemainingJobs;

		if (numberOfRemainingJobs === 0) {			

			monitor.description = 'Finished!';

			if (monitor.isChildCanceled) {
				monitor.cancel();
			} else {
				monitor.done();
			}

			treeView.refresh();

			this.__logEndMessage(monitor);
		}
	}

	__executeTargetModelConcurrently(treeView, numberOfSimulations, modelInputs, outputAtom, monitor, jobFinishedHook) {

		var self = this;	
		
		var currentDateString = new Date().toLocaleString();	
		var message = '-- ' + currentDateString + ' --- Starting ' + numberOfSimulations + ' simulations ----------';
		monitor.info(message);

		var jobQueue = [];

		var jobFinishedDelegate = () => {
			jobFinishedHook();
			self.numberOfActiveThreads--;
			self.__continueToProcessQueue(jobQueue);
		};
		
		var model = this.controlledModel;
		
		modelInputs.forEach((modelInput)=>{
			self.__createAndEnqueueModelJob(jobQueue, treeView, outputAtom, model, modelInput, monitor, jobFinishedDelegate);
		});	
	
		self.__continueToProcessQueue(jobQueue);

	}

	__continueToProcessQueue(jobQueue) {

		var numberOfProcessors = navigator.hardwareConcurrency;

		//Reserve some processors on the server for other tasks.
		//Also set a minimum priority.
		//Otherwise it would be possible to freeze the server
		//and the UI of Eclipse might not react any more.

		if (numberOfProcessors > 6) {
			numberOfProcessors = numberOfProcessors / 2;
		} else {
			if (numberOfProcessors > 1) {
				numberOfProcessors -= 1;
			}
		}

		var numberOfFreeThreads = numberOfProcessors - numberOfActiveThreads;

		for (var index = 0; index < numberOfFreeThreads; index++) {
			var modelJob = jobQueue.shift();
			if (modelJob == null) {
				return;
			}

			var worker = new Worker('job.js');
			
			//TODO define worker correctly
			
			worker.start();			
		}		

	}

	__createAndEnqueueModelJob(queue, treeView, outputAtom, model, modelInput, monitor, jobFinishedDelegate) {

		var jobId = modelInput.getJobId();
		var jobTitle = "Sweep Job '" + jobId + "'";

		var pathForModelToRun = model.treePath;
		var root = outputAtom.root;

		//create snapshot of root as blueprint for shadow roots
		//(The actual root tree will be modified during execution and it would be a bad idea
		//to use the changing root as blueprint.)

		var rootSnapshot = root.copy();

		var modelJob = async () => {

			if (monitor.isCanceled) {
				jobFinishedDelegate();
				return;
			}

			try {

				//create shadow tree and retrieve shadow model
				var shadowRoot = rootSnapshot.copy();

				//run shadow model
				var shadowModelToRun = shadowRoot.childFromRoot(pathForModelToRun);

				var jobMonitor = monitor.createChild(jobTitle, jobId, 1);
				
				try {

					if (monitor.isCanceled) {
						jobFinishedHook.run();
						return;
					}

					var modelOutputAtom = await shadowModelToRun.runModel(modelInput, treeView, jobMonitor);

					if (monitor.isCanceled) {
						jobFinishedDelegate();
						return;
					}

					
					var modelOutputName = self.name + "OutputId" + modelInput.getJobId();
					modelOutputAtom.name = modelOutputName;
					
					outputAtom.addChild(modelOutputAtom);

				} finally {
					jobMonitor.done();
				}

			} catch (exception) {
				monitor.error("Could not run " + jobTitle, exception);
				monitor.cancel();
			}

			jobFinishedDelegate();
		};

		queue.add(modelJob);

	}

	async __executeTargetModelOneAfterAnother(treeView, numberOfSimulations, modelInputs, outputAtom, monitor, jobFinishedHook) {
				
		var model = this.controlledModel;
		var startTime = new Date().valueOf();		
		
		var pythonExport = this.childByClass(PythonExport);
		
		if(pythonExport){
			pythonExport.deleteStructureFromPythonContextIfExists();
		}		
		
		var jobCounter = 1;

		if(modelInputs.length < 1){
			monitor.warn('The number of generated model inputs is 0.')
			jobfinishedHook();
		}
		
		for(const modelInput of modelInputs){
			
			if(monitor.isCanceled){
				jobFinishedHook();
				return;
			}
			
			this.__logStartMessage(jobCounter, startTime, numberOfSimulations, monitor);

			var jobId = modelInput.jobId;
			var jobTitle = 'Job #' + jobId ;
			var jobMonitor = monitor.createChild(jobTitle, treeView, jobId, 1);
			
			monitor.description = '=>' + jobTitle;

			var modelOutput = await model.runModel(modelInput, treeView, jobMonitor);
			if(modelOutput){
				var modelOutputName = 'output_' + modelInput.jobId;
				modelOutput.name = modelOutputName;
				outputAtom.addChild(modelOutput);
				
				if(pythonExport){
					pythonExport.exportTablesToPythonContext(modelInput, modelOutput);
				}
			}			

			jobFinishedHook();	
			treeView.refresh();				
			jobCounter++;			
		};
	}
	
	prepareResultStructure(monitor) {
		this.__createResultsAtomIfNotExists(monitor);
		this.__createDataAtomIfNotExists(monitor);
		this.__createOutputAtomIfNotExists(monitor);		
	}

	__createOutputAtomIfNotExists(monitor) {		
		
		var studyOutputAtomExists = this.rootHasChild(this.studyOutputAtomPath);
		if (!studyOutputAtomExists) {
			var studyOutput = this.createStudyOutputAtom(this.studyOutputAtomName);
			var data = this.childFromRoot(this.dataOutputAtomPath);
			data.addChild(studyOutput);			
			monitor.info('Created ' + this.studyOutputAtomPath + ' for study output.');
		}

	}	
	
	createStudyOutputAtom(name){
		throw new Exception('Must be implemented by inheriting class');
	}

	__createResultsAtomIfNotExists(monitor) {
		var resultAtomPath = "root.results";
		var resultAtomExists = this.rootHasChild(resultAtomPath);
		if (!resultAtomExists) {
			this.root.createResults();			
			monitor.info('Created ' + resultAtomPath + ' for study output.');
		}
	}

	__createDataAtomIfNotExists(monitor) {
		var resultAtomPath = 'root.results';
		var dataAtomName = 'data';
		var dataAtomPath = this.dataOutputAtomPath;
		var dataAtomExists = this.rootHasChild(dataAtomPath);
		if (!dataAtomExists) {			
			var results = this.childFromRoot(resultAtomPath);
			results.createData();
			monitor.info('Created ' + dataAtomPath + ' for study output.');
		}
	}
	
	get studyOutputAtomPath() {
		return this.dataOutputAtomPath + '.' + this.studyOutputAtomName;	
	}

	get dataOutputAtomPath() {
		return 'root.results.data';		
	}

	get studyOutputAtomName() {
		return this.name + 'Output';		
	}	

	__logStartMessage(counter, startTime, numberOfSimulations, monitor) {

		//get current time
		var date =new Date();		
		var currentDateString = date.toLocaleString();
		var currentTime = date.valueOf();

		//estimate end time
		var endTimeString = this.__estimateEndTime(startTime, currentTime, counter, numberOfSimulations);

		//log start message
		var message = "-- " + currentDateString + " --- Simulation " + counter + " of " + numberOfSimulations
				+ " -------- " + endTimeString + " --";
		monitor.info(message);

	}

	__logEndMessage(monitor) {		
		var date =new Date();		
		var currentDateString = date.toLocaleString();	
			
		var message = "-- " + currentDateString + " -------- Finished! --------------------------------";
		monitor.info(message);		
	}

	__logAndShowCancelMessage(monitor) {		
		var date =new Date();		
		var currentDateString = date.toLocaleString();
				
		var message = "-- " + currentDateString + " -------- Canceled! --------------------------------";
		monitor.info(message);
		alert("Canceled!");
	}

	
	__estimateEndTime(startTime, currentTime, counter, numberOfSimulations) {
		var timeDifference = currentTime - startTime;
		var numberOfFinishedSimulations = (counter - 1);
		var estimatedTimePerSimulation = null;
		if (numberOfFinishedSimulations != 0) {
			estimatedTimePerSimulation = timeDifference / numberOfFinishedSimulations;
		}
		var numberOfRemainingSimulations = numberOfSimulations - numberOfFinishedSimulations;
		var estimatedRemainingTime = estimatedTimePerSimulation * numberOfRemainingSimulations;
		var estimatedEndTime = currentTime + estimatedRemainingTime;
		var endTimeString = this.__millisToDateString(estimatedEndTime);
		return endTimeString;
	}

	
	__millisToDateString(timeInMilliseconds) {
		if (!timeInMilliseconds) {
			return '  not yet estimated';
		} else {
			
			var date = new Date(timeInMilliseconds);
			return date.toLocaleString();
		}
	}

	createPythonExport(name){
		this.createChild(PythonExport, name);
	}

	get inputGenerator(){
		return this.__inputGenerator;
	}
	
	set inputGenerator(inputGenerator){
		this.__inputGenerator = inputGenerator;
	}	

	get controlledModel() {		
		try {
			return this.childFromRoot(this.controlledModelPath);
			
		} catch (error) {
			var message = 'The model path "' + this.controlledModelPath + '" does not point to a valid model.';
			throw new Error(message, error);
		}
	}

	get sourceModel() {
		if(!this.sourceModelPath){
			return null;
		}
		try{
			return this.childFromRoot(this.sourceModelPath);			
		} catch (error) {
			var message = 'The model path "' + sourcePath + '" does not point to a valid model.';
			throw new Error(message, error);
		}
	}

	get availableVariables(){
		if(!this.parent){
			return [];
		}
		
		var sourceModel = this.sourceModel;
		if(!sourceModel){
			return [];
		}		
		
		var variables = [];				
		for (var child of sourceModel.children) {				
			if (child instanceof Variable) {
				if(child.isEnabled){
					variables.push(child);
				}						
			}
		}
		return variables;	
	}

	get availableVariableNames(){
		return this.availableVariables.map(variable => variable.name);		
	}


}
