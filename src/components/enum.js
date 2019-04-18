
export default class Enum {

	static get values(){
		return Object.values(this);
	}	

	static get names(){
		return this.values.map((value)=>value.name);
	}

	static forName(name){
		for(var type of this.values){
			if(type.name === name){
				return type;
			}
		}
		throw new Error('Unknown value "' + name + '"');
	}
		
	constructor(name){
		this.name = name;
		if(!this.constructor.importLocation){
			this.constructor.importLocation = this.determineImportLocation();
		}						
	}
	
	toString(){
		return this.name;
	}

	determineImportLocation(){
		var stack = new Error().stack;
		var lastLine = stack.split('\n').pop();
		var startIndex = lastLine.indexOf('/src/');
		var endIndex = lastLine.indexOf('.js:') + 3;
		return lastLine.substring(startIndex, endIndex);
	}

}