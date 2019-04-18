import Utils from './../utils/utils.js';

export default class VariableNameRegistry {

	static __instance;

	static  get instance() {
		if (!VariableNameRegistry.__instance) {
			VariableNameRegistry.__instance = new VariableNameRegistry();
		}
		return VariableNameRegistry.__instance;
	}

	static  reset() {
		VariableNameRegistry.__instance = undefined;
	}

	constructor() {
		this.__variableNames = new Set();
	}
	
	static newVariableName(atom){
		var instance = VariableNameRegistry.instance;
		return instance.newVariableName(atom);
	}

    newVariableName(atom) {    	  	
	
		var name = this.__convertNameThatMightIncludeSpacesToCamelCase(atom.name);

		if (this.__contains(name)) {
			//add class name
			name += atom.constructor.name;
		}

		if (this.__contains(name)) {
			//add name of parent atom
			
			if (atom.parent) {
				var parentName = atom.parent.name;
				name += 'In' + Utils.firstToUpperCase(parentName);
			}
		}

		if (this.__contains(name)) {
			//add increasing numbers
			var counter = 1;
			var numberName = name + counter;
			while (this.__contains(numberName)) {
				counter++;
				numberName = name + counter;
			}
			name = numberName;
		}

		this.__register(name);
		return name;
	}

	__convertNameThatMightIncludeSpacesToCamelCase(name){
		var parts = name.trim().split(' ');
		parts[0] = Utils.firstToLowerCase(parts[0]);
		for(var index = 1; index < parts.length; index++){
			parts[index] = Utils.firstToUpperCase(parts[index]);
		}
		return parts.join('');
	}	
    
    __contains(variableName) {
		return this.__variableNames.has(variableName);	
	}    
  
	__register(variableName) {
		var alreadyExists = this.__contains(variableName);
		if (alreadyExists) {
			throw new Error('The variable name ' + variableName + ' already exists');
		}
		this.__variableNames.add(variableName);
	}

}
