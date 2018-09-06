import VueAtom from './../../core/vue/vueAtom.js';


export default class Model extends VueAtom {

    static get LOG() {
        return new Log4js.getLogger(Model.constructor.name);
    }

	constructor(name) {
		super(name);

        /**
         * Is true if the Model is a manual Model. That means that the model is not remotely executed by a Study
         * but will be skipped.
         */
        this.isManualModel = false;

        /**
         * If the execution of the model is part of a study, this holds the id of the study.
         */
        this._studyId = undefined;

        this._studyDescription = "";

        /**
         * The id for the last execution of the model. This might be the id from a model input while executing a study (e.g.
         * sweep). It might also be an id from a manual execution that has been set by the model itself.
         */
        this._jobId = "1";
	}

	copy(atomToCopy){ //TODO

    }

	/**
	 * Remotely runs the model with the given ModelInput
	 */
	runModel(modelInput, refreshable, monitor) {

		//assign the model input to variable values (also assigns model input for sub models)
		this.assignModelInput(modelInput);

		if (monitor.isCanceled()) {
			console.error("Model '\" + name + \"' does not run since execution has been canceled.");
			return this.createEmptyModelOutput();
		}

		return this.doRunModel(refreshable, monitor);
	}

	assignModelInput(modelInput) {

		console.info("Assigning model input for " + this.constructor.name + " '" + this.name + "'");

		if (modelInput != null) {

			this.studyId = modelInput.studyId;
			this.studyDescription = modelInput.studyDescription;
			this.jobId = modelInput.jobId;

			//set variable values
			const variableModelPaths = modelInput.getAllVariableModelPaths();
            variableModelPaths.every((variableModelPath)=>{
                const quantityToAssign = modelInput.getVariableValue(variableModelPath);
                const variableAtom = this.getVariableAtom(variableModelPath);
                const attributeName = this.getAttributeName(variableModelPath);
                if (variableAtom !== null) {
                    variableAtom[attributeName] = quantityToAssign;
                } else {
                    throw new Error("Could not get variable atom for model path " + variableModelPath);
                }
            });

		}
	}

	/**
	 * Executes the model with the current state of its variables
	 */
	execute(refreshable) {
		/*
		runNonUiTask("AbstractModel: execute", (monitor) => {
			try {
				const treezMonitor = new TreezMonitor("Treez console", monitor, 1);
				this.runModel(refreshable, treezMonitor);
			} catch (exception) {
				LOG.error("Could not execute model '" + this.name + "'!", exception);
				monitor.done();
			}
		});
		*/
	}

	/**
	 * Remotely runs the model with the current model state. Should be overridden by models that have no sub models.
	 */
	doRunModel(refreshable, monitor) {

		LOG.info("Running " + this.constructor.name + " '" + this.name + "'");

		const modelOutput = this.createEmptyModelOutput();
		this.children.every((child)=>{
            const isModel = child instanceof Model;
            if (isModel) {
                if (!child.isManualModel) {
                    const childModelOutput = childModel.doRunModel(refreshable, monitor);
                    if (childModelOutput !== null) {
                        modelOutput.addChildOutput(childModelOutput);
                    }
                }
            }
        });

		return modelOutput;
	}

	/**
	 * Creates an empty model output. It wraps a RootOutput that is used to organize the child model outputs in a tree
	 * structure;
	 */
	createEmptyModelOutput() {
		const rootOutputName = this.name + "Output";
		const rootOutput = new OutputAtom(rootOutputName, this.image);
		const modelOutput = () => {
			//overrides getRootOutput
			return rootOutput;
		};
		return modelOutput;
	}

	/**
	 * Finds and returns the variable atom of type AttributeAtom<Quantity> for the given relative model path. Returns
	 * null if the variable model path could not be found or if the atom could not be casted to AttributeAtom<Quantity>.
	 */
	 getVariableAtom(variableModelPath) {

		let variableAtom = null;
		try {
			variableAtom = this.getChildFromRoot(variableModelPath);
			return variableAtom;
		} catch (exception) {
			const message = "Could not find a variable field for the model path '" + variableModelPath + "'.";
			LOG.error(message);
			return null;
		}
	}

	/**
	 * Runs the first child model with the given constructor and returns its ModelOutput
	 */
	runChildModel(wantedConstructor, refreshable, monitor) {
	    let modelOutput = null;
        for (var child of this.children) {
            const hasWantedClass = child.constructor === wantedConstructor;
            if (hasWantedClass) {
                if (child instanceof Model) {
                    return  child.doRunModel(refreshable, monitor);
                } else {
                    throw new Error("The found child '" + child.name + "' is not a model.");
                }
            }
        }

        const message = "Could not find a child of wanted class '" + wantedConstructor.name + "'.";
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

	get jobId(){
	    return this._jobId;
    }

	set jobId(jobId) {
		this._jobId = jobId;
        for (var child of this.children) {
			if (child instanceof Model) {
				child.jobId = jobId;
			}
		}
	}

    get studyId(){
        return this._studyId;
    }

	set studyId(studyId) {
		this._studyId = studyId;
        for (var child of this.children) {
            if (child instanceof Model) {
                child.studyId = studyId;
            }
        }
	}


    get studyDescription(){
        return this._studyDescription;
    }

	set studyDescription(studyDescription) {
		this._studyDescription = studyDescription;
        for (var child of this.children) {
            if (child instanceof Model) {
                child.studyDescription = studyDescription;
            }
        }
	}

}
