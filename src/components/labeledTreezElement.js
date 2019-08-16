import TreezElement from './treezElement.js';

export default class LabeledTreezElement extends TreezElement {
	
	constructor(){
		super();
		this.__label=undefined; //this label-element should be created by inheriting classes
		                        //it should have a property "innerText" that defines the label text
	} 

	static get observedAttributes() {
		return TreezElement.observedAttributes.concat(['label']);                    
    } 				           

	attributeChangedCallback(attr, oldStringValue, newStringValue) {
    	super.attributeChangedCallback(attr, oldStringValue, newStringValue)                	     	      
    	
        if(attr==='label'){
        	if(this.__label){
        		 this.__label.innerText= newStringValue;   
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