import Study from './../study.js';
import PickingOutput from './pickingOutput.js';
import PickingModelInputGenerator from './pickingModelInputGenerator.js';
import AddChildAtomTreeViewAction from './../../core/treeview/addChildAtomTreeViewAction.js';
import Sample from './sample.js';
import DoubleVariable from './../../variable/field/doubleVariable.js';
import IntegerVariable from './../../variable/field/integerVariable.js';
import DoubleRange from './../../variable/range/doubleRange.js';
import IntegerRange from './../../variable/range/integerRange.js';

export default class Picking extends Study {
	
	constructor(name) {
		super(name);
		this.image = 'picking.png';		
		
		// True if the variable values depends on a "time parameter". Each picking variable will then be specified with an
		// array of values.
		this.isTimeDependent = false;

		//The model path of the variable that represents the time. The variable values may be of type Integer or Double.
		this.timeVariableModelPath = undefined;
		
		this.timeRangeString = '[]';
		this.variableNames = [];	

		this.inputGenerator = new PickingModelInputGenerator(this);		
	
		this.__timeRangeAtom = undefined;
		this.__variableListSelection = undefined;
	}

	createComponentControl(tabFolder){ 
		super.createComponentControl(tabFolder);		
		this.__createTimeDependentSection(this.__page);		
		this.__createVariableSection(this.__page);		
	}
	
	__createTimeDependentSection(page){
		var section = page.append('treez-section')
			.label('Time dependent picking');
		
	    var sectionContent = section.append('div');
				
		var isTimeDependentCheckBox = sectionContent.append('treez-check-box')
			.label('Use time series')
			.onChange(() => this.__showOrHideTimeComponents())
			.bindValue(this, () => this.isTimeDependent);					
		
		this.__timeVariablePathSelection = sectionContent.append('treez-model-path')
			.label('Time variable')
			.nodeAttr('atomClasses', [IntegerVariable, DoubleVariable])
			.bindValue(this, ()=>this.timeVariableModelPath);
		
		this.__timeRangeSelection = sectionContent.append('treez-text-field')
			.label('Time range')
			.bindValue(this, () => this.timeRangeString)
							
		this.__showOrHideTimeComponents();

		section.node().collapse();		
		
	}
	
	__showOrHideTimeComponents(){
		if(this.isTimeDependent){
			this.__timeVariablePathSelection.show();
			this.__timeRangeSelection.show();
		} else {
			this.__timeVariablePathSelection.hide();
			this.__timeRangeSelection.hide();
		}		
	}
	
	__createVariableSection(page){
		
		var section = page.append('treez-section')
			.label('Variable selection');
		
		var sectionContent = section.append('div');
		
		this.__variableListSelection = sectionContent.append('treez-string-item-list')			
			.nodeAttr('options', this.availableVariableNames)
			.bindValue(this, () => this.variableNames);
		
		this.__sourceModelPathSelection.onChange(() => this.__updateAvailableVariableNames());
	}
			 
	__updateAvailableVariableNames() {		
		this.__variableListSelection.nodeAttr('options', this.availableVariableNames);
	}	

	extendContextMenuActions(actions, parentSelection, treeView) {
		
		actions.push(
			new AddChildAtomTreeViewAction(
				Sample,
				'sample',
				'pickingSample.png',
				parentSelection,
				this,
				treeView
			)
		);

		return actions;
	}	

	runStudy(treeView, monitor) {
		
		this.treeView = treeView;

		var startMessage = 'Executing picking "' + this.name + '"';
		monitor.info(startMessage);		

		var samples = inputGenerator.enabledSamples;
		
		var numberOfSamples = samples.size();
		monitor.info('Number of samples: ' + numberOfSamples);
		
		if (this.isTimeDependentPicking) {			
			monitor.info('Number of time steps: ' + inputGenerator.numberOfTimeSteps);
		}

		if (numberOfSamples > 0) {
			var firstSample = samples[0];
			
			var allAreActive = this.__checkIfAllReferencedVariablesAreActive(firstSample);
			if (allAreActive) {
				this.__doRunStudy(treeView, monitor, inputGenerator, samples);
			}
		}
	}

	__checkIfAllReferencedVariablesAreActive(sample) {

		var variableMap = sample.variableMap;

		var inactiveVariables = [];
		for (var variableName in variableMap) {
			
			var variableModelPath = this.sourceModelPath + '.' + variableName;
			var variable;
			try {
				variable = this.childFromRoot(variableModelPath);
			} catch (error) {
				var message = 'Could not find variable atom "' + variableModelPath + '".';
				Utils.showErrorMessage(message);
				return false;
			}
			
			if (!variable.isEnabled) {
				inactiveVariables.add(variableModelPath);
			}
		}

		if (inactiveVariables.length < 1) {
			return true;
		} else {
			var message = 'Found disabled variable(s):\n' + inactiveVariables.join('\n')
					+ 'Please enable the variable(s) or disable the corresponding range(s).';
			Utils.showErrorMessage(message);
			return false;
		}

	}

	__doRunStudy(treeView, monitor, inputGenerator, samples) {
		
		var numberOfSimulations = samples.length;
		monitor.info('Number of total simulations: ' + numberOfSimulations);
		
		monitor.totalWork = numberOfSimulations;
		
		HashMapModelInput.resetIdCounter();

		var modelInputs = inputGenerator.modelInputs;
		
		this.__prepareResultStructure();
		treeView.refresh();
		
		var studyOutputAtom = this.childFromRoot(this.studyOutputAtomPath);		
		studyOutputAtom.removeAllChildren();
		
		this.__executeTargetModel(treeView, monitor, numberOfSimulations, modelInputs, studyOutputAtom);

		this.__executeRunnableChildren(treeView);
		
		monitor.description = '=>Finished!';
	
		this.__logAndShowSweepEndMessage();
		monitor.info('The picking output is located at ' + studyOutputAtomPath);
		monitor.done();
	}
			

	__executeTargetModel(treeView, monitor, numberOfSimulations, modelInputs, pickingOutputAtom) {
		
		var model = this.__modelToRun;
		var counter = 1;
		var startTime = System.currentTimeMillis();
		for (var modelInput of modelInputs) {
			
			if (!monitor.isCanceled()) {
				this.__logModelStartMessage(counter, startTime, numberOfSimulations);
				
				monitor.description = '=>Simulation #' + counter;
				var subMonitor = monitor.createChild('Executing target', 1);
				
				var modelOutput = model.runModel(modelInput, treeView, subMonitor);				
				modelOutput.name = this.name + 'OutputId' + modelInput.jobId;
				pickingOutputAtom.addChild(modelOutput);
				treeView.refresh();
				counter++;
			}
		}
	}
	
	__prepareResultStructure(monitor) {
		this.__createResultsAtomIfNotExists(monitor);
		this.__createDataAtomIfNotExists(monitor);
		this.__createPickingOutputAtomIfNotExists(monitor);		
	}

	__createPickingOutputAtomIfNotExists(monitor) {
		
		var pickingOutputExists = this.rootHasChild(this.studyOutputAtomPath);
		if (!pickingOutputExists) {
			var pickingOutput = new PickingOutput(this.studyOutputAtomName, this.image);
			var data = this.childFromRoot(this.dataOutputAtomPath);
			data.addChild(pickingOutput);
			monitor.info('Created ' + this.studyOutputAtomPath + ' for picking output.');
		}
	}

	
	addVariable(variableName) {		
		if (this.sourceModelPath) {
			var variablePath = this.sourceModelPath + '.' + variableName;
			var variable = this.childFromRoot(variablePath);
			if (variable) {
				this.__variableList.push(variable);
			}
		}
	}

	createSample(name) {
		return this.createChild(Sample, name);			
	}	
	
	get enabledSamples() {		
		var samples = [];
		for (var child of  this.children) {			
			if (child instanceof Sample) {	
				if (child.isEnabled) {
					samples.push(child);
				}
			}
		}
		return samples;
	}

	get availableVariables(){
		var allEnabledVariables = super.availableVariables;
		return allEnabledVariables.filter(variable => {
			if(variable instanceof DoubleVariable){
				return true;
			}

			if(variable instanceof IntegerVariable){
				return true;
			}

			return false;
		});
		
	}

	get selectedVariables(){

		if(!this.sourceModelPath){
			return [];
		}

		var variables = [];
		for(var variableName of this.variableNames){
			var variablePath = this.sourceModelPath + '.' + variableName;
			var variable = this.childFromRoot(variablePath);
			variables.push(variable);
		}
		return variables;
	}	

	static nameOfTimeVariable() {		
		if(!this.timeVariableModelPath){
			return null;
		}
		var pathItems = this.timeVariableModelPath.split('\.');
		return pathItems[pathItems.length - 1];		
	}

	get pickingVariables() {
		return this.__variables;		
	}

	get range() {
		return this.timeRange;
	}
	
	get timeRange() {		
		try {
			return eval(this.timeRangeString);
		} catch(error){
			throw new Error('Could not parse time range "' + this.timeRangeString + '"');			
		}	
	}
	
	get numberOfTimeSteps() {
		return this.timeRange.length;
	}

	get rangeType() {
		if (this.isTimeDependent) {
			
			var timeVariable = this.childFromRoot(this.timeVariableModelPath);
			
			if(timeVariable instanceof IntegerVariable){
				return ColumnType.integer;
			}
			
			if(timeVariable instanceof DoubleVariable){
				return ColumnType.double;
			}		

			var message = 'Time variables of type ' + timeVariable.constructor.name + ' are not yet implemented.';
			throw new Error(message);
		} else {
			return null;
		}
	}

}
