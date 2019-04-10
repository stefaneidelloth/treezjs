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
		this.innerText = newValue;                 						    
    }  
    
    disableElements(newValue){
		//nothing to do
    }	
   
    hideElements(booleanValue){                	
    	this.hide(this, booleanValue);            		
    }	  
}

window.customElements.define('treez-text-label', TreezTextLabel);