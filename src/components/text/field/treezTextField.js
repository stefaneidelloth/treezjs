import LabeledTreezElement from './../../labeledTreezElement.js';

export default class TreezTextField extends LabeledTreezElement {
            	            	
    constructor(){
        super();                                  
        this.__label = undefined;   
        this.__textField = undefined;                            
    }            	

    connectedCallback() {
    	
        if(!this.__label){   
        	if(this.label){
        		this.__createTextFieldLabel();
        	}           
        }
        
        if(!this.__textField){
        	 this.__createTextField();
        }

        if(!this.width){
        	this.width='99%';
        }
        
        this.updateElements(this.value);	
        this.disableElements(this.disabled)
		this.hideElements(this.hidden); 
    }
    
    __createTextFieldLabel(){
    	var label = document.createElement('label');  
        this.__label = label;                     
        label.innerText = this.label;  
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
    
    updateElements(newValue){
    	if(this.__textField){                    	
			this.__textField.value= newValue; 
    	}					    
    }
    
    __textFieldChanged(){
    	this.value = this.__textField.value;                	
    }  

    updateWidth(width){
    	if(this.__textField){ 
    		this.__textField.style.width = width;  //TODO: consider label width?   
    	}                	
    }                 

    disableElements(newValue){
		if(this.__textField){                    	
			this.__textField.disabled= newValue; 
    	}
    }	
   
    hideElements(booleanValue){
    	if(this.__label){   
    		this.hide(this.__label, booleanValue);
    		this.hide(this.__textField, booleanValue); 
    	}
    }    
                          
}

window.customElements.define('treez-text-field', TreezTextField);