import LabeledTreezElement from './../../labeledTreezElement.js';

export default class TreezTextField extends LabeledTreezElement {
            	            	
    constructor(){
        super();                                  
        this.__label = undefined;   
        this.__textField = undefined;                            
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
			this.__textField.value= newValue; 
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

    __textFieldChanged(){
        this.value = this.__textField.value;
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
        textField.onchange = () => this.__textFieldChanged();
    }
                          
}

window.customElements.define('treez-text-field', TreezTextField);