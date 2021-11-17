import Variable from './../variable.js';

export default class AbstractPathVariable extends Variable {
	
	constructor(name, value){
		super(name, value);		
		
		this.__pathMapProvider = undefined;
		this.__pathSelection = undefined;
	}
	
	set pathMapProvider(pathMapProvider){
		this.__pathMapProvider = pathMapProvider;
		if(this.__pathSelection){
			this.__pathSelection.nodeAttr('pathMapProvider', pathMapProvider);
		}
	}

	get resolvedPath(){
    	
    	var resolvedPath = this.value;

    	if(!resolvedPath){
    		return resolvedPath;
    	}
    	
    	var pathMap = this.__pathMapProvider
    							?this.__pathMapProvider.pathMap
    							:[];
    							
    	for(var entry of pathMap.reverse()){
    		var placeHolder = '{$' + entry.name + '$}';
    		var path = entry.value;
    		resolvedPath = resolvedPath.replace(placeHolder, path);
    	}
    	
    	if(resolvedPath.includes('{$')){
    		console.warn('File path including unknown path variable: "' + resolvedPath + '"');
    	}
    	
    	return resolvedPath;
    }
	
	

}