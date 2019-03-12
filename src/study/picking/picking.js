import Study from './../study.js';
import SweepModelInputGenerator from './sweepModelInputGenerator.js';

export default class Picking extends Study {
	
	constructor(name) {
		super(name);
		this.image = 'picking.png';		
		
		/**
		 * True if the variable values depends on a "time parameter". Each picking variable will then be specified with an
		 * array of values.
		 */
		this.isTimeDependent = false;

		/**
		 * The model path of the variable that represents the time. The variable values may be of type Integer or Double.
		 */
		this.timeVariableModelPath = undefined;

		/**
		 * The range for the time variable. This also determines the length of the arrays that have to be specified for the
		 * individual picking variables. Only used if type of time variable corresponds to Integer values.
		 */
		this.integerTimeRange = [];

		/**
		 * The range for the time variable. This also determines the length of the arrays that have to be specified for the
		 * individual picking variables. Only used if type of time variable corresponds to Double values.
		 */
		this.doubleTimeRange = [];

		/**
		 * The atom that represents the timeRange
		 */
		this.timeRangeAtom = undefined;

		/**
		 * The variables for which values are picked
		 */
		this.variables = [];

		
	}


	createComponentControl(tabFolder){  
		
		var self = this;	
		this.__updateAvailableVariablesForVariableList();
		super.createComponentControl(tabFolder);

		//time dependent picking
		var timeDependentSection = this.page.append('treez-section')
    		.label('Time dependent picking')
			.attr('open', null);
			
	    var sectionContent = timeDependentSection.append('div');
				
		var isTimeDependentCheckBox = sectionContent.append('treez-check-box')
			.label('Use time series')
			.bindValue(this, ()=>this.isTimeDependent);
					
		
		var timeVariablePath = sectionContent.append('treez-model-path')
			.label('Time variable')
			.nodeAttr('atomClasses', [IntegerVariable, DoubleVariable])
			.bindValue(this, ()=>this.timeVariableModelPath)
			.enabled(false);
		
		timeVariablePath.addModificationConsumer('recreateTimeRangeAtom', () => {			
			self.recreateTimeRangeAtom(timeDependentSection, timeVariablePath);
		});

		
		isTimeDependentCheckBox.addModificationConsumer('showOrHideDependentAttributes', () => {			
			timeVariablePath.isEnabled = self.isTimeDependent;
			if(self.timeRangeAtom) {
				self.timeRangeAtom.isEnabled = self.isTimeDependent;
			}
		});

		//variable list
		var variableSection = this.page.append('treez-section')
			.label('variables');
		
		var variableSectionContent = variableSection.append('div');
		
		this.variableList = variableSectionContent.append('treez-variable-list')
			.label('Picking variables')
			.bindValue(this, ()=>this.variables);

		//add listener to update variable list for new source model path and do initial update
		this.sourceModelPath.addModificationConsumer("updateVariableList", () => self.updateAvailableVariablesForVariableList());
		
	}
	
	/*

	
	// Creates a range atom that fits to the type of the time variable

	 
	recreateTimeRangeAtom(section, variablePath) {

		//remove old time range if it exists
		String timeRangeAtomName = getFieldName(integerTimeRange, this);
		section.removeChildIfExists(timeRangeAtomName);

		String doubleRangeAtomName = getFieldName(doubleTimeRange, this);
		section.removeChildIfExists(doubleRangeAtomName);

		if (variablePath == null || "".equals(variablePath)) {
			timeRangeAtom = null;
			if (treeView != null) {
				treeView.refresh();
			}
			return;
		}

		AbstractAtom<?> variableAtom = this.getChildFromRoot(variablePath);
		Class<?> atomClass = variableAtom.getClass();
		boolean isDoubleVariable = DoubleVariableField.class.isAssignableFrom(atomClass);
		if (isDoubleVariable) {
			timeRangeAtom = section.createDoubleVariableListField(doubleTimeRange, this, "Time range (Double)");
			if (treeView != null) {
				treeView.refresh();
			}
			return;
		}

		boolean isIntegerVariable = IntegerVariableField.class.isAssignableFrom(atomClass);
		if (isIntegerVariable) {
			timeRangeAtom = section.createIntegerVariableListField(integerTimeRange, this, "Time range (Integer)");
			if (treeView != null) {
				treeView.refresh();
			}
			return;
		}

		String message = "Could not create range atom for variable of type '" + atomClass.getSimpleName() + "'";
		throw new IllegalStateException(message);

	}

	
	// Determines the available variables with the variable source model path and updates the available variables of the
	// variable list.
	 
	private void updateAvailableVariablesForVariableList() {

		AbstractAtom<?> parent = this.getParentAtom();
		if (parent != null) {
			List<VariableField<?, ?>> availableVariables = new ArrayList<>();
			AbstractModel sourceModel = getSourceModelAtom();
			if (sourceModel != null) {
				List<AbstractAtom<?>> children = sourceModel.getChildAtoms();
				for (AbstractAtom<?> child : children) {
					boolean isVariableField = child instanceof VariableField;
					if (isVariableField) {
						VariableField<?, ?> variableField = (VariableField<?, ?>) child;
						availableVariables.add(variableField);
					}
				}
				variableList.setAvailableVariables(availableVariables);
			}
		}
	}




	@Override
	protected List<Object> extendContextMenuActions(List<Object> actions, treeView treeViewer) {

		//create sample
		Action addSample = new AddChildAtomTreeViewAction(
				Sample.class,
				"sample",
				Activator.getImage("pickingSample.png"),
				this,
				treeViewer);
		actions.add(addSample);

		return actions;
	}

	//#region EXECUTE

	@Override
	public void execute(FocusChangingRefreshable refreshable) {
		String jobTitle = "Picking '" + getName() + "'";
		runNonUiTask(jobTitle, (monitor) -> {
			runStudy(refreshable, monitor);
		});

	}

	@Override
	public void runStudy(FocusChangingRefreshable refreshable, SubMonitor monitor) {
		Objects.requireNonNull(monitor, "You need to pass a valid IProgressMonitor that is not null.");
		this.treeView = refreshable;

		String startMessage = "Executing picking '" + getName() + "'";
		LOG.info(startMessage);

		//create ModelInput generator
		PickingModelInputGenerator inputGenerator = new PickingModelInputGenerator(this);

		//get samples
		List<Sample> samples = inputGenerator.getEnabledSamples();
		int numberOfSamples = samples.size();
		LOG.info("Number of samples: " + numberOfSamples);

		boolean isTimeDependentPicking = this.isTimeDependent.get();
		if (isTimeDependentPicking) {
			int numberOfTimeSteps = inputGenerator.getNumberOfTimeSteps();
			LOG.info("Number of time steps: " + numberOfTimeSteps);
		}

		if (numberOfSamples > 0) {
			Sample firstSample = samples.get(0);

			//check if the picking variables reference enabled variables
			boolean allReferencedVariablesAreActive = checkIfAllReferencedVariablesAreActive(firstSample);
			if (allReferencedVariablesAreActive) {
				doRunStudy(refreshable, monitor, inputGenerator, samples);
			}
		}

	}


	 // Checks if the variables that are references by the given sample are active. If not an error message is shown to
	 // the user;

	 
	private boolean checkIfAllReferencedVariablesAreActive(Sample sample) {

		Map<String, VariableField<?, ?>> variableData = sample.getVariableData();

		List<String> inactiveVariables = new ArrayList<>();
		for (String variableName : variableData.keySet()) {
			String sourceModelPath = this.sourceModelPath.get();
			String variableModelPath = sourceModelPath + "." + variableName;
			VariableField<?, ?> variableField;
			try {
				variableField = this.getChildFromRoot(variableModelPath);
			} catch (IllegalArgumentException exception) {
				String message = "Could not find variable atom '" + variableModelPath + "'.";
				Utils.showErrorMessage(message);
				return false;
			}

			boolean isEnabled = variableField.isEnabled();
			if (!isEnabled) {
				inactiveVariables.add(variableModelPath);
			}
		}

		if (inactiveVariables.isEmpty()) {
			return true;
		} else {
			String message = "Found disabled variable(s):\n" + String.join("\n", inactiveVariables)
					+ "Please enable the variable(s) or disable the corresponding range(s).";
			Utils.showErrorMessage(message);
			return false;
		}

	}

	private void doRunStudy(
			FocusChangingRefreshable refreshable,
			SubMonitor monitor,
			PickingModelInputGenerator inputGenerator,
			List<Sample> samples) {

		//get total number of simulations
		int numberOfSimulations = samples.size();
		LOG.info("Number of total simulations: " + numberOfSimulations);

		//initialize progress monitor
		monitor.beginTask("", numberOfSimulations);

		//reset job index to 1
		HashMapModelInput.resetIdCounter();

		//create model inputs
		List<ModelInput> modelInputs = inputGenerator.createModelInputs();

		//prepare result structure
		prepareResultStructure();
		refresh();

		//get sweep output atom
		String studyOutputAtomPath = getStudyOutputAtomPath();
		AbstractAtom<?> studyOutputAtom = this.getChildFromRoot(studyOutputAtomPath);

		//remove all old children if they exist
		studyOutputAtom.removeAllChildren();

		//execute target model for all model inputs
		executeTargetModel(refreshable, monitor, numberOfSimulations, modelInputs, studyOutputAtom);

		executeExecutableChildren(refreshable);

		//inform progress monitor to be done
		monitor.setTaskName("=>Finished!");

		//show end message
		logAndShowSweepEndMessage();
		LOG.info("The picking output is located at " + studyOutputAtomPath);
		monitor.done();
	}

	
	// Creates the result structure if it does not yet exist to have a place in the tree where the sweep result can be
	// put. The sweep results will not be a child of the Sweep put a child of for example root.results.data.sweepOutput
	
	private void prepareResultStructure() {
		createResultsAtomIfNotExists();
		createDataAtomIfNotExists();
		createPickingOutputAtomIfNotExists();
		this.refresh();
	}


	private void createPickingOutputAtomIfNotExists() {
		String dataAtomPath = createOutputDataAtomPath();
		String pickingOutputAtomName = createStudyOutputAtomName();
		String pickingPutputAtomPath = getStudyOutputAtomPath();
		boolean pickingOutputAtomExists = this.rootHasChild(pickingPutputAtomPath);
		if (!pickingOutputAtomExists) {
			OutputAtom pickingOutputAtom = new OutputAtom(pickingOutputAtomName, provideImage());
			AbstractAtom<?> data = this.getChildFromRoot(dataAtomPath);
			data.addChild(pickingOutputAtom);
			LOG.info("Created " + pickingPutputAtomPath + " for picking output.");
		}
	}

	private void executeTargetModel(
			FocusChangingRefreshable refreshable,
			SubMonitor monitor,
			int numberOfSimulations,
			List<ModelInput> modelInputs,
			AbstractAtom<?> pickingOutputAtom) {
		int counter = 1;
		Model model = getModelToRun();
		long startTime = System.currentTimeMillis();
		for (ModelInput modelInput : modelInputs) {

			//allows to cancel the Picking if a user clicks the cancel button at the progress monitor window
			if (!monitor.isCanceled()) {
				logModelStartMessage(counter, startTime, numberOfSimulations);

				//create subtask and sub monitor for progress monitor
				monitor.setTaskName("=>Simulation #" + counter);
				TreezMonitor subMonitor = new TreezMonitor("Executing target", monitor, 1);

				//execute model
				ModelOutput modelOutput = model.runModel(modelInput, refreshable, subMonitor);

				//post process model output
				AbstractAtom<?> modelOutputAtom = modelOutput.getOutputAtom();
				String modelOutputName = getName() + "OutputId" + modelInput.getJobId();
				modelOutputAtom.setName(modelOutputName);
				pickingOutputAtom.addChild(modelOutputAtom);
				refresh();
				counter++;

			}

		}
	}

	//#end region

	//#region ADD VARIABLES

	
	// Adds a variable to the picking probe so that values can be specified for it in the children of the picking atom

	public void addVariable(String variableName) {
		String sourceModel = sourceModelPath.get();
		if (sourceModel != null) {
			String variablePath = sourceModel + "." + variableName;
			VariableField<?, ?> variableAtom = this.getChildFromRoot(variablePath);
			if (variableAtom != null) {
				variableList.addVariable(variableAtom);
			}
		}

	}

	//#end region

	//#region CREATE CHILD ATOMS




	public Sample createSample(String name) {
		Sample sample = new Sample(name);
		this.addChild(sample);
		return sample;
	}

	//#end region

	//#end region

	//#region ACCESSORS

	
	// Returns a list of the variables that is used for the picking samples

	public List<VariableField<?, ?>> getPickingVariables() {
		List<VariableField<?, ?>> selectedVariables = variableList.get();
		return selectedVariables;
	}

	@Override
	public List<Number> getRange() {
		return getTimeRange();
	}

	@Override
	public Class<? extends Number> getRangeType() {
		if (isTimeDependent.get()) {
			Class<?> rangeType = timeRangeAtom.getClass();
			boolean isIntegerRange = IntegerVariableListField.class.isAssignableFrom(rangeType);
			if (isIntegerRange) {
				return Integer.class;
			}
			boolean isDoubleRange = DoubleVariableListField.class.isAssignableFrom(rangeType);
			if (isDoubleRange) {
				return Double.class;
			}

			String message = "Could not get value type for time range atom of type " + rangeType.getSimpleName();
			throw new IllegalStateException(message);
		} else {
			return null;
		}
	}

	
	 // Returns the time range. If the picking is not time dependent, null will be returned
	
	public List<Number> getTimeRange() {

		if (isTimeDependent.get()) {
			Class<?> rangeType = timeRangeAtom.getClass();
			boolean isIntegerRange = IntegerVariableListField.class.isAssignableFrom(rangeType);
			if (isIntegerRange) {
				IntegerVariableListField listField = (IntegerVariableListField) timeRangeAtom;
				List<Integer> timeRange = listField.get();
				List<Number> numberTimeRange = new ArrayList<>();
				numberTimeRange.addAll(timeRange);
				return numberTimeRange;
			}
			boolean isDoubleRange = DoubleVariableListField.class.isAssignableFrom(rangeType);
			if (isDoubleRange) {
				DoubleVariableListField listField = (DoubleVariableListField) timeRangeAtom;
				List<Double> timeRange = listField.get();
				List<Number> numberTimeRange = new ArrayList<>();
				numberTimeRange.addAll(timeRange);
				return numberTimeRange;
			}

			String message = "Could not get time range from time range atom of type " + rangeType.getSimpleName();
			throw new IllegalStateException(message);
		} else {
			return null;
		}

	}

	@Override
	public ModelInputGenerator getModelInputGenerator() {
		// TODO Auto-generated method stub
		return null;
	}

	//#end region
	
	*/

}
