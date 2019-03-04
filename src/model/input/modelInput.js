




export default class ModelInput {
	
	static nextId; //initial value is defined below class definition

	constructor(studyModelPath, studyId, studyDescription) {
		this.studyModelPath = studyModelPath;
		this.studyId = studyId;
		this.studyDescription = studyDescription;
		
		this.jobId = ModelInput.getNextId();
		
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
	
	static copyMap(mapToCopy) {
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

	increaseJobId() {
		this.jobId = ModelInput.getNextId();
	}

	copy() {
		var modelInput = new ModelInput(this.studyModelPath, this.studyId, this.studyDescription);
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
		return Object.values(this.__variableModelPathToValueMap);
	}	

}

ModelInput.nextId = 1;
