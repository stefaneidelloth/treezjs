import ModelInput from './../../model/input/modelInput.js';

export default class PickingModelInputGenerator {
	
	constructor(picking) {
		this.__picking = picking;
	}

	get modelInputs() {

		var modelInputs = [];

		var samples = this.enabledSamples;

		if (samples.length > 0) {

			var picking = this.__picking;

			var studyId = picking.id;
			var studyDescription = picking.description;
			var sourceModelPath = picking.sourceModelPath;	
			var totalNumberOfJobs = samples.length;		

			if (picking.isTimeDependent) {
				var timeVariablePath = picking.timeVariableModelPath;
				var timeRange = picking.timeRange;
				for (var timeIndex = 0; timeIndex < timeRange.length; timeIndex++) {
					var timeValue = timeRange[timeIndex];
					var jobId = 1;

					for (var sample of samples) {
						var modelInput = this.__createModelInputFromSampleForTimeStep(								
								sourceModelPath, 
								studyId, 
								studyDescription, 
								sample, 
								jobId, 
								totalNumberOfJobs,
								timeVariablePath,
								timeIndex, 
								timeValue
						);
						modelInputs.push(modelInput);
						jobId++;
					}
				}

			} else {
				var jobId = 1;
				for (var sample of samples) {
					var modelInput = this.__createModelInputFromSample(
						sourceModelPath, 
						studyId, 
						studyDescription, 
						sample,
						jobId, 
						totalNumberOfJobs
					);
					modelInputs.push(modelInput);
					jobId++;
				}
			}
		}

		return modelInputs;
	}

	

	exportStudyInfoToTextFile(filePath) {

		var samples = this.enabledSamples;
		
		var sourceModelPath = picking.sourceModelPath;

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
	
	__createModelInputFromSample(sourceModelPath, studyId, studyDescription, sample, jobId, totalNumberOfJobs) {		
		var modelInput = new ModelInput(this.__picking.treePath, studyId, studyDescription, jobId, totalNumberOfJobs);
		var variableMap = sample.variableMap;
		for (var variableName in variableMap) {
			var variable = variableMap[variableName];
			var variablePath = sourceModelPath + '.' + variableName;			
			modelInput.add(variablePath, variable.value);
		}
		return modelInput;
	}

	__createModelInputFromSampleForTimeStep(
			sourceModelPath,
			studyId,
			studyDescription,
			sample,
			jobId, 
			totalNumberOfJobs,
			timeVariablePath,
			timeIndex,
			timeValue
	) {		
		var modelInput = new ModelInput(this.__picking.treePath, studyId, studyDescription, jobId, totalNumberOfJobs);
		
		modelInput.add(timeVariablePath, timeValue);
	
		var variableMap = sample.variableMap;
		for (var variableName in variableMap) {
			var range = variableMap[variableName];
			var variablePath = sourceModelPath + '.' + variableName;
		
			var list = range.values;
			try {
				var value = list[timeIndex];
				modelInput.add(variablePath, value);
			} catch (error) {
				var message = 'Could not retieve sample value for sample ' + sample.name + '\n' + //
						' and variable "' + variableName + '" at time index ' + timeIndex + //
						'. The length of the list is ' + list.length + '.';
				throw new Error(message, exception);
			}
		}
		return modelInput;
	}

	get numberOfSimulations() {
		return this.enabledSamples.length;
	}
	
	get enabledSamples() {
		return this.__picking.enabledSamples;		
	}

	get numberOfTimeSteps() {
		return this.__picking.numberOfTimeSteps;
	}	

}
