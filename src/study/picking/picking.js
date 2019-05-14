import AbstractSampleStudy from './../sample/abstractSampleStudy.js';
import PickingOutput from './pickingOutput.js';
import PickingModelInputGenerator from './pickingModelInputGenerator.js';
import AddChildAtomTreeViewAction from './../../core/treeview/addChildAtomTreeViewAction.js';
import Sample from './../sample/sample.js';
import DoubleVariable from './../../variable/field/doubleVariable.js';
import IntegerVariable from './../../variable/field/integerVariable.js';
import DoubleRange from './../../variable/range/doubleRange.js';
import IntegerRange from './../../variable/range/integerRange.js';

export default class Picking extends AbstractSampleStudy {
	
	constructor(name) {
		super(name);
		this.image = 'picking.png';		
		
		// True if the variable values depends on a "time parameter". Each picking variable will then be specified with an
		// array of values.
		this.isTimeDependent = false;

		//The model path of the variable that represents the time. The variable values may be of type Integer or Double.
		this.timeVariableModelPath = undefined;
		
		this.timeRangeString = '[]';				
	
		this.__timeRangeAtom = undefined;
		
		this.inputGenerator = new PickingModelInputGenerator(this);			
	}

	createComponentControl(tabFolder){ 
		super.createComponentControl(tabFolder);		
		this.__createTimeDependentSection(this.__page);		
		this.createVariableSection(this.__page);		
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
			
			var allAreActive = this.checkIfAllReferencedVariablesAreActive(firstSample);
			if (allAreActive) {
				this.__doRunStudy(treeView, monitor, inputGenerator, samples);
			}
		}
	}
	
	__doRunStudy(treeView, monitor, inputGenerator, samples) {
		
		var numberOfSimulations = samples.length;
		monitor.info('Number of total simulations: ' + numberOfSimulations);
		
		monitor.totalWork = numberOfSimulations;
		
		HashMapModelInput.resetIdCounter();

		var modelInputs = inputGenerator.modelInputs;
		
		this.prepareResultStructure();
		treeView.refresh();
		
		var studyOutputAtom = this.childFromRoot(this.studyOutputAtomPath);		
		studyOutputAtom.removeAllChildren();
		
		this.executeTargetModel(treeView, monitor, numberOfSimulations, modelInputs, studyOutputAtom);

		this.__executeRunnableChildren(treeView);
		
		monitor.description = '=>Finished!';
	
		this.__logAndShowSweepEndMessage();
		monitor.info('The picking output is located at ' + studyOutputAtomPath);
		monitor.done();
	}
	
	createStudyOutputAtom(name){
		return new PickingOutput(name);
	}	
		
	static nameOfTimeVariable() {		
		if(!this.timeVariableModelPath){
			return null;
		}
		var pathItems = this.timeVariableModelPath.split('\.');
		return pathItems[pathItems.length - 1];		
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
