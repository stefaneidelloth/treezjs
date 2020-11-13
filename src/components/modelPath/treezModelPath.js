import LabeledTreezElement from './../labeledTreezElement.js';
       
export default class TreezModelPath extends LabeledTreezElement {
       
    constructor(){
        super();   
        this.__label = undefined;  
        this.__comboBox = undefined;
        this.__atomClasses = undefined;   //used to identify allowed atoms by their class
        this.__atomFunctionNames = undefined; //used to identify allowed atoms by their functions/interface
		this.filterDelegate = undefined;
        this.__relativeRootAtom = undefined; 
        this.__relativeRootLabel = undefined;                 
    }            	

    connectedCallback() {
    	
        if(!this.__label){ 

            this.className = 'treez-model-path'; 

            let label = document.createElement('label');  
            this.__label = label;                     
            label.innerText = this.label;
            label.className = 'treez-model-path-label';                       
            this.appendChild(label);

            let container = document.createElement('div');
            container.className='treez-model-path-container';
            this.appendChild(container);

            let relativeRootLabel = document.createElement('span');
            this.__relativeRootLabel = relativeRootLabel;
            relativeRootLabel.className='treez-model-path-relative-root-label';
            relativeRootLabel.style.display='none';
            container.appendChild(relativeRootLabel);  
            
			let uniqueOptionsId = 'options' + new Date().valueOf() + Math.random();

            let comboBox = document.createElement('select');
            this.__comboBox = comboBox;
            comboBox.onchange = () => this.__comboBoxChanged();             
            comboBox.className='treez-model-path-select';                                            
            container.appendChild(comboBox);           
           
        }
        
        this.__updateOptionsAndRelativeRoot(); 
        this.update();	       
    }
    
    updateElements(newValue){
    	if(this.__comboBox){ 
    		if(newValue){ 
    		    let comboBoxValue = this.convertToStringValue(newValue);
    			if(this.__comboBox.value !== comboBoxValue){
    				this.__comboBox.value = comboBoxValue; 
    			}  
            	
            } else {
            	if(this.__comboBox.value !== ''){
            		this.__comboBox.value = '';
            	}                        	
            }						
		}					    
    }

	updateContentWidth(width){
		this.updateWidthFor(this.__comboBox, width);
	}
   
    disableElements(booleanValue){
		if(booleanValue === undefined){
			throw Error('This method expects a boolean argument');
		}
    	if(this.__comboBox){
    		this.__comboBox.disabled = booleanValue;
    	}
    }	
   
    hideElements(booleanValue){
		if(booleanValue === undefined){
			throw Error('This method expects a boolean argument');
		}
    	if(this.__label){ 
    		LabeledTreezElement.hide(this.__label, booleanValue);
    		LabeledTreezElement.hide(this.__comboBox, booleanValue); 
    	}
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
			if(absolutePath.includes(this.rootPath)){
				return absolutePath.substring(this.rootPath.length);
			} else {
				return absolutePath;
			}
			
		} else {
			return absolutePath;
		}
	}

	__comboBoxChanged(){
		this.value = this.convertFromStringValue(this.__comboBox.value);
	}
    
    __updateOptionsAndRelativeRoot(){                	

    	if(!this.root){
    		return;
    	} 
    	                	             	
        let modelPaths = [null].concat(this.__getAvailableModelPaths(this.root, this.hasToBeEnabled, this.filterDelegate));

		let newComboBoxValue = this.__tryToGetUpdatedModelPath(modelPaths);
		let newValue = this.convertFromStringValue(newComboBoxValue);
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
     
    	let oldModelPath = this.value;

    	if(!oldModelPath){
    		return null;
    	}

		if(newAvailableModelPaths.length === 0){
			return null;
		}

    	if(newAvailableModelPaths.length === 1){
    		return newAvailableModelPaths[0];
    	}

    	if(newAvailableModelPaths.indexOf(oldModelPath) >-1){
    		return oldModelPath; 
    	}

		if (oldModelPath.length < this.rootPath.length){
			return null;
		}

		let relativePath = oldModelPath.substring(this.rootPath.length);					

    	if(newAvailableModelPaths.indexOf(relativePath) >-1){
    		return relativePath; 
    	}

    	return null;
    }

    __updateRelativeRootLabel(){
		if(this.isUsingRelativeRoot){
			this.__relativeRootLabel.textContent = this.rootPath;
			this.__relativeRootLabel.style.display='inline-block';
		} else {
			this.__relativeRootLabel.textContent ='';
			this.__relativeRootLabel.style.display='none';
		}
    }

    __removeOptions(){
    	while (this.__comboBox.firstChild) {
			this.__comboBox.removeChild(this.__comboBox.firstChild);
		} 
    }

    __createOptions(items){
    	 for(let item of items){
        	 let option = document.createElement('option');
       		 option.innerText = item;
       		 this.__comboBox.appendChild(option); 
        } 
    }
    
    __getAvailableModelPaths(atom, hasToBeEnabled, filterDelegate){
    	
    	let classes = this.__atomClasses;
    	let functionNames = this.__atomFunctionNames;
    	            		            		
		let availablePaths = [];
		
		for(let child of atom.children){

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
    				throw new Error('Either atomClasses or atomFunctionNames already need to be specified to identify allowed atoms.')
    			}

				availablePaths = this.__addAvailablePathByInterface(availablePaths, child, functionNames);
    		}			

			availablePaths = availablePaths.concat(this.__getAvailableModelPaths(child, hasToBeEnabled, filterDelegate));
		}
		return availablePaths;
    }

    __addAvailablePathByClass(availablePaths, child, classes, filterDelegate){

		let rootPath = this.rootPath;
    	let paths = availablePaths;
		for(let clazz of classes){           						
			if (!(child instanceof clazz)) {
				continue;
			}

			if (filterDelegate) {
				let passedFilter = filterDelegate(child);
				if (!passedFilter) {
					continue;
				}
			}   

			paths = this.__addPathForChild(paths, child);
			
		}
		return paths;
	}

	__addAvailablePathByInterface(availablePaths, child, functionNames, filterDelegate){		
		let paths = availablePaths;
		let hasInterface =  this.__containsAllFunctions(child, functionNames)

		if(hasInterface){

			if (filterDelegate) {
				let passedFilter = filterDelegate(child);
				if (passedFilter) {
					paths = this.__addPathForChild(paths, child);
				}
			} else {
				paths = this.__addPathForChild(paths, child);
			}

		}

		return paths;
	}

	__addPathForChild(availablePaths, child){

		let rootPath = this.rootPath;
		let paths = availablePaths;
		let path = child.treePath;

		if(this.isUsingRelativeRoot){                					
				let relativePath = path.substring(rootPath.length);
				paths.push(relativePath);
		} else {
				paths.push(path);
		}
		return paths;
	}

	__containsAllFunctions(child, functionNames){		
		for(let functionName of functionNames){           						
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
  	  return this.__atomFunctionNames;
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