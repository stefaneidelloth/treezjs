import LabeledTreezElement from './../labeledTreezElement.js';

export default class TreezAbstractPath extends LabeledTreezElement {
            	
    constructor(){
        super();   
        this.__container = undefined;
        this.__label = undefined;   
        this.__textField = undefined;
        this.__browseButton = undefined;
        this.__executeButton = undefined;
        this.__pathMapProvider = undefined;
    }  
        
    updateElements(newValue){
    	if(this.__textField){ 
    	 	if(newValue !== undefined){
            	this.__textField.value = newValue; 
            }  else {
            	this.__textField.value = '';
            }	
            this.__textField.title = this.resolvedPath;										
		}					    
    }

	updateContentWidth(width){
		this.updateWidthFor(this.__container, width);
	}
      
    disableElements(booleanValue){
		if(booleanValue === undefined){
			throw Error('This method expects a boolean argument');
		}
    	if(this.__textField){   
    		this.__textField.disabled = booleanValue;
			LabeledTreezElement.hide(this.__browseButton, booleanValue);
    	}
    }	
   
    hideElements(booleanValue){
		if(booleanValue === undefined){
			throw Error('This method expects a boolean argument');
		}
    	if(this.__label){   
    		LabeledTreezElement.hide(this.__label, booleanValue);
    		LabeledTreezElement.hide(this.__container, booleanValue); 
    	}
	}
	
	textFieldChanged(){
    	this.value = TreezAbstractPath.replacePathSeparators(this.__textField.value.trim());                	             	
    }

    execute(){    	
    	window.treezTerminal.openPath(this.resolvedPath, (message) => {
    			console.error(message);
    			alert(message);
    		}
    	);
    		                     
    } 
    
    injectPathMap(path){    	
		
		if(!this.__pathMapProvider){
			return path;
		}

    	let pathMap = this.__pathMapProvider.pathMap;
				
    	let entryToInject = undefined;
		for(let entry of pathMap){

			if(entry.name === this.label){
					continue;
			}
			
			if (path.includes(entry.resolvedPath)){
				if(entryToInject){
					if(entryToInject.resolvedPath.length < entry.resolvedPath.length){
						entryToInject = entry;
					}
				} else {
					entryToInject = entry;
				}
			}			
		}
		
		return entryToInject
				?path.replace(entryToInject.resolvedPath, '{$' + entryToInject.name + '$}')
				:path;		
		
    }

    static replacePathSeparators(path){
    	let pathWithForwardSlashes = path.replace(/\\/g,'/');
    	let pathWithSingleForwardSlashes = pathWithForwardSlashes.replace(/\/\//g,'/');
    	return pathWithSingleForwardSlashes;
    }
    
    static replacePathVariables(pathIncludingVariables, pathMap){
    	
    	if(!pathIncludingVariables){
    		return pathIncludingVariables;
		}
		
		let resolvedPath = pathIncludingVariables;
    	for(let entry of pathMap.reverse()){
    		let placeHolder = '{$' + entry.name + '$}';
    		let path = entry.value;
    		resolvedPath = resolvedPath.replace(placeHolder, path);
    	}
    	
    	if(resolvedPath.includes('{$')){
    		console.warn('File path including unknown path variable: "' + resolvedPath + '"');
    	}
    	
    	return resolvedPath;
	}

	static convertToAbsolutePathIfRelative(path){
		

        let isRelative = path[0] === '.' || path[0] === '/' || path[0] === '\\';
        if(!isRelative){
        	return path;
        }

        let documentFilePath = document.URL;
        let documentDirectory = this.directoryFromFilePath(documentFilePath);
        let separator = '/';
        if(path[0] === '/'){
        	separator = '';
        }

		return documentDirectory + separator + path;
	}

	directoryFromFilePath(filePath){
		let items = filePath.split('/');	    
		let parentItemArray = items.slice(0, items.length-1);
       	return parentItemArray.join('/');
	}

	get __urlPrefix(){
		return window.treezConfig
			?window.treezConfig.home
			:'';
	}
	
	//the stored element value might inlclude variable expressions/relative paths, e.g. {$workingDir}
	//the resolvedPath does not include variable expressions but the resolved path
	get resolvedPath(){
		if(!this.__pathMapProvider){
			return this.value;
		}
		let pathMap = this.__pathMapProvider.pathMap;
		return TreezAbstractPath.replacePathVariables(this.value, pathMap); 
    }

        
    get fullDirectory(){
       let resolvedPath = this.resolvedPath;
       if(!resolvedPath){
       		return null;
	   }   
       
	   if(this.isFile){	
		    return this.directoryFromFilePath(resolvedPath);
	   } else {
			if(resolvedPath.endsWith('/')){
				return resolvedPath.slice(0, resolvedPath.length-1);
	       	} else {
				return resolvedPath;
			}			
	   }       
       
	} 

	get fullParentDirectory(){
		let resolvedPath = this.resolvedPath;
		if(!resolvedPath){
			return null;
		}	                                      
		
		if(resolvedPath.endsWith('/')){
			resolvedPath = resolvedPath.slice(0, resolvedPath.length-1);
		} 

		let items = resolvedPath.split('/');
		let parentItemArray = items.slice(0, items.length-1);
		return parentItemArray.join('/'); 
	 } 

	get isFile(){
		if(!this.value){
			return false;
		}

		let items = this.value.split('/');
		let lastItem = items[items.length-1];
		return lastItem.includes('.');
	}
	    
    set pathMapProvider(provider){
    	this.__pathMapProvider = provider;
    	if(this.__textField){
    	    this.__textField.title = this.resolvedPath;
    	}
    }
    
    
   
}

                

       