import Study from './../study.js';
import AddChildAtomTreeViewAction from './../../core/treeView/addChildAtomTreeViewAction.js';
import Sample from './sample.js';
import DoubleVariable from './../../variable/field/doubleVariable.js';
import IntegerVariable from './../../variable/field/integerVariable.js';
import DoubleRange from './../../variable/range/doubleRange.js';
import IntegerRange from './../../variable/range/integerRange.js';

export default class AbstractSampleStudy extends Study {
	
	constructor(name) {
		super(name);		
		this.variableNames = [];	
		this.__variableListSelection = undefined;
	}

	createVariableSection(page){
		
		var section = page.append('treez-section')
			.label('Variable selection');
		
		var sectionContent = section.append('div');
		
		this.__variableListSelection = sectionContent.append('treez-string-item-list')			
			.nodeAttr('options', this.availableVariableNames)
			.onChange(() => this.variableListChanged())
			.bindValue(this, () => this.variableNames);		
		
	}

	sourceModelPathChanged(){
    	this.__updateAvailableVariableNames();
    }
	
	variableListChanged(){
		//can be overridden by inheriting classes		
	}
			 
	__updateAvailableVariableNames() {
		if(this.__variableListSelection){
			this.__variableListSelection.nodeAttr('options', this.availableVariableNames);
		}		
		
	}	

	extendContextMenuActions(actions, parentSelection, treeView) {
		
		actions.push(
			new AddChildAtomTreeViewAction(
				Sample,
				'sample',
				'sample.png',
				parentSelection,
				this,
				treeView
			)
		);

		return actions;
	}	

	checkIfAllReferencedVariablesAreActive(sample) {

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
		
	addVariable(variableName) {		
		if (this.sourceModelPath) {
			var variablePath = this.sourceModelPath + '.' + variableName;
			var variable = this.childFromRoot(variablePath);
			if (variable) {
				this.__variableList.push(variable);
			}
		}
	}
	
	executeTargetModel(treeView, monitor, numberOfSimulations, modelInputs, outputAtom) {
		
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
				outputAtom.addChild(modelOutput);
				treeView.refresh();
				counter++;
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

	
	get variables() {
		return this.__variables;		
	}	

}
