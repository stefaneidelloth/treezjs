import TreezElement from './../../treezElement.js';

export default class TreezTextLabel extends TreezElement {            	

    constructor(){
        super(); 								
    }            	

    connectedCallback() { 
    	this.updateElements(this.value);										
		this.disableElements(this.disabled)
		this.hideElements(this.hidden); 
    }                  

    updateElements(newValue){                	               	
		this.innerHTML = newValue;                 						    
    }  
    
    disableElements(newValue){
		//nothing to do
    }	
   
    hideElements(booleanValue){                	
    	LabeledTreezElement.hide(this, booleanValue);            		
    }	  
}

window.customElements.define('treez-text-label', TreezTextLabel);