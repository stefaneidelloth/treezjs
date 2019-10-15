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
            this.__textField.title = this.fullPath;										
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
    	this.value = this.__textField.value;                	             	
    }

    execute(){
    	let command = this.fullPath;
    	window.treezTerminal.executeWithoutWait(command, undefined, (message) => {
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
			
			if (path.includes(entry.fullPath)){
				if(entryToInject){
					if(entryToInject.fullPath.length < entry.fullPath.length){
						entryToInject = entry;
					}
				} else {
					entryToInject = entry;
				}
			}			
		}
		
		return entryToInject
				?path.replace(entryToInject.fullPath, '{$' + entryToInject.name + '$}')
				:path;		
		
    }
    
    static replacePathVariables(pathIncludingVariables, pathMap){
    	
    	if(!pathIncludingVariables){
    		return pathIncludingVariables;
		}
		
		let fullPath = pathIncludingVariables;
    	for(let entry of pathMap.reverse()){
    		let placeHolder = '{$' + entry.name + '$}';
    		let path = entry.value;
    		fullPath = fullPath.replace(placeHolder, path);
    	}
    	
    	if(fullPath.includes('{$')){
    		console.warn('File path including unknown path variable: "' + fullPath + '"');
    	}
    	
    	return fullPath;
	}
	
	//the stored element value might inlclude variable expressions/relative paths, e.g. {$workingDir}
	//the fullPath does not include variable expressions but the absolute path
	get fullPath(){
		if(!this.__pathMapProvider){
			return this.value;
		}
		let pathMap = this.__pathMapProvider.pathMap;
		return TreezAbstractPath.replacePathVariables(this.value, pathMap); 
    }

        
    get fullDirectory(){
       let fullPath = this.fullPath;
       if(!fullPath){
       		return null;
	   }   
       
	   if(this.isFile){	
		    let items = fullPath.split('/');	    
			let parentItemArray = items.slice(0, items.length-1);
       		return parentItemArray.join('/');
	   } else {
			if(fullPath.endsWith('/')){
				return fullPath.slice(0, fullPath.length-1);
	       	} else {
				return fullPath;
			}			
	   }       
       
	} 

	get fullParentDirectory(){
		let fullPath = this.fullPath;
		if(!fullPath){
			return null;
		}	                                      
		
		if(fullPath.endsWith('/')){
			fullPath = fullPath.slice(0, fullPath.length-1);
		} 

		let items = fullPath.split('/');
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
    	    this.__textField.title = this.fullPath;
    	}
    }
    
    
   
}

                

       