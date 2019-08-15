import TreezElement from './treezElement.js';

export default class LabeledTreezElement extends TreezElement {
	
	constructor(){
		super();
		this.__labelElement=undefined; //should be created by inheriting class
	} 

	static get observedAttributes() {
		return TreezElement.observedAttributes.concat(['label']);                    
    } 				           

	attributeChangedCallback(attr, oldStringValue, newStringValue) {
    	super.attributeChangedCallback(attr, oldStringValue, newStringValue)                	     	      
    	
        if(attr==='label'){
        	if(this.__labelElement){
        		 this.__labelElement.innerText= newStringValue;   
        	}                                           
        }	                   
    }  
	
	get label() {
		 return this.getAttribute('label');
	}

	set label(newValue) {
		 this.setAttribute('label', newValue);	
	} 

}