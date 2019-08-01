import LabeledTreezElement from './../../labeledTreezElement.js';
import Treez from './../../../treez.js';

export default class TreezCodeArea extends LabeledTreezElement {    

    constructor(){
        super();                            
        this.__listeners = [];      
        this.__label = undefined;  
        this.__container = undefined;
        this.__textArea = undefined;  
        this.__codeMirror = undefined; 
        				
		Treez.importCssStyleSheet('/' + window.treezConfig.moduleFolder + '/codemirror/lib/codemirror.css');                                      
    }   

    static get observedAttributes() {
		return LabeledTreezElement.observedAttributes.concat(['mode']);                    
    } 	   	

    connectedCallback() {  

        var self = this;  	

		require([
			'codemirror/lib/codemirror',						
			'codemirror/mode/sql/sql',
			'codemirror/mode/javascript/javascript',
			'codemirror/mode/python/python'		
		], function(
			 CodeMirror
		) {		
		

			if(!self.__container){

				var container = document.createElement('div');
				container.className = 'treez-code-area-container';
				self.__container = container;

				self.appendChild(container);   
				
				if(!self.mode){
					self.mode = 'javascript';
				}

				//Doc on CodeMirror options: https://codemirror.net/doc/manual.html#config
				self.__codeMirror = CodeMirror(container,  
				  {
					value: self.value,
					mode: self.mode,
					lineNumbers: false, //showing line numbers somehow misaligns the cursor position
					matchBrackets: true,
					continueComments: "Enter",
					extraKeys: {"Ctrl-Q": "toggleComment"}
				  }
				);            

				self.__codeMirror.on('change', function(codeMirror, change){ 
				   var newValue = codeMirror.getValue();               
				   self.value = newValue; 
				});
			}        

			self.disableElements(self.disabled)
			self.hideElements(self.hidden); 
		});        
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
    
    get mode() {
		 return this.getAttribute('mode');
	}

	set mode(newValue) {
		 this.setAttribute('mode', newValue);	
	}       
                              
}

window.customElements.define('treez-code-area', TreezCodeArea);