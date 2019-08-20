export default class ModelInput {

	constructor(studyModelPath, studyId, studyDescription, jobId, totalNumberOfJobs) {
		this.studyModelPath = studyModelPath;
		this.studyId = studyId;
		this.studyDescription = studyDescription;
		
		this.jobId = jobId;
		
		this.totalNumberOfJobs = totalNumberOfJobs;
		
		this.__variableModelPathToValueMap = {};		
	}	

	copy() {		
		var modelInput = new ModelInput(this.studyModelPath, this.studyId, this.studyDescription, this.jobId, this.totalNumberOfJobs);
		modelInput.__variableModelPathToValueMap = this.__copyMap(this.__variableModelPathToValueMap);
		return modelInput;
	}

	set(variableModelPath, value) {
		this.__variableModelPathToValueMap[variableModelPath] = value;
	}

	contains(variableModelPath) {
		return variableModelPath in this.__variableModelPathToValueMap;
	}

	
	get(variableModelPath) {
		return this.__variableModelPathToValueMap[variableModelPath];
	}

	get all() {
		return Object.keys(this.__variableModelPathToValueMap);
	}	

	__copyMap(mapToCopy) {
		var map = {};
		
		for(var key in mapToCopy){
			
			var value = mapToCopy[key];
			
			var copiedValue = value.copy
				?value.copy()
				:value;
				
			map[key] = copiedValue;
		};
		return map;		
	}

}


