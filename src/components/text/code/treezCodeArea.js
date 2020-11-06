import LabeledTreezElement from './../../labeledTreezElement.js';
import Treez from './../../../treez.js';

export default class TreezCodeArea extends LabeledTreezElement {    

    constructor(){
        super();
        this.__label = undefined;       
        this.__container = undefined;
        this.__codeMirrorPlaceHolder = undefined;
        this.__codeMirror = undefined;      
    }   

    static get observedAttributes() {
		return LabeledTreezElement.observedAttributes.concat(['mode']);                    
    } 	   	

    async connectedCallback() {         
       

		if(!this.__label){
			var label = document.createElement('label');  
			this.__label = label;                     
			label.innerText = this.label;
			label.className = 'treez-code-area-label';
			this.appendChild(label);  
		}


		if(!this.__container){

			var container = document.createElement('div');			
			this.__container = container;
			this.appendChild(container); 

			var codeMirrorContainer = document.createElement('div');
			codeMirrorContainer.className = 'treez-code-area-container';
			container.appendChild(codeMirrorContainer)

			this.initializeMode();  
			this.initializeValue(); 			

			//Doc on CodeMirror options: https://codemirror.net/doc/manual.html#config	

			await this.initializeCodeMirror();

			var self = this; 
			this.__codeMirror = window.CodeMirror(codeMirrorContainer,  
			  {
				value: self.value,
				mode: self.mode,
				lineNumbers: false, 
				matchBrackets: true,
				continueComments: "Enter",
				extraKeys: {"Ctrl-Q": "toggleComment"}
			  }
			);            

			this.__codeMirror.on('change', 
			    (codeMirror, change) => this.codeMirrorChanged(codeMirror, change) 
			);
		}        

		this.update();
		      
    }

    initializeMode(){  
		if(!this.mode){
			this.mode = 'javascript';
		}
    }

    initializeValue(){
        if(!this.value){
			this.value = '';
		}    	
    }		

			

    codeMirrorChanged(codeMirror, change){
    	var newValue = codeMirror.getValue();               
	    this.value = newValue; 
    }

    async initializeCodeMirror(){
    	if(!window.requirejs){
        	 window.requirejs = await Treez.importScript('/bower_components/requirejs/require.js','require')
                    .catch(error => {
                        console.log(error);
                        throw error;
                    });

			window.requirejs.config({
				baseUrl : '..',
				paths : {
					'codemirror' : 'bower_components/codemirror'
				}
			});
        }

        if(!window.CodeMirror){

        	Treez.importCssStyleSheet('/bower_components/codemirror/lib/codemirror.css');  

        	await new Promise((resolve, reject) => {
				window.requirejs([
					'codemirror/lib/codemirror',						
					'codemirror/mode/sql/sql',
					'codemirror/mode/javascript/javascript',
					'codemirror/mode/python/python',	
					'codemirror/mode/htmlmixed/htmlmixed'			
				], function(
					 CodeMirror
				) {	
					window.CodeMirror=CodeMirror;
					resolve();
				}, function(error){
					console.log(error);
					reject(error);
				});
			});
			
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