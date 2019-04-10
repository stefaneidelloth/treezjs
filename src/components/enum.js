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
	}
	
	toString(){
		return this.name;
	}
}