import TreezElement from './treezElement.js';

export default class LabeledTreezElement extends TreezElement {

	static get observedAttributes() {
		return TreezElement.observedAttributes.concat(['label']);                    
    } 

	get label() {
		 return this.getAttribute('label');
	}

	set label(newValue) {
		 this.setAttribute('label', newValue);	
	} 
	
	constructor(){
		super();
		this.__label=undefined; //should be created by inheriting class
	} 				           

	attributeChangedCallback(attr, oldStringValue, newStringValue) {
    	super.attributeChangedCallback(attr, oldStringValue, newStringValue)                	     	      
    	
        if(attr==='label'){
        	if(this.__label){
        		 this.__label.innerText= newStringValue;   
        	}                                           
        }	                   
    }     

}