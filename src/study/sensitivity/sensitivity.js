import Study from './../study.js';
import SweepModelInputGenerator from './sweepModelInputGenerator.js';

export default class Sensitivity extends Study {

	/**
	 * Type of the sensitivity variation (RELATIVE_DISTANCE, ABSOLUTE_POSITION, ...)
	 */
	public final Attribute<SensitivityType> sensitivityType = new Wrap<>();

	/**
	 * If the sensitivity type uses relative numbers, there are several ways to do so. The relationType specifies how
	 * exactly relative numbers are entered.
	 */
	public final Attribute<RelationType> relationType = new Wrap<>();

	public final Attribute<List<Double>> values = new Wrap<>();

	public final Attribute<List<VariableField<?, ?>>> variables = new Wrap<>();

	/**
	 * A handle to the variable list (that is wrapped in the Attribute 'variables')
	 */
	private VariableListWithInfo variableList;

	private EnumComboBox<RelationType> relationTypeCombo;

	private DoubleVariableListField valuesField;

	

	constructor(name) {
		super(name);
		this.image = 'sensitivity.png';
	}

	//#end region

	//#region METHODS

	@Override
	public
			AbstractControlAdaption
			createControlAdaption(Composite parent, FocusChangingRefreshable treeView) {

		updateAvailableVariablesForVariableList();
		return super.createControlAdaption(parent, treeView);

	}

	private void createSensitivityModel() {
		// root, page and section
		AttributeRoot root = new AttributeRoot("root");
		Page dataPage = root.createPage("data", "   Data   ");

		String relativeHelpContextId = "sensitivity";
		String absoluteHelpContextId = Activator.getInstance().getAbsoluteHelpContextId(relativeHelpContextId);

		ModelPath modelPath = createSensitivitySection(dataPage, absoluteHelpContextId);

		createValuesSection(dataPage, absoluteHelpContextId);

		sensitivityTypeChanged();

		createVariableListSection(dataPage, absoluteHelpContextId, modelPath);

		setModel(root);
	}

	private void createVariableListSection(Page dataPage, String absoluteHelpContextId, ModelPath modelPath) {
		Section variableSection = dataPage.createSection("variables", absoluteHelpContextId);

		//variable list
		variableList = variableSection.createVariableListWithInfo(variables, this, "Sensitivity variables");
		variableList.addModificationConsumer("variableListChanged", () -> updateVariableInfos());

		//add listener to update variable list for new source model path and do initial update
		modelPath.addModificationConsumer("updateVariableList", () -> updateAvailableVariablesForVariableList());
	}

	private void updateVariableInfos() {
		SensitivityValueFactory.updateVariableInfos(variableList, this);
	}

	private ModelPath createSensitivitySection(Page dataPage, String absoluteHelpContextId) {
		Section sensitivitySection = dataPage.createSection("sensitivity", absoluteHelpContextId);
		sensitivitySection.createSectionAction("action", "Run sensitivity", () -> execute(treeView));

		//choose selection type and entry atom
		ModelPathSelectionType selectionType = ModelPathSelectionType.FLAT;
		AbstractAtom<?> modelEntryPoint = this;

		//model to run
		String modelToRunDefaultValue = "";
		sensitivitySection
				.createModelPath(modelToRunModelPath, this, modelToRunDefaultValue, Model.class, selectionType,
						modelEntryPoint, false)
				.setLabel("Model to run");

		//variable source model
		String sourceModelDefaultValue = "";
		ModelPath modelPath = sensitivitySection.createModelPath(sourceModelPath, this, sourceModelDefaultValue,
				Model.class, selectionType, modelEntryPoint, false);
		modelPath.setLabel("Variable source model (provides variables)");

		//sensitivity type
		sensitivitySection
				.createEnumComboBox(sensitivityType, this, SensitivityType.RELATIVE_DISTANCE) //
				.setLabel("Sensitivity type") //
				.addModificationConsumer("sensitivityTypeChanged", () -> sensitivityTypeChanged());

		//relation type
		relationTypeCombo = sensitivitySection
				.createEnumComboBox(relationType, this, RelationType.PERCENTAGE) //
				.setLabel("Relation type");

		return modelPath;
	}

	private void createValuesSection(Page dataPage, String absoluteHelpContextId) {
		Section valuesSection = dataPage.createSection("values", absoluteHelpContextId);

		valuesField = valuesSection
				.createDoubleVariableListField(values, this, "Sample values") //
				.set(Arrays.asList(new Double[] { -10.0, 10.0 }));
	}

	private void sensitivityTypeChanged() {
		SensitivityType type = sensitivityType.get();
		relationTypeCombo.setVisible(type.isRelative());

	}

	/**
	 * Determines the available variables with the variable source model path and updates the available variables of the
	 * variable list.
	 */
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



	/**
	 * Creates the context menu actions for this atom
	 */
	@Override
	protected List<Object> createContextMenuActions(treeView treeViewer) {

		List<Object> actions = new ArrayList<>();

		actions.add(new TreeViewAction(
				"Add sample",
				Activator.getImage("add.png"),
				treeViewer,
				() -> LOG.debug("add sample")));

		return actions;
	}

	@Override
	public void runStudy(FocusChangingRefreshable refreshable, SubMonitor monitor) {

		/*
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
		*/

	}

	/**
	 * Checks if the variables that are references by the given sample are active. If not an error message is shown to
	 * the user;
	 *
	 * @param variableRanges
	 * @return
	 */
	private boolean checkIfAllReferencedVariablesAreActive(Sample sample) {

		Map<String, VariableField<?, ?>> variableData = sample.getVariableData();

		List<String> inactiveVariables = new ArrayList<>();
		for (String variableName : variableData.keySet()) {
			String sourceModelPath = this.sourceModelPath.get();
			String variableModelPath = sourceModelPath + "." + variableName;
			VariableField<?, ?> variableField;
			try {
				variableField = this.childFromRoot(variableModelPath);
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
			SensitivityModelInputGenerator inputGenerator,
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
		AbstractAtom<?> studyOutputAtom = this.childFromRoot(studyOutputAtomPath);

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

	/**
	 * Creates the result structure if it does not yet exist to have a place in the tree where the sweep result can be
	 * put. The sweep results will not be a child of the Sweep put a child of for example root.results.data.sweepOutput
	 */
	private void prepareResultStructure() {
		createResultsAtomIfNotExists();
		createDataAtomIfNotExists();
		createPickingOutputAtomIfNotExists();
		this.refresh();
	}

	/**
	 * Creates the Picking output atom if it does not yet exist
	 */
	private void createPickingOutputAtomIfNotExists() {
		String dataAtomPath = createOutputDataAtomPath();
		String pickingOutputAtomName = createStudyOutputAtomName();
		String pickingPutputAtomPath = getStudyOutputAtomPath();
		boolean pickingOutputAtomExists = this.rootHasChild(pickingPutputAtomPath);
		if (!pickingOutputAtomExists) {
			OutputAtom pickingOutputAtom = new OutputAtom(pickingOutputAtomName, provideImage());
			AbstractAtom<?> data = this.childFromRoot(dataAtomPath);
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

	//#region ACCESSORS

	public void setIndividualValuesValueString(String valueString) {

	}

	@Override
	public String getId() {
		return studyId.get();
	}

	@Override
	public String getDescription() {
		return studyDescription.get();
	}

	@Override
	public ModelInputGenerator getModelInputGenerator() {
		// TODO Auto-generated method stub
		return null;
	}

	//#end region

}