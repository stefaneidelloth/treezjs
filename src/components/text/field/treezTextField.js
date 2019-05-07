import LabeledTreezElement from './../../labeledTreezElement.js';

export default class TreezTextField extends LabeledTreezElement {
            	            	
    constructor(){
        super();                                  
        this.__label = undefined;   
        this.__textField = undefined;                            
    }            	

    connectedCallback() {
    	
        if(!this.__label){                       

            var label = document.createElement('label');  
            this.__label = label;                     
            label.innerText = this.label;  
            label.setAttribute('class','treez-text-field-label');
            this.appendChild(label);                                                            

            var textField = document.createElement('input'); 
            this.__textField = textField;
            this.appendChild(textField); 
            textField.setAttribute('class','treez-text-field')                
            textField.onchange = () => this.__textFieldChanged();
        }

        if(!this.width){
        	this.width='99%';
        }
        
        this.updateElements(this.value);	
        this.disableElements(this.disabled)
		this.hideElements(this.hidden); 
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