import ComponentAtom from './../core/component/componentAtom.js';
import Model from './../model/model.js';
import ModelInput from './../model/input/modelInput.js';
import Monitor from './../core/monitor/Monitor.js';
import StudyOutput from './studyOutput.js';

export default class Study extends ComponentAtom {
			
	constructor(name){
		super(name);
		
		this.id = '';
		this.description = '';
		
		this.controlledModelPath = undefined;
		this.sourceModelPath = undefined;
		
		this.isConcurrent = false;
		
		this.inputGenerator = undefined;
		
		this.page = undefined;
		this.sectionContent = undefined;

		this.numberOfRemainingModelJobs = undefined;
	}
	
	createComponentControl(tabFolder){   
	     
		this.page = tabFolder.append('treez-tab')
            .label('Data');		

		const section = this.page.append('treez-section')
        	.label(this.constructor.name); 
		
		section.append('treez-section-action')
		 	.label('Run')
	        .image('run.png')	       
	        .addAction(()=>this.execute(this.__treeView)
	        				   .catch(error => {
	        					   	console.error('Could not execute  ' + this.constructor.name + ' "' + this.name + '"!', error);
	        					   	monitor.done();
	        				   })
	        );		
		

		this.sectionContent = section.append('div'); 	     

		this.sectionContent.append('treez-text-field')
        	.label('Id')
        	.bindValue(this, ()=>this.id);
        
		this.sectionContent.append('treez-text-field')
	    	.label('Description')
	    	.bindValue(this, ()=>this.description);
	   
		this.sectionContent.append('treez-model-path')
        	.label('Model to run')
        	.nodeAttr('atomClasses', [Model])
        	.bindValue(this, ()=>this.controlledModelPath);
		
		this.sectionContent.append('treez-model-path')
	    	.label('Variable source model (provides variables)')
	    	.nodeAttr('atomClasses', [Model])	    	
	    	.bindValue(this, ()=>this.sourceModelPath);
		

		this.sectionContent.append('treez-check-box')
			.label('Concurrent execution')
			.bindValue(this, ()=>this.isConcurrent);
	    
    }
	
	async execute(treeView, monitor) {
		if(!monitor){
			var monitorTitle = this.constructor.name + ' "' + this.name + '"';
			monitor = new Monitor(monitorTitle, treeView);
			monitor.showInMonitorView();
		}
		try {
			this.__treeView = treeView;
			this.isCanceled = false;
			
			var className = this.constructor.name;
	
			var startMessage = 'Executing ' + className + ' "' + this.name + '"';
			monitor.info(startMessage);
			
			var numberOfRanges = this.inputGenerator.getNumberOfEnabledRanges();
			monitor.info('Number of (enabled) ranges: ' + numberOfRanges);
		
			var studyTitle = "Running " + className;
			monitor.title = studyTitle;
	
			var numberOfSimulations = this.inputGenerator.getNumberOfSimulations();
			monitor.setTotalWork(numberOfSimulations);
					
			monitor.info("Number of total simulations: " + numberOfSimulations);
	
			//reset job index to 1
			ModelInput.resetIdCounter();
	
			//create model inputs
			var modelInputs = this.inputGenerator.createModelInputs();
	
			//prepare result structure
			this.__prepareResultStructure(monitor);
			treeView.refresh();
	
			//get sweep output atom
			var studyOutputAtomPath = this.__createStudyOutputAtomPath();
			var studyOutputAtom = this.getChildFromRoot(studyOutputAtomPath);
	
			//remove all old children if they exist
			studyOutputAtom.removeAllChildren();
	
			//execute target model for all model inputs
			this.numberOfRemainingModelJobs = numberOfSimulations;
	
			if (!monitor.isCanceled) {
				var jobFinishedHook = () => this.__finishOrCancelIfDone(treeView, monitor);
	
				if (this.isConcurrent) {
					await this.__executeTargetModelConcurrently(treView, numberOfSimulations, modelInputs, studyOutputAtom, monitor, jobFinishedHook);
				} else {
					await this.__executeTargetModelOneAfterAnother(treeView, numberOfSimulations, modelInputs, studyOutputAtom, monitor, jobFinishedHook);
				}
			}		
		} catch (exception) {
			monitor.error('Could not execute study "' + this.name + '"!', exception);
			monitor.done();
		}
	}	
	
	
	__finishOrCancelIfDone(treeView, monitor) {

		if (this.isCanceled) {
				return;
		}

		if(monitor.isChildCanceled){
			monitor.cancel();			
		}		

		if (monitor.isCanceled) {			
			
			this.isCanceled = true;
			monitor.markIssue();
			monitor.setDescription('Canceled!');
			this.__logAndShowCancelMessage(monitor);
			treeView.refresh();			
		}

		var numberOfRemainingJobs = this.numberOfRemainingModelJobs-1;
		this.numberOfRemainingModelJobs = numberOfRemainingJobs;

		if (numberOfRemainingJobs === 0) {

			this.executeRunnableChildren(treeView, monitor);

			monitor.setDescription('Finished!');

			if (monitor.isChildCanceled) {
				monitor.cancel();
			} else {
				monitor.done();
			}

			this.__logAndShowEndMessage(monitor);
			treeView.refresh();


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
		
		var model = this.getControlledModel();
		
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

		var pathForModelToRun = model.getTreePath();
		var root = outputAtom.getRoot();

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
				var shadowModelToRun = shadowRoot.getChildFromRoot(pathForModelToRun);

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

		var self=this;
		
		var model = this.__getControlledModel();
		var startTime = new Date().valueOf();		
		
		var jobCounter = 1;


		for(const modelInput of modelInputs){
			
			if(monitor.isCanceled){
				jobFinishedHook();
				return;
			}
			
			this.__logStartMessage(jobCounter, startTime, numberOfSimulations, monitor);

			var jobId = modelInput.jobId;
			var jobTitle = 'Job #' + jobId ;
			var jobMonitor = monitor.createChild(jobTitle, treeView, jobId, 1);
			
			monitor.setDescription('=>' + jobTitle);

			var modelOutput = await model.runModel(modelInput, treeView, jobMonitor);
			
			var modelOutputName = self.name + 'OutputId' + modelInput.jobId;
			modelOutput.name = modelOutputName;
			outputAtom.addChild(modelOutput);

			jobFinishedHook();			

			treeView.refresh();		
			
			jobCounter++;	
			
		};

	}

	
	__prepareResultStructure(monitor) {
		this.__createResultsAtomIfNotExists(monitor);
		this.__createDataAtomIfNotExists(monitor);
		this.__createOutputAtomIfNotExists(monitor);		
	}

	__createOutputAtomIfNotExists(monitor) {
		var dataAtomPath = this.__createDataOutputAtomPath();
		var studyOutputAtomName = this.__createStudyOutputAtomName();
		var studyOutputAtomPath = this.__createStudyOutputAtomPath();
		var studyOutputAtomExists = this.rootHasChild(studyOutputAtomPath);
		if (!studyOutputAtomExists) {
			var studyOutput = new StudyOutput(studyOutputAtomName, this.image);
			var data = this.getChildFromRoot(dataAtomPath);
			data.addChild(studyOutput);
			monitor.info('Created ' + studyOutputAtomPath + ' for study output.');
		}

	}

	__createResultsAtomIfNotExists(monitor) {
		var resultAtomPath = "root.results";
		var resultAtomExists = this.rootHasChild(resultAtomPath);
		if (!resultAtomExists) {			
			var root = this.getRoot();
			root.createResults();			
			monitor.info('Created ' + resultAtomPath + ' for study output.');
		}
	}

	__createDataAtomIfNotExists(monitor) {
		var resultAtomPath = 'root.results';
		var dataAtomName = 'data';
		var dataAtomPath = this.__createDataOutputAtomPath();
		var dataAtomExists = this.rootHasChild(dataAtomPath);
		if (!dataAtomExists) {			
			var results = this.getChildFromRoot(resultAtomPath);
			results.createData();
			monitor.info('Created ' + dataAtomPath + ' for study output.');
		}
	}
	
	__createStudyOutputAtomPath() {
		return this.__createDataOutputAtomPath() + "." + this.__createStudyOutputAtomName();	
	}

	__createDataOutputAtomPath() {
		return 'root.results.data';		
	}


	__createStudyOutputAtomName() {
		return this.name + 'Output';		
	}	

	__getControlledModel() {		
		try {
			return this.getChildFromRoot(this.controlledModelPath);
			
		} catch (error) {
			var message = 'The model path "' + this.controlledModelPath + '" does not point to a valid model.';
			throw new Error(message, error);
		}
	}

	__getSourceModel() {
		if(!this.sourceModelPath){
			return null;
		}
		try{
			return this.getChildFromRoot(this.sourceModelPath);			
		} catch (error) {
			var message = 'The model path "' + sourcePath + '" does not point to a valid model.';
			throw new Error(message, error);
		}
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

	__logAndShowEndMessage(monitor) {		
		var date =new Date();		
		var currentDateString = date.toLocaleString();	
			
		var message = "-- " + currentDateString + " -------- Finished! --------------------------------";
		monitor.info(message);
		
		var alertMessage = 'Finished ' + this.constructor.name + ' "' + this.name + '"!'
		alert(alertMessage);
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


}
