import ComponentAtom from './../core/component/componentAtom.js';
import Model from './../model/model.js';

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
	}
	
	createComponentControl(tabFolder, treeView){   
	     
		this.page = tabFolder.append('treez-tab')
            .label('Data');		

		const section = this.page.append('treez-section')
        	.label(this.constructor.name); 
		
		section.append('treez-section-action')
		 	.label('Run')
	        .image('run.png')	       
	        .addAction(()=>this.execute(treeView));		
		

		this.sectionContent = section.append('div'); 	     

		this.sectionContent.append('treez-text-field')
        	.label('Id')
        	.bindValue(this, ()=>this.id);
        
		this.sectionContent.append('treez-text-field')
	    	.label('Description')
	    	.bindValue(this, ()=>this.description);
	   
		this.sectionContent.append('treez-model-path')
        	.label('Model to run')
        	.attr('atomclasses', Model.name)
        	.bindValue(this, ()=>this.controlledModelPath);
		
		this.sectionContent.append('treez-model-path')
	    	.label('Variable source model (provides variables)')
	    	.attr('atomclasses', Model.name)
	    	.bindValue(this, ()=>this.sourceModelPath);
		

		this.sectionContent.append('treez-check-box')
			.label('Concurrent execution')
			.bindValue(this, ()=>this.isConcurrent);
	    
    }
	
	execute(treeView) {
		const monitor = new Monitor(this.constructor.name, treeView);
		monitor.showInMonitorView();
		try {
			this.runStudy(treeView, monitor);
		} catch (exception) {
			console.error("Could not execute study '" + this.name + "'!", exception);
			monitor.done();
		}
	}
	
	runStudy(treeView, monitor) {		
		this.__treeView = treeView;
		this.isCanceled = false;
		
		var className = this.constructor.name;

		var startMessage = 'Executing ' + className + ' "' + this.name + '"';
		console.info(startMessage);
		
		var activeRanges = this.inputGenerator.getActiveVariableRanges();
		console.info('Number of variable ranges: ' + activeRanges.length());
	
		var studyTitle = "Running " + className;
		var numberOfSimulations = this.inputGenerator.getNumberOfSimulations();

		var stuyMonitor = monitor.createChild(studyTitle, numberOfSimulations);
		
		console.info("Number of total simulations: " + numberOfSimulations);

		//reset job index to 1
		ModelInput.resetIdCounter();

		//create model inputs
		var modelInputs = this.inputGenerator.createModelInputs();

		//prepare result structure
		this.__prepareResultStructure();
		this.__refresh();

		//get sweep output atom
		var sweepOutputAtomPath = this.getStudyOutputAtomPath();
		var sweepOutputAtom = this.getChildFromRoot(sweepOutputAtomPath);

		//remove all old children if they exist
		sweepOutputAtom.removeAllChildren();

		//execute target model for all model inputs
		var numberOfRemainingModelJobs = [];
		numberOfRemainingModelJobs.push(numberOfSimulations);

		if (!monitor.isCanceled) {
			var jobFinishedHook = () => this.__finishOrCancelIfDone(treeView, sweepMonitor,
					numberOfRemainingModelJobs);

			if (this.isConcurrent) {
				this.__executeTargetModelConcurrently(treView, numberOfSimulations, modelInputs, sweepOutputAtom, sweepMonitor, jobFinishedHook);
			} else {
				this.__executeTargetModelOneAfterAnother(refreshable, numberOfSimulations, modelInputs, sweepOutputAtom, sweepMonitor, jobFinishedHook);
			}

			this.executeRunnableChildren(treeView);

		}		

	}
	
	__finishOrCancelIfDone(treeView, monitor, numberOfRemainingModelJobs) {

		var remainingModelJobs = numberOfRemainingModelJobs[0] - 1;
		numberOfRemainingModelJobs[0] = remainingModelJobs;

		if (monitor.isChildCanceled()) {
			if (this.isCanceled) {
				return;
			}
			this.isCancled = true;
			monitor.markIssue();
			monitor.setDescription('Canceled!');
			monitor.cancel();

			this.logAndShowCancelMessage();
			treeView.refresh();			
		}

		if (remainingModelJobs === 0) {

			monitor.setDescription('Finished!');

			if (monitor.isChildCanceled()) {
				monitor.cancel();
			} else {
				monitor.done();
			}

			this.logAndShowEndMessage();
			treeView.refresh();
		}
	}

	__executeTargetModelConcurrently(treeView, numberOfSimulations, modelInputs, outputAtom, monitor, jobFinishedHook) {

		var self = this;
		
		
		
		var currentDateString = new Date().toLocaleString();	
		var message = '-- ' + currentDateString + ' --- Starting ' + numberOfSimulations + ' simulations ----------';
		console.info(message);

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

		var modelJob = () => {

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

					var modelOutputAtom = shadowModelToRun.runModel(modelInput, treeView, jobMonitor);

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
				console.error("Could not run " + jobTitle, exception);
				monitor.cancel();
			}

			jobFinishedDelegate();
		};

		queue.add(modelJob);

	}

	__executeTargetModelOneAfterAnother(treeView, numberOfSimulations, modelInputs, outputAtom, monitor, jobFinishedHook) {

		var self=this;
		var counter = 1;
		var model = this.__getControlledModel();
		var startTime = new Date().valueOf();
		
		modelInputs.forEach((modelInput)=>{
			//allows to cancel the sweep if a user clicks the cancel button at the progress monitor window
			if (!monitor.isCanceled()) {
				
				this.__logModelStartMessage(counter, startTime, numberOfSimulations);

				monitor.setDescription("=>Job #" + counter);

				var jobId = modelInput.getJobId();
				var jobTitle = "Job '" + jobId + "'";
				var jobMonitor = monitor.createChild(jobTitle, jobId, 1);

				var modelOutputAtom = model.runModel(modelInput, treeView, jobMonitor);

				
				var modelOutputName = self.name + "OutputId" + modelInput.getJobId();
				modelOutputAtom.name = modelOutputName;
				outputAtom.addChild(modelOutputAtom);

				jobFinishedHook();

				counter++;
			}
		});

		this.__refresh();

	}
	
	__prepareResultStructure() {
		this.__createResultsAtomIfNotExists();
		this.__createDataAtomIfNotExists();
		this.__createOutputAtomIfNotExists();
		this.refresh();
	}

	__createOutputAtomIfNotExists() {
		var dataAtomPath = this.__createDataOutputAtomPath();
		var studyOutputAtomName = this.__createStudyOutputAtomName();
		var studyOutputAtomPath = this.__createStudyOutputAtomPath();
		var studyOutputAtomExists = this.rootHasChild(studyOutputAtomPath);
		if (!studyOutputAtomExists) {
			var studyOutputAtom = new OutputAtom(studyOutputAtomName, this.image);
			var data = this.getChildFromRoot(dataAtomPath);
			data.addChild(sweepOutputAtom);
			console.info('Created ' + studyOutputAtomPath + ' for study output.');
		}

	}

	__createResultsAtomIfNotExists() {
		var resultAtomPath = "root.results";
		var resultAtomExists = this.rootHasChild(resultAtomPath);
		if (!resultAtomExists) {			
			var root = this.getRoot();
			root.createResults();			
			console.info('Created ' + resultAtomPath + ' for study output.');
		}
	}

	__createDataAtomIfNotExists() {
		var resultAtomPath = 'root.results';
		var dataAtomName = 'data';
		var dataAtomPath = this.__createOutputDataAtomPath();
		var dataAtomExists = this.rootHasChild(dataAtomPath);
		if (!dataAtomExists) {			
			var results = this.getChildFromRoot(resultAtomPath);
			results.createData();
			console.info('Created ' + dataAtomPath + ' for study output.');
		}
	}
	
	__createStudyOutputAtomPath() {
		return this.__createOutputDataAtomPath() + "." + this.__createStudyOutputAtomName();	
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

	logModelStartMessage(counter, startTime, numberOfSimulations) {

		//get current time
		var date =new Date();		
		var currentDateString = date.toLocaleString();
		var currentTime = date.valueOf();

		//estimate end time
		var endTimeString = this.estimateEndTime(startTime, currentTime, counter, numberOfSimulations);

		//log start message
		var message = "-- " + currentDateString + " --- Simulation " + counter + " of " + numberOfSimulations
				+ " -------- " + endTimeString + " --";
		console.info(message);

	}

	logAndShowEndMessage() {		
		var date =new Date();		
		var currentDateString = date.toLocaleString();	
			
		var message = "-- " + currentDateString + " -------- Finished! --------------------------------";
		console.info(message);
		alert('Finished!');
	}

	logAndShowCancelMessage() {		
		var date =new Date();		
		var currentDateString = date.toLocaleString();
				
		var message = "-- " + currentDateString + " -------- Canceled! --------------------------------";
		console.info(message);
		alert("Canceled!");
	}

	
	estimateEndTime(startTime, currentTime, counter, numberOfSimulations) {
		var timeDifference = currentTime - startTime;
		var numberOfFinishedSimulations = (counter - 1);
		var estimatedTimePerSimulation = Double.NaN;
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
