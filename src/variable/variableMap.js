import Variable from './variable.js';

export default class VariableMap extends Map {
	
	constructor(keys){
		super();
		
		for(var key of keys){
			if(key === undefined){
				throw new Error('Keys must not be undefined');
			}
			this.set(key, '[]');
		}		
		
	}
	
	set(key, value){		
		if(!(key instanceof Variable)){
			throw new Error('Key must be a variable.');
		}
		super.set(key, value);
	}	
		
	
}