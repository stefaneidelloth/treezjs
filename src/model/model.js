import ComponentAtom from './../core/component/componentAtom.js';
import Monitor from './../core/monitor/monitor.js';
import OutputAtom from './../core/output/outputAtom.js';
import AbstractPathVariable from './../variable/field/abstractPathVariable.js';


export default class Model extends ComponentAtom {	
   

	constructor(name) {
		super(name);		

        /**
         * Is true if the Model is a manual Model. That means that the model is not remotely executed by a Study
         * but will be skipped.
         */
        this.__isManualModel = false;

        /**
         * If the execution of the model is part of a study, this holds the id of the study.
         */
        this.__studyId = undefined;

        this.__studyDescription = '';

        /**
         * The id for the last execution of the model. This might be the id from a model input while executing a study (e.g.
         * sweep). It might also be an id from a manual execution that has been set by the model itself.
         */
        this.__jobId = 1;
	}



	__assignModelInput(modelInput, monitor) {

		monitor.info('Assigning model input for ' + this.constructor.name + ' "' + this.name + '"');

		if (modelInput != null) {

			this.studyId = modelInput.studyId;
			this.studyDescription = modelInput.studyDescription;
			this.jobId = modelInput.jobId;

			//set variable values
			const variableModelPaths = modelInput.all;
            variableModelPaths.forEach((variableModelPath)=>{
                const quantityToAssign = modelInput.get(variableModelPath);
                const variableAtom = this.getVariableAtom(variableModelPath);               
                if (variableAtom !== null) {
                    variableAtom.value = quantityToAssign;
                } else {
                    throw new Error('Could not get variable atom for model path ' + variableModelPath);
                }
            });

		}
	}

	
	async execute(treeView, monitor) {

		this.treeView = treeView;
		
		var hasMainMonitor = false;		
		if(!monitor){
			var monitorTitle = this.constructor.name + ' "' + this.name + '"';
			monitor = new Monitor(monitorTitle, treeView);
			monitor.showInMonitorView();
			monitor.clear();
			hasMainMonitor = true;
		}

		await this.doRunModel(treeView, monitor)
			.catch(error => {
	        	monitor.error('Could not execute  ' + this.constructor.name + ' "' + this.name + '"!', error);    
	        	throw error;        					   
	        }); //total work must be set inside this method		

		if(hasMainMonitor){
			monitor.done();	
		}	
			
	}

	/**
	 * Remotely runs the model with the given ModelInput
	 */
	async runModel(modelInput, treeView, monitor) {

		//assign the model input to variable values (also assigns model input for sub models)
		this.__assignModelInput(modelInput, monitor);

		if (monitor.isCanceled) {
			monitor.error('Model "' + name + '" does not run since execution has been canceled.');
			return this.createEmptyModelOutput();
		}

		return await this.doRunModel(treeView, monitor);
	}

	/**
	 * Remotely runs the model with the current model state. Should be overridden by models that have no sub models.
	 */
	async doRunModel(treeView, monitor) {

		monitor.info('Running ' + this.constructor.name + ' "' + this.name + '"');			
		
		monitor.totalWork = this.numberOfRunnableChildren;
					
		const modelOutput = this.__createEmptyModelOutput();
		for (const child of this.children){

			if(child.isRunnable){
				var subMonitor = monitor.createChild(child.name, treeView, child.name, 1);
				if(child instanceof Model){				
					var childModelOutput = await child.doRunModel(treeView, subMonitor);
					if (childModelOutput) {
						modelOutput.addChild(childModelOutput);
					}
				} else {	
					await child.execute(treeView, subMonitor);
				}
				
			}
		}		

		monitor.done();
		var newJobId = this.jobId +1;
		this.jobId = newJobId;		
		
		if(modelOutput.children.length>0){
			return modelOutput; 		
		} else {
			return null;
		}			
	}
	

	/**
	 * Creates an empty model output. It wraps a RootOutput that is used to organize the child model outputs in a tree
	 * structure;
	 */
	__createEmptyModelOutput() {		
		return new OutputAtom(this.name, this.image);		
	}

	/**
	 * Finds and returns the variable atom of type AttributeAtom<Quantity> for the given relative model path. Returns
	 * null if the variable model path could not be found or if the atom could not be casted to AttributeAtom<Quantity>.
	 */
	 getVariableAtom(variableModelPath) {

		let variableAtom = null;
		try {
			variableAtom = this.childFromRoot(variableModelPath);
			return variableAtom;
		} catch (exception) {
			const message = 'Could not find a variable field for the model path "' + variableModelPath + '".';
			console.error(message);
			return null;
		}
	}

	/**
	 * Runs the first child model with the given constructor and returns its ModelOutput
	 */
	runChildModel(wantedConstructor, treeView, monitor) {
	    let modelOutput = null;
        for (var child of this.children) {
            const hasWantedClass = child.constructor === wantedConstructor;
            if (hasWantedClass) {
                if (child instanceof Model) {
                	var subMonitor = monitor.createChild(child.name, treeView, child.name, 1);
                    return  child.doRunModel(treeView, subMonitor);
                } else {
                    throw new Error('The found child "' + child.name + '" is not a model.');
                }
            }
        }

        const message = 'Could not find a child of wanted class "' + wantedConstructor.name + '".';
        throw new Error(message);
	}


	hasChildModel(wantedConstructor) {

        for (var child of this.children) {
            const hasWantedClass = child.constructor === wantedConstructor;
            if (hasWantedClass) {
                return true;
            }
        }
        return false;
	}
	
	providePathMap(){	
		
		var pathVariables = [];
		
		if(this.enabledVariables){
			for(var variable of this.enabledVariables){
				if(variable instanceof AbstractPathVariable){
					pathVariables.push(variable);
				}
			}
		}		
		
		return pathVariables;
	}

	get jobId(){
	    return this.__jobId;
    }

	set jobId(jobId) {
		this.__jobId = jobId;
        for (var child of this.children) {
			if (child instanceof Model) {
				child.jobId = jobId;
			}
		}
        
        this.refreshStatus();
	}
	
	resetJobId(){
		this.jobId = 1;		
	}

	increaseJobId() {		
		this.jobId = this.jobId + 1;		
	}
	
	refreshStatus(){
		//might be overridden by inheriting class
	};

    get studyId(){
        return this.__studyId;
    }

	set studyId(studyId) {
		this.__studyId = studyId;
        for (var child of this.children) {
            if (child instanceof Model) {
                child.studyId = studyId;
            }
        }
        
        this.refreshStatus();
	}


    get studyDescription(){
        return this.__studyDescription;
    }

	set studyDescription(studyDescription) {
		this.__studyDescription = studyDescription;
        for (var child of this.children) {
            if (child instanceof Model) {
                child.studyDescription = studyDescription;
            }
        }
        
        this.refreshStatus();
	}
	
	

}
