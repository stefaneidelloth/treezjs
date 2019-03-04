export default class SweepModelInputGenerator {

	constructor(sweep) {
		this.sweep = sweep;
	}

	
	createModelInputs() {
		var enabledVariableRanges = this.__getEnabledVariableRanges();
		return this.__createModelInputs(enabledVariableRanges);
	}

	getNumberOfSimulations() {
		var enabledVariableRanges = this.__getEnabledVariableRanges();
		return this.__getNumberOfSimulations(enabledVariableRanges);
	}

	exportStudyInfoToTextFile(filePath) {

		var numberOfSimulations = getNumberOfSimulations();

		var studyInfo = '---------- SweepInfo ----------\r\n\r\n' + //
				'Total number of simulations:\r\n' + numberOfSimulations + '\r\n\r\n' + //
				'Variable model paths and values:\r\n\r\n';

		var variableRanges = this.__getEnabledVariableRanges();
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
		var variableRanges = this.__getEnabledVariableRanges();
		variableRanges.forEach(range=>{
			var variablePath = range.sourceVariableModelPath;
			range.values.forEach(value=>{
				var query = 'INSERT INTO `' + tableName + '` VALUES(null, "' + studyId + '", "' + variablePath + '","' + value + '")';
				database.execute(query);
			});
			
		});
		
	}

	fillStudyInfoForSchema(database, schemaName, tableName, studyId) {
		var variableRanges = this.__getEnabledVariableRanges();
		variableRanges.forEach(range=>{
			var variablePath = range.sourceVariableModelPath;
			range.values.forEach(value=>{
				var query = 'INSERT INTO `' + schemaName + '.' + tableName + '` VALUES(null, "' + studyId + '", "' + variablePath + '","' + value + '")';
				database.execute(query);
			});
			
		});		
	}
	
	__getEnabledVariableRanges() {
		var variableRanges = [];
		sweep.children.forEach(child=>{
			var isVariableRange = child instanceof VariableRange;
			if (isVariableRange) {				
				if (child.isEnabled) {
					
					//check if corresponding variable is also enabled
					var variableModelPath = child.sourceVariableModelPath;
					var variable;
					try {
						variable = this.getChildFromRoot(variableModelPath);
					} catch (error) {
						var message = 'Could not find variable atom "' + variableModelPath + '".';
						throw new Error(message);
					}
					
					if (variable.isEnabled) {
						variableRanges.add(variableRange);
					} else {
						console.warn('Corresponding variable is not enabled for variable range ' + child.name);
					}					
				}
			}
		});		
		
		return variableRanges;
	}
		
	__getNumberOfSimulations(variableRanges) {
	
		var numberOfSimulations = 1;		
		var hasAtLeastOneSimulation = false;
		
		variableRanges.forEach(variableRange=>{			
			var numberOfValues = variableRange.values.size();
			if (numberOfValues > 0) {
				atLeastOneSimulation = true;
				numberOfSimulations *= numberOfValues;
			}
		});

		return hasAtLeastOneSimulation
			?numberOfSimulations
			:0;			
	}

	
	__createModelInputs(variableRanges) {
		var self=this;
		var modelInputs = [];
		if (variableRanges.length > 0) {
			var firstRange = variableRanges[0];
			var remainingRanges = variableRanges.slice(1, variableRanges.length);
			
			var variableModelPath = firstRange.sourceVariableModelPath;
			
			var study = firstRange.parentAtom;
			var studyId = study.getId();
			var studyDescription = study.getDescription();

			firstRange.values.forEach(value=>{
				//create model input that initially contains the current value
				var initialInput = self.__createInitialModelInput(variableModelPath, studyId, studyDescription, value);

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

		var isLastEntry = variableRanges.lengthh === 0;
		if (isLastEntry) {
			//the model input is already finished and can be returned as a single model input
			modelInputs.add(initialInput);
			return modelInputs;
		} else {
			//the initial model input needs to be copied and extended using the remaining variable ranges
			var firstRange = variableRanges[0];
			var variableModelPath = firstRange.sourceVariableModelPath;
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

	
	__createInitialModelInput(variableModelPath, studyId, studyDescription, value) {
		var sweepModelPath = sweep.getTreePath();
		var initialInput = new ModelInput(sweepModelPath, studyId, studyDescription);
		initialInput.add(variableModelPath, value);
		return initialInput;
	}
	
	

	//#end region

}
