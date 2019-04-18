import LabeledTreezElement from './../labeledTreezElement.js';
       
export default class TreezModelPath extends LabeledTreezElement {
            	 				
	get atomClasses() {   				
	  return this.__atomClasses
	}

	set atomClasses(value) {
	  this.__atomClasses = value;	
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

    constructor(){
        super();   
        this.__label = undefined;  
        this.__comboBox = undefined;
        this.__atomClasses = [];   
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
            comboBox.setAttribute('type','text')
            comboBox.setAttribute('list',uniqueOptionsId);
             
            comboBox.className='treez-model-path-select';                                            
            container.appendChild(comboBox);

            var comboBoxOptions = document.createElement('dataList');
            this.__comboBoxOptions = comboBoxOptions; 
            comboBoxOptions.setAttribute('id',uniqueOptionsId);
            container.appendChild(comboBoxOptions);
           
                         		
        }
        
        this.__updateOptionsAndRelativeRoot(); 
        this.updateElements(this.value);	
        this.disableElements(this.disabled)
		this.hideElements(this.hidden); 
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
   
    disableElements(booleanValue){
    	if(this.__comboButton){                   		
    		this.__comboButton.disabled = booleanValue;                		
    	}
    }	
   
    hideElements(booleanValue){
    	if(this.__label){ 
    		this.hide(this.__label, booleanValue);
    		this.hide(this.__comboBox, booleanValue); 
    	}
    }	
    
    __updateOptionsAndRelativeRoot(){                	

    	if(!this.__parentAtom){
    		return;
    	} 
    	                	             	
        var modelPaths = [null].concat(this.__getAvailableModelPaths(this.root, this.__atomClasses, this.hasToBeEnabled, this.filterDelegate));
        
		
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
    
    __getAvailableModelPaths(atom, classes, hasToBeEnabled, filterDelegate){ 
    	
    	
    	var rootPath = this.root.treePath;
    	            		            		
		var availablePaths = [];
		
		for(var child of atom.children){

			if (hasToBeEnabled) {                					
				if (!child.isEnabled) {
					continue;
				}
    		}
				
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

				var path = child.treePath;

				if(this.isUsingRelativeRoot){                					
					var relativePath = path.substring(rootPath.length);
					availablePaths.push(relativePath);
				} else {
					availablePaths.push(path);
				}

			}

			availablePaths = availablePaths.concat(this.__getAvailableModelPaths(child, this.__atomClasses, hasToBeEnabled, filterDelegate));
		}
		
		

		return availablePaths;
    	
    }
  
   
   
}
window.customElements.define('treez-model-path', TreezModelPath);