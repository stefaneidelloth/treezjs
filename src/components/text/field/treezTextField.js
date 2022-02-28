import LabeledTreezElement from './../../labeledTreezElement.js';

export default class TreezTextField extends LabeledTreezElement {
            	            	
    constructor(){
        super();                                  
        this.__label = undefined;   
        this.__textField = undefined; 
        this.validator = undefined; 
                                  
    } 

    static get observedAttributes() {
		return LabeledTreezElement.observedAttributes.concat(['inline']);
    } 				           

	attributeChangedCallback(attr, oldStringValue, newStringValue) {
    	super.attributeChangedCallback(attr, oldStringValue, newStringValue)

		if(attr==='inline'){
			if(this.__textField){
				if(newStringValue!==oldStringValue){				  
				   this.__updateLayout();				  
			   }				
			}
		}		
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

    update(){
    	super.update();
    	this.__updateLayout();
    }
    
    updateElements(newValue){
    	if(this.__textField){  
    		if(this.__textField.value !== newValue){
    			this.__textField.value= newValue;
    		} 
    	}	
		this.hideElements(this.hidden)
    }

    updateContentWidth(width){
        this.updateWidthFor(this.__textField, width);
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

    __updateLayout(){
    	if(this.inline){
			this.__textField.style.display = 'inline-block';
    	} else {
    		this.__textField.style.display = 'block';
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

    get inline() {
		let stringValue = this.getAttribute('inline')
	    return  !(stringValue === null);
	}

	set inline(booleanValue) {
		if(booleanValue){
			this.setAttribute('inline','')
		} else {
			this.removeAttribute('inline');
		}	  
	}  
                          
}

window.customElements.define('treez-text-field', TreezTextField);