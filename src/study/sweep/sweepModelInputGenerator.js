import VariableRange from './../../variable/range/variableRange.js';
import ModelInput from './../../model/input/modelInput.js';

export default class SweepModelInputGenerator {

	constructor(study) {
		this.__study = study;
	}	

	exportStudyInfoToTextFile(filePath) {
		
		var studyInfo = '---------- StudyInfo ----------\r\n\r\n' + //
				'#Total number of simulations:\r\n' + this.numberOfSimulations + '\r\n\r\n' + //
				'#Variable model paths and values:\r\n\r\n';
		
		this.enabledRanges.forEach(range => {
			if(range.values.length>0){
				var variablePath = range.variablePath;
				studyInfo += variablePath + '\r\n';

				range.values.forEach(value=>{
					studyInfo += '' + value + '\r\n';
				});

				studyInfo += '\r\n';
			} else {
				var variablePath = range.variablePath;
				studyInfo += variablePath + ' (warning: range is empty: [])\r\n';
			}
			
		});		

		studyInfo += '---------- JobInfo ------------\r\n\r\n';
		studyInfo += '\r\n';

		for (var modelInput of this.modelInputs) {
			var jobId = modelInput.jobId;
			studyInfo += 'jobId: ' + jobId + '\r\n';
			var variablePaths = modelInput.all;
			for (var variablePath of variablePaths) {
				var value = modelInput.get(variablePath);
				studyInfo += variablePath + ': ' + value + '\r\n';				
			}
			studyInfo += '\r\n';
		}

		try {
			window.treezTerminal.writeTextFile(filePath, studyInfo);
		} catch (error) {
			var message = 'Could not export study info to "' + filePath + '". Maybe the path is not valid.';
			console.error(message, error);
		}
	}

	async fillSqLiteStudyInfo(connectionString, tableName) {
		for (var range of this.enabledRanges){
			var variablePath = range.variablePath;
			for (var value of range.values){
				var query = "INSERT INTO '" + tableName + "' VALUES(null, '" + this.studyId + "', '" + variablePath + "','" + value + "')";
				await window.treezTerminal.sqLiteQuery(connectionString, query, false)
				.catch((error)=>{
					console.log(error);
				});
			}			
		}		
	}

	async fillMySqlStudyInfo(connectionString, schemaName, tableName) {		
		for (var range of this.enabledRanges){
			var variablePath = range.variablePath;
			for (var value of range.values){
				var query = 'INSERT INTO `' + schemaName + '.' + tableName + '` VALUES(null, "' + this.studyId + '", "' + variablePath + '","' + value + '")';
				await window.treezTerminal.mySqlQuery(connectionString, query, false)
				.catch((error)=>{
					console.log(error);
				});
			}			
		}		
	}	
	
	__createModelInputs(variableRanges) {
		var self=this;
		
		var totalNumberOfJobs = this.__numberOfSimulations(variableRanges);
		
		var modelInputs = [];
		if (variableRanges.length > 0) {
			var firstRange = variableRanges[0];
			var remainingRanges = variableRanges.slice(1, variableRanges.length);
			
			var variableModelPath = firstRange.variablePath;			
			
			firstRange.values.forEach(value=>{
				//create model input that initially contains the current value
				
				var inputBlueprint = self.__createModelInputBlueprint(variableModelPath, this.studyId, this.studyDescription, value, totalNumberOfJobs);

				//copy and extended the model input blueprint, using the remaining variable values
				
				var modelInputsWithCurrentValue = self.__extendModelInputs(inputBlueprint, remainingRanges);
				modelInputs = modelInputs.concat(modelInputsWithCurrentValue);

			});
			
		}

		var counter = 1;
		for(var modelInput of modelInputs){
			modelInput.jobId = counter;
			counter++;
		}
		return modelInputs;
	}

	__extendModelInputs(inputBlueprint, variableRanges) {
		
		var self=this;
		var modelInputs = [];
		
		//the model input blueprint needs to be duplicated and extended using the remaining variable ranges
		var firstRange = variableRanges[0];
		if(firstRange){
			var variableModelPath = firstRange.variablePath;
			var values = firstRange.values;
			var remainingRanges = variableRanges.slice(1, variableRanges.length);
			for(var value of values){		
			
				var modelInput = inputBlueprint.copy();

				//add current quantity
				modelInput.set(variableModelPath, value);

				if(remainingRanges.length>0){
					//copy and extend with remaining variable ranges
					var modelInputsWithCurrentQuantities = self.__extendModelInputs(modelInput, remainingRanges);
					modelInputs = modelInputs.concat(modelInputsWithCurrentQuantities);	
				} else {
					modelInputs.push(modelInput);
				}	
			}	
			return modelInputs;					
		} else {
          return [inputBlueprint];
		}
		

			
			
	}
	
	__createModelInputBlueprint(variableModelPath, studyId, studyDescription, value, totalNumberOfJobs) {
		var studyModelPath = this.__study.treePath;
		var dummyJobId = -1;
		var inputBlueprint = new ModelInput(studyModelPath, studyId, studyDescription, dummyJobId, totalNumberOfJobs);
		inputBlueprint.set(variableModelPath, value);
		return inputBlueprint;
	}
	
	__numberOfSimulations(variableRanges){
		
		if(variableRanges.length < 1){
			return 0;
		}
		
		var numberOfSimulations = 1;
		
		for(var range of variableRanges){
			numberOfSimulations = numberOfSimulations * range.values.length;
		}		
		return numberOfSimulations;		
	}		
	
	get enabledRanges() {
		var variableRanges = [];

		this.__study.children.forEach(child=>{
			var isVariableRange = child instanceof VariableRange;
			if (isVariableRange) {				
				if (child.isEnabled) {
					
					//check if corresponding variable is also enabled					
					var variable;
					try {
						variable = this.__study.childFromRoot(child.variablePath);
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
	
	get numberOfEnabledRanges(){
		return this.enabledRanges.length;
	}
	
	get modelInputs() {		
		return this.__createModelInputs(this.enabledRanges);
	}

	get numberOfSimulations() {		
		return this.__numberOfSimulations(this.enabledRanges);
	}

	get studyId(){
		return this.__study.id;
	}

	get studyDescription(){
		return this.__study.description;
	}

}
