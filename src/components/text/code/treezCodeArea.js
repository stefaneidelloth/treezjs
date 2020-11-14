import LabeledTreezElement from './../../labeledTreezElement.js';
import Treez from './../../../treez.js';

export default class TreezCodeArea extends LabeledTreezElement {

    constructor(){
        super();
        this.__label = undefined;
        this.__container = undefined;
        this.__codeMirrorPlaceHolder = undefined;
        this.__codeMirror = undefined;
        this.__isSettingValue = false;
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

			this.__createToolbar(container);

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
			    codeMirror => this.codeMirrorChanged(codeMirror)
			);
		}

		this.update();

    }

    __createToolbar(container){
    	var toolbar = document.createElement('div');
		toolbar.className = 'treez-code-area-toolbar';
		container.appendChild(toolbar);

		var openButton = document.createElement('input');
		openButton.type='button';
		openButton.title = 'Open file from server';
		openButton.className = 'treez-code-area-open-button';
		openButton.style.background = 'url("' + this.__urlPrefix + '/icons/browse.png")';
		openButton.style.backgroundRepeat = 'no-repeat';
		openButton.onclick = () => this.__openFile();
		container.appendChild(openButton);

		
		var uploadButton = document.createElement('input');
		uploadButton.type='button';
		uploadButton.title = 'Open file from client';
		uploadButton.className = 'treez-code-area-upload-button';
		uploadButton.style.background = 'url("' + this.__urlPrefix + '/icons/upload.png")';
		uploadButton.style.backgroundRepeat = 'no-repeat';
		uploadButton.onclick = (event) => this.__uploadFile(event);
		container.appendChild(uploadButton);

		var downloadButton = document.createElement('input');
		downloadButton.type='button';
		downloadButton.title = 'Download';
		downloadButton.className = 'treez-code-area-download-button';
		downloadButton.style.background = 'url("' + this.__urlPrefix + '/icons/download.png")';
		downloadButton.style.backgroundRepeat = 'no-repeat';
		downloadButton.onclick = () => this.download();
		container.appendChild(downloadButton);
    }

    __openFile(){
	 window.treezTerminal.browseFilePath()
	     .then(async (filePath)=>{
		    if(filePath){	
	            var text = await window.treezTerminal.readTextFile(filePath);
	            this.value = text;			   
		    }  
	  }); 
    }

    __uploadFile(event){
    	const element = document.createElement('input');
		element.type = 'file';
		element.onchange = (event)=>{
			var content = event.srcElement.value;
			document.body.removeChild(element);
			if(content){
				this.value = content;
			}			
		};
		document.body.appendChild(element);		
		element.click(); 
    }

    download(){
        window.treezTerminal.downloadTextFile(this.fileName, this.value);
    }

    get fileName(){
    	return 'download' + this.fileExtension;
    }

    get fileExtension(){
    	switch(this.mode){
    		case 'javascript':
    		    return '.js';
    		case 'python':
    		    return '.py';
    		default:
    		    return '.txt';
    	}; 
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

    codeMirrorChanged(codeMirror){
    	if(this.__isSettingValue){
    		return;
    	}
    	var newValue = codeMirror.getValue();
    	if(this.value.trim() !== newValue.trim()){
    		this.value = newValue;
    	}	    
    }

    async initializeCodeMirror(){
    	if(!window.requirejs){
        	 window.requirejs = await Treez.importScript('/node_modules/requirejs/require.js','require')
                    .catch(error => {
                        console.log(error);
                        throw error;
                    });

			window.requirejs.config({
				baseUrl : '..',
				paths : {
					'codemirror' : 'node_modules/codemirror'
				}
			});
        }

        if(!window.CodeMirror){

        	Treez.importCssStyleSheet('/node_modules/codemirror/lib/codemirror.css');

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
    		var oldValue = this.__codeMirror.getValue();
    		if(oldValue !== newValue) {
    			this.__isSettingValue = true;
    			this.__codeMirror.setValue(newValue);
    			this.__isSettingValue = false;
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

    get __urlPrefix(){
		return window.treezConfig
			?window.treezConfig.home
			:'';
	}


    get mode() {
		 return this.getAttribute('mode');
	}

	set mode(newValue) {
		 this.setAttribute('mode', newValue);
	}

}

window.customElements.define('treez-code-area', TreezCodeArea);