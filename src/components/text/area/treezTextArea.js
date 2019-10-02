import LabeledTreezElement from './../../labeledTreezElement.js';

export default class TreezTextArea extends LabeledTreezElement {    

    constructor(){
        super();                                  
        this.__label = undefined;  
        this.__container = undefined;
        this.__textArea = undefined;                            
    }            	

    connectedCallback() {    	

        if(!this.__label){                     

            var label = document.createElement('label');  
            this.__label = label;                     
            label.innerText = this.label;                       
            this.appendChild(label);  

            var container = document.createElement('div');
            this.__container = container;
            this.appendChild(container);                                        

            var textArea = document.createElement('textarea');                       
            this.__textArea = textArea;
            textArea.onchange = ()=>this.__textAreaChanged();                                              
            container.appendChild(textArea);    		
        }
        
        this.updateElements(this.value);	
        this.disableElements(this.disabled)
		this.hideElements(this.hidden); 
    }
    
    updateElements(newValue){
    	if(this.__textArea){                    	
			this.__textArea.value = newValue; 
    	}					    
    }
    
    disableElements(booleanValue){
        if(booleanValue === undefined){
            throw Error('This method expects a boolean argument');
        }
    	if(this.__textArea){   
    		this.__textArea.disabled = booleanValue;
    	}
    }	
   
    hideElements(booleanValue){
        if(booleanValue === undefined){
            throw Error('This method expects a boolean argument');
        }
    	if(this.__label){   
    		LabeledTreezElement.hide(this.__label, booleanValue);
    		LabeledTreezElement.hide(this.__container, booleanValue); 
    	}
    }

    __textAreaChanged(){
        this.value = this.__textArea.value;
    }

}

window.customElements.define('treez-text-area', TreezTextArea);