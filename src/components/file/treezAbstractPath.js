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
    
    textFieldChanged(){
    	this.value = this.__textField.value;                	             	
    }
   
    disableElements(booleanValue){
    	if(this.__textField){   
    		this.__textField.disabled = booleanValue;
    		if(booleanValue){
				this.__browseButton.style.display = 'none';
    		} else {
    			this.__browseButton.style.display = null;
    		} 
    	}
    }	
   
    hideElements(booleanValue){
    	if(this.__label){   
    		this.hide(this.__label, booleanValue);
    		this.hide(this.__container, booleanValue); 
    	}
    }	

    execute(){
    	var command = this.fullPath;
    	window.treezTerminal.executeWithoutWait(command, undefined, (message) => {
    			console.error(message);
    			alert(message);
    		}
    	);
    		                     
    } 
    
    injectPathMap(path){    	
    	
    	var pathMap = this.__pathMapProvider
			?this.__pathMapProvider.pathMap
			:[];
		
    	var entryToInject = undefined;
		for(var entry of pathMap){

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
    	var fullPath = pathIncludingVariables;
    	if(!fullPath){
    		return undefined;
    	}
    	for(var entry of pathMap.reverse()){
    		var placeHolder = '{$' + entry.name + '$}';
    		var path = entry.value;
    		fullPath = fullPath.replace(placeHolder, path);
    	}
    	
    	if(fullPath.includes('{$')){
    		console.warn('File path including unknown path variable: "' + fullPath + '"');
    	}
    	
    	return fullPath;
    }

        
    get directory(){
       var fullPath = this.fullPath;
       if(!fullPath){
       		return null;
       }
       
       if(fullPath.endsWith('/')){
       		return fullPath;
       }
                                             
       var items = fullPath.split('/');
       var itemArray = items.slice(0, items.length-1);
       return itemArray.join('/');
       
    } 
    
    set pathMapProvider(provider){
    	this.__pathMapProvider = provider;
    	if(this.__textField){
    	    this.__textField.title = this.fullPath;
    	}
    }
    
    get fullPath(){
    	
    	var fullPath = this.value;

    	if(!fullPath){
    		return fullPath;
    	}
    	
    	var pathMap = this.__pathMapProvider
    							?this.__pathMapProvider.pathMap
    							:[];
    							
    	for(var entry of pathMap.reverse()){
    		var placeHolder = '{$' + entry.name + '$}';
    		var path = entry.value;
    		fullPath = fullPath.replace(placeHolder, path);
    	}
    	
    	if(fullPath.includes('{$')){
    		console.warn('File path including unknown path variable: "' + fullPath + '"');
    	}
    	
    	return fullPath;
    }
   
}

                

       