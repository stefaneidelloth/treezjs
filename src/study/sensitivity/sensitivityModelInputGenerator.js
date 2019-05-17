import SweepModelInputGenerator from './../sweep/sweepModelInputGenerator.js';
import SensitivityValueFactory from './sensitivityValueFactory.js';
import VariableMap from './../../variable/variableMap.js';
import ModelInput from './../../model/input/modelInput.js';

export default class SensitivityModelInputGenerator extends SweepModelInputGenerator  {

	constructor(study) {
		super(study);
	}	
	
	__createModelInputs(variableRanges) {
		var self=this;
		
		var workingPointMap = new Map();
		for(var variableRange of variableRanges){
			var variablePath = variableRange.variablePath;
			var variable = this.__study.childFromRoot(variablePath);
			workingPointMap.set(variable, variable.value);
		}		
		
		var totalNumberOfSimulations = this.__numberOfSimulations(variableRanges);
		
		var modelInputs = [];
		var workingPointInput = self.__createWorkingPointModelInput(workingPointMap, totalNumberOfSimulations);
		modelInputs.push(workingPointInput);		
		
		if (variableRanges.length > 0) {
			
			for(var variableRange of variableRanges){
				var variablePath = variableRange.variablePath;
				var variable = this.__study.childFromRoot(variablePath);
				var workingPointValue = workingPointMap.get(variable);
				
				for(var value of variableRange.values){
					
					if(value === workingPointValue){
						continue;
					}
					
					var modelInput = this.__createdAdaptedModelInput(workingPointInput, variable.treePath, value);
					modelInputs.push(modelInput);					
				}			
			}			
		}
		return modelInputs;
	}
	
	__numberOfSimulations(variableRanges){
		
		if(variableRanges.length < 1){
			return 0;
		}
		
		var firstRange = variableRanges[0];
		var numberOfExtraSampleValues = firstRange.values.length-1;
		
		return 1 + variableRanges.length * numberOfExtraSampleValues;			
	}
	
	__createWorkingPointModelInput(workingPointMap, totalNumberOfJobs) {
		var studyModelPath = this.__study.treePath;
		var study = this.__study;
		var modelInput = new ModelInput(studyModelPath, study.id, study.description, 1, totalNumberOfJobs);
		for(var [variable, value] of workingPointMap){
			modelInput.set(variable.treePath, value);
		}		
		return modelInput;
	}	
	
	__createdAdaptedModelInput(workingPointInput, variableModelPath, value){
		var modelInput = workingPointInput.copy();
		modelInput.set(variableModelPath, value);
		return modelInput;
	}	
	
	get enabledRanges() {		
		
		var variables = this.__study.selectedVariables;
		
		var variableMap = new VariableMap(variables);
		
		SensitivityValueFactory.updateVariableInfos(variableMap, this.__study);
		
		var variableRanges = [];
				
		for(var [variable, info] of variableMap){
						
			var values = eval(info);
			
			var mockedVariableRange = {
					name: variable.name,
					variablePath: variable.treePath,
					values: values,
					parent: this.__study
			};
			
			variableRanges.push(mockedVariableRange);
		}	
		
		return variableRanges;
	}	
	
	get numberOfEnabledRanges(){
		return this.enabledRanges.length;
	}
	
	get modelInputs() {		
		return this.__createModelInputs(this.enabledRanges);
	}

	get numberOfSimulations() {		
		return this.__numberOfSimulations(this.enabledRanges);
	}

}
