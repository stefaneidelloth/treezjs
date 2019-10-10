import LabeledTreezElement from './../../labeledTreezElement.js';
import Treez from './../../../treez.js';

export default class TreezCodeArea extends LabeledTreezElement {    

    constructor(){
        super();
        this.__label = undefined;
        this.__container = undefined;
        this.__codeMirror = undefined; 
        				
		Treez.importCssStyleSheet('/bower_components/codemirror/lib/codemirror.css');                                      
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

			if(!self.__label){
				var label = document.createElement('label');  
				self.__label = label;                     
				label.innerText = self.label;
				label.className = 'treez-code-area-label';
				self.appendChild(label);  
			}
			
		

			if(!self.__container){

				var container = document.createElement('div');
				container.className = 'treez-code-area-container';
				self.__container = container;

				self.appendChild(container);   
				
				if(!self.mode){
					self.mode = 'javascript';
				}

				if(!self.value){
					self.value = '';
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

			self.updateElements(self.value);
			self.updateWidth(self.width);
			self.disableElements(self.disabled);
			self.hideElements(self.hidden); 
		}, function(error){
			console.log(error);
		});        
    }

	attributeChangedCallback(attr, oldStringValue, newStringValue) {
		super.attributeChangedCallback(attr, oldStringValue, newStringValue)

		if(attr==='mode'){
			if(this.__codeMirror){
				this.__codeMirror.setOption('mode', newStringValue);
			}
		}
	}

	updateElements(newValue){
    	if(this.__codeMirror){ 
    		if(this.__codeMirror.getValue() !== newValue) {
    			this.__codeMirror.setValue(newValue);
    		}    	  
    	}					    
    }    

    updateContentWidth(width){
		super.updateWidth(width);
		this.updateWidthFor(this.__container, width);
    	if(this.__codeMirror){
    		this.__codeMirror.setSize(width, null);
    	}
    }

	updateWidth(newValue){
		this.updateContentWidth(newValue)
	}
    
    disableElements(booleanValue){
		if(booleanValue === undefined){
			throw Error('This method expects a boolean argument');
		}
    	if(this.__codeMirror){
    		this.__codeMirror.options.disableInput = booleanValue;

    		let parentDiv = this.__codeMirror.getScrollerElement().parentNode;

    		if(booleanValue){
				parentDiv.style.backgroundColor = '#ebebeb';
    		} else {
    			parentDiv.style.backgroundColor = 'white';
    		}
    		
    	}
    }	
   
    hideElements(booleanValue){
		if(booleanValue === undefined){
			throw Error('This method expects a boolean argument');
		}
    	if(this.__codeMirror){
    		LabeledTreezElement.hide(this.__label, booleanValue);
    		LabeledTreezElement.hide(this.__container, booleanValue);
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