import AbstractSampleStudy from './../sample/abstractSampleStudy.js';
import SensitivtyModelInputGenerator from './sensitivityModelInputGenerator.js';
import SensitivityOutput from './sensitivityOutput.js';

export default class Sensitivity extends AbstractSampleStudy {
	
	constructor(name) {
		super(name);
		this.image = 'sensitivity.png';
		this.type = SensitivityType.relativeDistance;
		
		//If the sensitivity type uses relative numbers, there are several ways to do so. 
		//The relationType specifies how exactly relative numbers are entered.
		this.relationType = RelationType.foo; 
		this.values = [];
		this.__variables = [];
		this.__variableListWithInfoSelection = undefined;
		this.__relationTypeSelection = undefined;
		this.__valuesSelection = undefined;
	}
	
	createComponentControl(tabFolder){ 
		super.createComponentControl(tabFolder);		
		
		this.__createSensitivitySection(this.__page);		
		this.__createVariableSection(this.__page);	
		this.__createValuesSection(this.__page);
	}
	
	__createSensitivitySection(page) {
		
		
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
	




	__createValuesSection(page) {
		Section valuesSection = dataPage.createSection("values", absoluteHelpContextId);

		valuesField = valuesSection
				.createDoubleVariableListField(values, this, "Sample values") //
				.set(Arrays.asList(new Double[] { -10.0, 10.0 }));
	}

	__typeChanged() {
		SensitivityType type = sensitivityType.get();
		relationTypeCombo.setVisible(type.isRelative());

	}
	
	

	runStudy(treeView, monitor) {

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

	__doRunStudy(treeView, monitor, inputGenerator, samples) {

		//get total number of simulations
		var numberOfSimulations = samples.length;
		monitor.info('Total number of simulations: ' + numberOfSimulations);

		//initialize progress monitor
		monitor.totalWork = numberOfSimulations;

		//reset job index to 1
		ModelInput.resetIdCounter();

		//create model inputs
		var modelInputs = this.inputGenerator.modelInputs;

		//prepare result structure
		this.prepareResultStructure();
		treeView.refresh();

		//get sweep output atom		
		var sensitivityOutputAtom = this.childFromRoot(this.studyOutputAtomPath);

		//remove all old children if they exist
		sensitivityOutputAtom.removeAllChildren();

		//execute target model for all model inputs
		this.executeTargetModel(treeView, monitor, numberOfSimulations, modelInputs, sensitivityOutputAtom);

		this.__executeRunnableChildren(treeView);

		//inform progress monitor to be done
		monitor.description = '=>Finished!';

		//show end message
		this.__logAndShowSweepEndMessage();
		monitor.info('The sensitivity output is located at ' + this.studyOutputAtomPath);
		monitor.done();
	}	
	
	createStudyOutputAtom(name){
		return new SensitivityOutput(name);
	}

	

	


}
