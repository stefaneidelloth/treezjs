import TreezElement from './../../treezElement.js';

export default class TreezTextLabel extends TreezElement {            	

    constructor(){
        super(); 								
    }            	

    connectedCallback() { 
    	this.updateElements(this.value);
		this.hideElements(this.hidden); 
    }                  

    updateElements(newValue){                	               	
		this.innerHTML = newValue;                 						    
    }  
    
    disableElements(newValue){
		throw new Error('The label cannot be disabled. You might want to hide it instead. ')
    }	
   
    hideElements(booleanValue){
        if(booleanValue === undefined){
            throw Error('This method expects a boolean argument');
        }
    	TreezElement.hide(this, booleanValue);            		
    }	  
}

window.customElements.define('treez-text-label', TreezTextLabel);