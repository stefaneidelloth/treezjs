import LabeledTreezElement from './../../labeledTreezElement.js';
//import CodeMirror from './../../../../bower_components/codemirror/src/codemirror.js';
import Treez from './../../../treez.js';

export default class TreezCodeArea extends LabeledTreezElement {    

    constructor(){
        super();                            
        this.__listeners = [];      
        this.__label = undefined;  
        this.__container = undefined;
        this.__textArea = undefined;  
        this.__codeMirror = undefined;    

		Treez.importScript('/bower_components/codemirror/lib/codemirror.js');
		Treez.importScript('/bower_components/codemirror/mode/sql/sql.js');
        
                              
    }   

    static get observedAttributes() {
		return LabeledTreezElement.observedAttributes.concat(['mode']);                    
    } 

	get mode() {
		 return this.getAttribute('mode');
	}

	set mode(newValue) {
		 this.setAttribute('mode', newValue);	
	}          	

    connectedCallback() {    	

        if(!this.__container){
        	
        	var container = document.createElement('div');
        	container.className = 'treez-code-area-container';
        	this.__container = container;
        	
        	this.appendChild(container);           

            var self=this; 

            if(!self.mode){
            	self.mode = 'javascript';
            }
            
            //Doc on CodeMirror options: https://codemirror.net/doc/manual.html#config
            this.__codeMirror = CodeMirror(container,  
              {
            	value: self.value,
            	mode: self.mode,
                lineNumbers: false, //showing line numbers somehow misaligns the cursor position
                matchBrackets: true,
                continueComments: "Enter",
                extraKeys: {"Ctrl-Q": "toggleComment"}
              }
            );            
            
            this.__codeMirror.on('change', function(codeMirror, change){ 
               var newValue = codeMirror.getValue();
               self.value = newValue

			   for(var listener of self.__listeners){
					listener.atom[listener.propertyName] = newValue;
			   } 

			   self.__dispatchChangeEvent();
                             
            });
        }        
      
        this.disableElements(this.disabled)
		this.hideElements(this.hidden); 
    }

    __dispatchChangeEvent(){
    	var event = new Event(
							  'change', 
							  {
								'bubbles': true,
								'cancelable': true
							  }
							 );
		this.dispatchEvent(event);
    }

    __addListenerToUpdatePropertyOnElementChanges(parentAtom, propertyName){	

    	this.__listeners.push({
    		atom: parentAtom,
    		propertyName: propertyName
    	})						
	}    
    
    updateElements(newValue){
    	if(this.__codeMirror){ 
    		if(this.__codeMirror.getValue() !== newValue) {
    			this.__codeMirror.setValue(newValue);
    		}    	  
    	}					    
    }    
    
    disableElements(booleanValue){
    	if(this.__textArea){   
    		this.__textArea.disabled = booleanValue;
    	}
    }	
   
    hideElements(booleanValue){
    	if(this.__label){   
    		this.hide(this.__label, booleanValue);
    		this.hide(this.__container, booleanValue); 
    	}
    }	
    
    attributeChangedCallback(attr, oldStringValue, newStringValue) {
    	super.attributeChangedCallback(attr, oldStringValue, newStringValue)                	     	      
    	
        if(attr==='mode'){
        	if(this.__codeMirror){
        		 this.__codeMirror.setOption('mode', newStringValue);  
        	}                                           
        }	                   
    }   
                              
}

window.customElements.define('treez-code-area', TreezCodeArea);