




export default class ModelInput {
	
	static nextId; //initial value is defined below class definition

	constructor(studyModelPath, studyId, studyDescription, jobId, totalNumberOfJobs) {
		this.studyModelPath = studyModelPath;
		this.studyId = studyId;
		this.studyDescription = studyDescription;
		
		this.jobId = jobId;
		
		this.totalNumberOfJobs = totalNumberOfJobs;
		
		this.__variableModelPathToValueMap = {};
		
	}
	
	static getNextId() {
		var currentNextId = ModelInput.nextId;
		 ModelInput.nextId++;
		return currentNextId;
	}

	static resetIdCounter() {
		ModelInput.nextId = 1;
	}
	
	

	increaseJobId() {
		this.jobId = ModelInput.getNextId();
	}

	copy() {
		var jobId = ModelInput.getNextId();
		var modelInput = new ModelInput(this.studyModelPath, this.studyId, this.studyDescription, jobId, this.totalNumberOfJobs);
		modelInput.__variableModelPathToValueMap = this.__copyMap(this.__variableModelPathToValueMap);
		return modelInput;
	}

	add(variableModelPath, value) {
		this.__variableModelPathToValueMap[variableModelPath] = value;
	}

	contains(variableModelPath) {
		return variableModelPath in this.__variableModelPathToValueMap;
	}

	
	get(variableModelPath) {
		return this.__variableModelPathToValueMap[variableModelPath];
	}

	getAll() {
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

ModelInput.nextId = 1;
