import LabeledTreezElement from './../../labeledTreezElement.js';

export default class TreezTextField extends LabeledTreezElement {
            	            	
    constructor(){
        super();                                  
        this.__label = undefined;   
        this.__textField = undefined; 
        this.validator = undefined;                           
    }            	

    connectedCallback() {
    	
        if(!this.__label){
            this.__createTextFieldLabel();
            if(!this.label){
                LabeledTreezElement.hide(this.__label, true);
            }
        }
        
        if(!this.__textField){
        	 this.__createTextField();
        }

       
        this.update();	       
    }
    
    updateElements(newValue){
    	if(this.__textField){  
    		if(this.__textField.value !== newValue){
    			this.__textField.value= newValue;
    		} 
    	}					    
    }

    updateContentWidth(width){
        this.updateWidthFor(this.__textField, width);
    }  

    updateWidth(width){
    	super.updateWidth(width);
    	if(!this.labelWidth){
    		this.updateLabelWidth(width);
    	}

    	if(!this.contentWidth){
    		this.updateContentWidth(width);
    	}    	
        
    }                 

    disableElements(newValue){
		if(this.__textField){                    	
			this.__textField.disabled= newValue; 
    	}
    }	
   
    hideElements(booleanValue){
        if(booleanValue === undefined){
            throw Error('This method expects a boolean argument');
        }
    	if(this.__label){
    	    if(this.label){
                LabeledTreezElement.hide(this.__label, booleanValue);
            } else {
                LabeledTreezElement.hide(this.__label, true);
            }

    		LabeledTreezElement.hide(this.__textField, booleanValue); 
    	}
    }

    validateValue(value){
    	if(this.validator){
    		return this.validator(value);
    	} else {
    		return {
				isValid: true,
				errorMessage: undefined
			}; 
    	}

    }

    __textFieldChanged(event){
    	event.stopPropagation();
        let value = this.__textField.value;
        if(value !== this.value){
        	let validationState = this.validateValue(value);
			if(validationState.isValid) {
				this.__resetErrorState();
				this.value = value;
			} else {
				this.__showErrorState(validationState.errorMessage);
			}  
        }
             
    }    

    __showErrorState(message){
        this.__textField.style.backgroundColor = 'orange';
        this.__textField.title = message;
    }

    __resetErrorState(message){
        this.__textField.style.backgroundColor = 'white';
        this.__textField.title = '';
    }

    __createTextFieldLabel(){
        var label = document.createElement('label');
        this.__label = label;
        label.innerHTML = this.label;
        label.className = 'treez-text-field-label';
        this.appendChild(label);
    }

    __createTextField(){
        var textField = document.createElement('input');
        this.__textField = textField;
        this.appendChild(textField);
        textField.className = 'treez-text-field-field';
        textField.onchange = (event) => this.__textFieldChanged(event);
    }
                          
}

window.customElements.define('treez-text-field', TreezTextField);