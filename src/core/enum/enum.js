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


Enum.forName = function(name){
	for(var type of this.values()){
		if(type.name === name){
			return type;
		}
	}
	throw new Error('Unknown value "' + name + '"');
}