
export default class SensitivityModelInputGenerator {

	constructor(sensitivity) {
		this.__sensitivity = sensitivity;
	}
	
	get modelInputs() {

		var modelInputs = [];

		var samples = this.__enabledSamples;

		if (!samples.isEmpty()) {

			var sensitivity = this.__sensitivity;
			
			var studyId = sensitivity.id;
			var studyDescription = sensitivity.description;
			var sourceModelPath = sensitivity.sourceModelPath;			
			
			for (var sample of samples) {
				//TODO
				var modelInput = createModelInputFromSample(sourceModelPath, studyId, studyDescription, sample);
				modelInputs.add(modelInput);
			}			
		}

		return modelInputs;
	}

	get __numberOfSimulations() {
		return this.__enabledSamples.length;
	}

	exportStudyInfoToTextFile(filePath) {

		var samples = this.enabledSamples;
		
		var sourceModelPath = this.__sensitivity.sourceModelPath;

		var studyInfo = '---------- PickingInfo ----------\n\n' + //
				'Total number of simulations:\n' + numberOfSimulations + '\n\n' + //
				'Source model path:\n' + sourceModelPath + '\n\n' + //
				'Variable names and values:\n\n';

		for (var sample of samples) {
			studyInfo += '== Sample "' + sample.getName() + '" ===\n';

			var variableMap = sample.variableMap;
			for (var variableName in variableMap) {
				var variable = variableMap[variableName];			
				studyInfo += variableName + ': ' + variable.value + '\n';
			}
			studyInfo += '\n';
		}
		
		try {
			window.treezTerminal.writeFile(filePath, studyInfo);
		} catch (error) {
			var message = 'Could not export study info to "' + filePath + '". Maybe the path is not valid.';
			console.error(message);
		}	
	}

	fillStudyInfo(database, tableName, studyId) {
		var samples = this.enabledSamples;
		var uniqueVariableValues = this.__collectUniqueVariableValues(samples);
		for (var variableName in uniqueVariableValues) {			
			var variableValues = uniqueVariableValues[variableName];
			for (var variableValue of variableValues) {
				var query = "INSERT INTO '" + tableName + "' VALUES(null, '" + studyId + "', '" + variableName
						+ "','" + variableValue + "')";
				database.execute(query);
			}
		}
	}

	fillStudyInfoWithSchema(database, schemaName, tableName, studyId) {
		var samples = this.enabledSamples;
		var uniqueVariableValues = this.__collectUniqueVariableValues(samples);
		for (var variableName in uniqueVariableValues) {			
			var variableValues = uniqueVariableValues[variableName];
			for (var variableValue of variableValues) {
				var query = "INSERT INTO `" + schemaName + "`.`" + tableName + "` VALUES(null, '" + studyId + "', '"
						+ variableName + "','" + variableValue + "')";
				database.execute(query);
			}
		}
	}

	__collectUniqueVariableValues(samples) {
		var uniqueVariableValues = {};
		for (var sample of samples) {

			var variableMap = sample.variableMap;
			for (var variableName in variableMap) {
				
				var variable = variableMap[variableName];
				var variableValue = variable.value;
				if (!variableName in uniqueVariableValues) {
					uniqueVariableValues[variableName] = new Set();
				}
				var variableValues = uniqueVariableValues[variableName];
				variableValues.add(variableValue);
			}
		}
		return uniqueVariableValues;
	}	

	get numberOfSimulations() {
		return this.enabledSamples.length;
	}
	
	get enabledSamples() {
		return this.__sensitivity.enabledSamples;		
	}

	get numberOfTimeSteps() {
		return this.__sensitivity.numberOfTimeSteps;
	}	

	

}
