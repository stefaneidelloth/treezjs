export default class Enum {	
		
	constructor(name){
		this.name = name;		
	}
	
	toString(){
		return this.name;
	}
}

Enum.values =  function(){
	return Object.values(this);
};


Enum.of = function(name){
	for(var type of instance.constructor.values){
		if(type.name === name){
			return type;
		}
	}
	throw new Error('Unknown value "' + name + '"');
}