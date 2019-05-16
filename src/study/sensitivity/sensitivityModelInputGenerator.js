import SweepModelInputGenerator from './../sweep/sweepModelInputGenerator.js';
import SensitivityValueFactory from './sensitivityValueFactory.js';
import VariableMap from './../../variable/variableMap.js';

export default class SensitivityModelInputGenerator extends SweepModelInputGenerator {

	constructor(study) {
		super(study);		
	}
	
	get enabledRanges() {		
		
		var variables = this.__study.selectedVariables;
		
		var variableMap = new VariableMap(variables);
		
		SensitivityValueFactory.updateVariableInfos(variableMap, this.__study);
		
		var variableRanges = [];
				
		for(var [variable, info] of variableMap){
						
			var values = eval(info);
			
			var mockedVariableRange = {
					variablePath: variable.treePath,
					values: values,
					parent: this.__study
			};
			
			variableRanges.push(mockedVariableRange);
		}	
		
		return variableRanges;
	}	

}
