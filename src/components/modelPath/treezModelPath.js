import LabeledTreezElement from './../labeledTreezElement.js';
       
export default class TreezModelPath extends LabeledTreezElement {
       
    constructor(){
        super();   
        this.__label = undefined;  
        this.__comboBox = undefined;
        this.__atomClasses = undefined;   //used to identify allowed atoms by their class
        this.__atomFunctionNames = undefined; //used to identify allowed atoms by their functions/interface
        this.__relativeRootAtom = undefined; 
        this.__relativeRootLabel = undefined;                 
    }            	

    connectedCallback() {
    	
        if(!this.__label){  

            var label = document.createElement('label');  
            this.__label = label;                     
            label.innerText = this.label;                       
            this.appendChild(label);

            var container = document.createElement('div');
            container.className='treez-model-path-container';
            this.appendChild(container);

            var relativeRootLabel = document.createElement('span');
            this.__relativeRootLabel = relativeRootLabel;
            relativeRootLabel.className='treez-model-path-relative-root-label';
            relativeRootLabel.style.display='none';
            container.appendChild(relativeRootLabel);  
            
			var uniqueOptionsId = 'options' + new Date().valueOf() + Math.random();

            var comboBox = document.createElement('input');
            this.__comboBox = comboBox;  
            comboBox.setAttribute('type', 'text')
            comboBox.setAttribute('list', uniqueOptionsId);
            comboBox.onchange = () => this.__comboBoxChanged();
             
            comboBox.className='treez-model-path-select';                                            
            container.appendChild(comboBox);

            var comboBoxOptions = document.createElement('dataList');
            this.__comboBoxOptions = comboBoxOptions; 
            comboBoxOptions.setAttribute('id', uniqueOptionsId);
            container.appendChild(comboBoxOptions);
           
        }
        
        this.__updateOptionsAndRelativeRoot(); 
        this.updateElements(this.value);	
        this.disableElements(this.disabled)
		this.hideElements(this.hidden); 
    }
    
    updateElements(newValue){
    	if(this.__comboBox){ 
    		if(newValue){ 
    		    var comboBoxValue = this.convertToStringValue(newValue);
    			if(this.__comboBox.value !== comboBoxValue){
    				this.__comboBox.value = comboBoxValue; 
    			}  
            	
            } else {
            	if(this.__comboBox.value){
            		this.__comboBox.value = null;
            	}                        	
            }						
		}					    
    } 
    
    __comboBoxChanged(){
    	this.value = this.convertFromStringValue(this.__comboBox.value);
    }
    
    convertFromStringValue(comboBoxValue){
    	if(!comboBoxValue){
			return null;
		}

    	if(this.isUsingRelativeRoot){
    		if(comboBoxValue.startsWith('root')){
    			return comboBoxValue;
    		}
			return this.rootPath + comboBoxValue;
    	} else {
    		return comboBoxValue;	
    	}

    }

    convertToStringValue(absolutePath){

		if(!absolutePath){
			return null;
		}

		if(this.isUsingRelativeRoot){
			return absolutePath.substring(this.rootPath.length);
    	} else {
    		return absolutePath;	
    	}
    }
   
    disableElements(booleanValue){
    	if(this.__comboButton){                   		
    		this.__comboButton.disabled = booleanValue;                		
    	}
    }	
   
    hideElements(booleanValue){
    	if(this.__label){ 
    		LabeledTreezElement.hide(this.__label, booleanValue);
    		LabeledTreezElement.hide(this.__comboBox, booleanValue); 
    	}
    }	
    
    __updateOptionsAndRelativeRoot(){                	

    	if(!this.__parentAtom){
    		return;
    	} 
    	                	             	
        var modelPaths = [null].concat(this.__getAvailableModelPaths(this.root, this.hasToBeEnabled, this.filterDelegate));
        
		
		var newComboBoxValue = this.__tryToGetUpdatedModelPath(modelPaths);
		var newValue = this.convertFromStringValue(newComboBoxValue);
		if(this.value !== newValue){
			this.value = newValue;
		}

		if(this.__comboBox){
			this.__removeOptions();	
			this.__createOptions(modelPaths);
			this.__updateRelativeRootLabel();
		} 
    }

     __tryToGetUpdatedModelPath(newAvailableModelPaths){
     
    	var oldModelPath = this.value;

    	if(!oldModelPath){
    		return null;
    	}

    	if(newAvailableModelPaths.length < 2){
    		return oldModelPath; 
    	}

    	if(newAvailableModelPaths.indexOf(oldModelPath) >-1){
    		return oldModelPath; 
    	}

		if (oldModelPath.length < this.rootPath.length){
			return null;
		}

		var relativePath = oldModelPath.substring(this.rootPath.length);					

    	if(newAvailableModelPaths.indexOf(relativePath) >-1){
    		return relativePath; 
    	}

    	return null;
    }

    __updateRelativeRootLabel(){
		if(this.isUsingRelativeRoot){
			this.__relativeRootLabel.textContent = this.root.treePath;
			this.__relativeRootLabel.style.display='inline-block';
		} else {
			this.__relativeRootLabel.textContent ='';
			this.__relativeRootLabel.style.display='none';
		}
    }

    __removeOptions(){
    	while (this.__comboBoxOptions.firstChild) {
			this.__comboBoxOptions.removeChild(this.__comboBoxOptions.firstChild);
		} 
    }

    __createOptions(items){
    	 for(var item of items){
        	 var option = document.createElement('option');
       		 option.innerText = item;
       		 this.__comboBoxOptions.appendChild(option); 
        } 
    }
    
    __getAvailableModelPaths(atom, hasToBeEnabled, filterDelegate){ 

    	
    	var classes = this.__atomClasses;
    	var functionNames = this.__atomFunctionNames;
    	    	
    	
    	            		            		
		var availablePaths = [];
		
		for(var child of atom.children){

			if (hasToBeEnabled) {                					
				if (!child.isEnabled) {
					continue;
				}
    		}

    		if(classes){

    			if(functionNames){
    				throw new Error('Please specify only atomClasses or atomFunctionNames and not both.');
    			}

    			availablePaths = this.__addAvailablePathByClass(availablePaths, child, classes, filterDelegate);
    			

    		} else {

    			if(!functionNames){
    				throw new Error('Either atomClasses or atomFunctionNames need to be specified to identify allowed atoms.')
    			}

				availablePaths = this.__addAvailablePathByInterface(availablePaths, child, functionNames);
    		}			

			availablePaths = availablePaths.concat(this.__getAvailableModelPaths(child, hasToBeEnabled, filterDelegate));
		}
		return availablePaths;
    }

    __addAvailablePathByClass(availablePaths, child, classes, filterDelegate){

		var rootPath = this.root.treePath;
    	var paths = availablePaths;
		for(var clazz of classes){           						
			if (!(child instanceof clazz)) {
				continue;
			}

			if (filterDelegate) {
				var passedFilter = filterDelegate(child);
				if (!passedFilter) {
					continue;
				}
			}   

			paths = this.__addPathForChild(paths, child);
			
		}
		return paths;
	}

	__addAvailablePathByInterface(availablePaths, child, functionNames){		
		var paths = availablePaths;
		return this.__containsAllFunctions(child, functionNames)
			? this.__addPathForChild(availablePaths, child)
			:paths;		
	}

	__addPathForChild(availablePaths, child){

		var rootPath = this.root.treePath;
		var paths = availablePaths;
		var path = child.treePath;

		if(this.isUsingRelativeRoot){                					
				var relativePath = path.substring(rootPath.length);
				paths.push(relativePath);
		} else {
				paths.push(path);
		}
		return paths;
	}

	__containsAllFunctions(child, functionNames){		
		for(var functionName of functionNames){           						
			if (!(child[functionName])) {
				return false;
			}		
		}
		return true;
	}
    
    get atomClasses() {   				
  	  return this.__atomClasses
  	}

  	set atomClasses(value) {
  	  this.__atomClasses = value;	
  	  this.__updateOptionsAndRelativeRoot();  
  	} 

  	get atomFunctionNames() {   				
  	  return this.__atomFunctionNames
  	}

  	set atomFunctionNames(value) {
  	  this.__atomFunctionNames = value;	
  	  this.__updateOptionsAndRelativeRoot();  
  	} 

  	get relativeRootAtom(){
  		return this.__relativeRootAtom;
  	}

  	get isUsingRelativeRoot(){
  		return this.relativeRootAtom !== undefined && this.relativeRootAtom !== null;
  	}

  	set relativeRootAtom(atom){
  		this.__relativeRootAtom=atom;
  		this.__updateOptionsAndRelativeRoot(); 
  	}

  	get root(){

  		if(this.isUsingRelativeRoot){
  			return this.relativeRootAtom;
  		}

  		if(this.__parentAtom){
  			return this.__parentAtom.root;
  		}

  		return null;    								
  	}

  	get rootPath(){
  		if(this.root){
  			return this.root.treePath;
  		} else {
  			return '';
  		}
  	}
   
}
window.customElements.define('treez-model-path', TreezModelPath);