import VariableRange from './../range/variableRange.js';
import ModelInput from './../../model/input/modelInput.js';

export default class SweepModelInputGenerator {

	constructor(sweep) {
		this.sweep = sweep;
	}

	
	createModelInputs() {
		var enabledVariableRanges = this.__getEnabledRanges();
		return this.__createModelInputs(enabledVariableRanges);
	}

	getNumberOfSimulations() {
		var enabledVariableRanges = this.__getEnabledRanges();
		return this.__getNumberOfSimulations(enabledVariableRanges);
	}

	exportStudyInfoToTextFile(filePath) {

		var numberOfSimulations = getNumberOfSimulations();

		var studyInfo = '---------- SweepInfo ----------\r\n\r\n' + //
				'Total number of simulations:\r\n' + numberOfSimulations + '\r\n\r\n' + //
				'Variable model paths and values:\r\n\r\n';

		var variableRanges = this.__getEnabledRanges();
		variableRanges.forEach(range=>{
			var variablePath = range.sourceVariableModelPath;
			studyInfo += variablePath + '\r\n';
			
			range.values.forEach(value=>{
				studyInfo += '' + value + '\r\n';
			});
			
			studyInfo += '\r\n';
		});		

		try {
			window.treezTerminal.writeFile(filePath, studyInfo);
		} catch (error) {
			var message = 'Could not export study info to "' + filePath
					+ '". Maybe the path is not valid.';
			console.error(message);
		}
	}

	fillStudyInfo(database, tableName, studyId) {
		var variableRanges = this.__getEnabledRanges();
		variableRanges.forEach(range=>{
			var variablePath = range.sourceVariableModelPath;
			range.values.forEach(value=>{
				var query = 'INSERT INTO `' + tableName + '` VALUES(null, "' + studyId + '", "' + variablePath + '","' + value + '")';
				database.execute(query);
			});
			
		});
		
	}

	fillStudyInfoForSchema(database, schemaName, tableName, studyId) {
		var variableRanges = this.__getEnabledRanges();
		variableRanges.forEach(range=>{
			var variablePath = range.sourceVariableModelPath;
			range.values.forEach(value=>{
				var query = 'INSERT INTO `' + schemaName + '.' + tableName + '` VALUES(null, "' + studyId + '", "' + variablePath + '","' + value + '")';
				database.execute(query);
			});
			
		});		
	}
	
	getNumberOfEnabledRanges(){
		return this.__getEnabledRanges().length;
	}
	
	__getEnabledRanges() {
		var variableRanges = [];

		this.sweep.children.forEach(child=>{
			var isVariableRange = child instanceof VariableRange;
			if (isVariableRange) {				
				if (child.isEnabled) {
					
					//check if corresponding variable is also enabled					
					var variable;
					try {
						variable = this.sweep.childFromRoot(child.variablePath);
					} catch (error) {
						var message = 'Could not find variable atom "' + child.variablePath + '".';
						throw new Error(message + error);
					}
					
					if (variable.isEnabled) {
						variableRanges.push(child);
					} else {
						console.warn('Corresponding variable is not enabled for variable range ' + child.name);
					}					
				}
			}
		});		
		
		return variableRanges;
	}
	
	__createModelInputs(variableRanges) {
		var self=this;
		var modelInputs = [];
		if (variableRanges.length > 0) {
			var firstRange = variableRanges[0];
			var remainingRanges = variableRanges.slice(1, variableRanges.length);
			
			var variableModelPath = firstRange.variablePath;
			
			var study = firstRange.parent;
			var studyId = study.id;
			var studyDescription = study.description;

			firstRange.values.forEach(value=>{
				//create model input that initially contains the current value
				var dummyJobId = -1;
				var initialInput = self.__createInitialModelInput(variableModelPath, studyId, studyDescription, value, dummyJobId);

				//copy and extended the initial model input using the remaining variable values
				var modelInputsWithCurrentValue = self.__extendModelInputs(initialInput, remainingRanges);
				modelInputs = modelInputs.concat(modelInputsWithCurrentValue);
			});
			
		}
		return modelInputs;

	}
	
	

	__extendModelInputs(initialInput, variableRanges) {
		
		var self=this;
		var modelInputs = [];

		var isLastEntry = variableRanges.length === 0;
		if (isLastEntry) {
			modelInputs.push(initialInput.copy());
			return modelInputs;
		} else {
			//the initial model input needs to be duplicated and extended using the remaining variable ranges
			var firstRange = variableRanges[0];
			var variableModelPath = firstRange.variablePath;
			var values = firstRange.values;
			var remainingRanges = variableRanges.slice(1, variableRanges.length);

			var counter = 1;
			values.forEach(value=>{
				//copy initial model input (automatically gets next jobId)
				var modelInput = initialInput.copy();

				//add current quantity
				modelInput.add(variableModelPath, value);
				//copy and extend with remaining variable ranges
				var modelInputsWithCurrentQuantities = self.__extendModelInputs(modelInput, remainingRanges);
				modelInputs = modelInputs.concat(modelInputsWithCurrentQuantities);
				counter++;				
			});
						
			return modelInputs;
		}

	}

	
	__createInitialModelInput(variableModelPath, studyId, studyDescription, value, jobId) {
		var sweepModelPath = this.sweep.treePath;
		var initialInput = new ModelInput(sweepModelPath, studyId, studyDescription, jobId);
		initialInput.add(variableModelPath, value);
		return initialInput;
	}

	__getNumberOfSimulations(variableRanges) {
	
		var numberOfSimulations = 1;		
		var hasAtLeastOneSimulation = false;
		
		variableRanges.forEach(variableRange=>{			
			var numberOfValues = variableRange.values.length;
			if (numberOfValues > 0) {
				hasAtLeastOneSimulation = true;
				numberOfSimulations *= numberOfValues;
			}
		});

		return hasAtLeastOneSimulation
			?numberOfSimulations
			:0;			
	}
	
	

	//#end region

}
