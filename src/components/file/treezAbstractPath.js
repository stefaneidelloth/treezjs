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
		}					    
    }    
    
    textFieldChanged(){
    	this.value = this.__textField.value;                	             	
    }
   
    disableElements(booleanValue){
    	if(this.__textField){   
    		this.__textField.disabled = booleanValue;
    		this.__browseButton.disabled = booleanValue;
    		this.__executeButton.disabled = booleanValue;
    	}
    }	
   
    hideElements(booleanValue){
    	if(this.__label){   
    		this.hide(this.__label, booleanValue);
    		this.hide(this.__container, booleanValue); 
    	}
    }	

    execute(){
    	var command = this.__textField.value;
    	window.treezTerminal.execute(command, undefined, console.error);                     
    }  

        
    get parentDirectory(){
       var fullPath = this.__textField.value;
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

                

       