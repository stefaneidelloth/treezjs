

export default class VariableMap extends Map {
	
	constructor(keys){
		super();
		for(var key of keys){
			this.set(key, '[]');
		}
	}
	
		
	
}