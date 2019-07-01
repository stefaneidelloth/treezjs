import VariableRange from './../../variable/range/variableRange.js';
import ModelInput from './../../model/input/modelInput.js';

export default class SweepModelInputGenerator {

	constructor(study) {
		this.__study = study;
	}	

	exportStudyInfoToTextFile(filePath) {
		
		var studyInfo = '---------- StudyInfo ----------\r\n\r\n' + //
				'Total number of simulations:\r\n' + this.numberOfSimulations + '\r\n\r\n' + //
				'Variable model paths and values:\r\n\r\n';
		
		this.enabledRanges.forEach(range => {
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
			var message = 'Could not export study info to "' + filePath + '". Maybe the path is not valid.';
			console.error(message);
		}
	}

	fillStudyInfo(database, tableName, studyId) {	
		this.enabledRanges.forEach(range=>{
			var variablePath = range.sourceVariableModelPath;
			range.values.forEach(value=>{
				var query = 'INSERT INTO `' + tableName + '` VALUES(null, "' + studyId + '", "' + variablePath + '","' + value + '")';
				database.execute(query);
			});
			
		});
		
	}

	fillStudyInfoForSchema(database, schemaName, tableName, studyId) {		
		this.enabledRanges.forEach(range=>{
			var variablePath = range.sourceVariableModelPath;
			range.values.forEach(value=>{
				var query = 'INSERT INTO `' + schemaName + '.' + tableName + '` VALUES(null, "' + studyId + '", "' + variablePath + '","' + value + '")';
				database.execute(query);
			});
			
		});		
	}	
	
	__createModelInputs(variableRanges) {
		var self=this;
		
		var totalNumberOfJobs = this.__numberOfSimulations(variableRanges);
		
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
				var initialInput = self.__createInitialModelInput(variableModelPath, studyId, studyDescription, value, dummyJobId, totalNumberOfJobs);

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
				modelInput.set(variableModelPath, value);
				//copy and extend with remaining variable ranges
				var modelInputsWithCurrentQuantities = self.__extendModelInputs(modelInput, remainingRanges);
				modelInputs = modelInputs.concat(modelInputsWithCurrentQuantities);
				counter++;				
			});						
			return modelInputs;
		}
	}
	
	__createInitialModelInput(variableModelPath, studyId, studyDescription, value, jobId, totalNumberOfJobs) {
		var studyModelPath = this.__study.treePath;
		var initialInput = new ModelInput(studyModelPath, studyId, studyDescription, jobId, totalNumberOfJobs);
		initialInput.set(variableModelPath, value);
		return initialInput;
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

}
