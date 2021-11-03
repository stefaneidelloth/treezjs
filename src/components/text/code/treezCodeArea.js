import LabeledTreezElement from './../../labeledTreezElement.js';
import Treez from './../../../treez.js';

export default class TreezCodeArea extends LabeledTreezElement {

    constructor(){
        super();
        this.__label = undefined;
        this.__container = undefined;
        this.__editorPlaceHolder = undefined;
        this.__editor = undefined;
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
			
			await this.__createCodeArea(container);			
		}

		this.update();
    }
    
    async __createCodeArea(container){
        var codeAreaContainer = document.createElement('div');
        codeAreaContainer.className = 'treez-code-area-container';
        container.appendChild(codeAreaContainer)

        this.initializeMode();
        this.initializeValue();

        this.__editor = await this.createEditor(codeAreaContainer);

        this.__editor.on('change', editor => this.editorChanged(editor)
        );
    }

     editorChanged(editor){
    	if(this.__isSettingValue){
    		return;
    	}
    	var newValue = editor.getValue();
    	if(this.value.trim() !== newValue.trim()){
    		this.value = newValue;
    	}	    
    }

    async createEditor(codeAreaContainer){
        throw new Error('Needs to be overridden by inheriting class');
    }

    __createToolbar(container){
    	var toolbar = document.createElement('div');
		toolbar.className = 'treez-code-area-toolbar';
		container.appendChild(toolbar);

		this.__createOpenButton(container);
		this.__createSaveButton(container);
		this.__createUploadButton(container);
		this.__createDownloadButton(container);
		
    }

    __createOpenButton(container){
        var button = document.createElement('input');
		button.type='button';
		button.title = 'Open';
		button.className = 'treez-code-area-button';
		button.style.background = 'url("' + this.__urlPrefix + '/icons/browse.png")';
		button.style.backgroundRepeat = 'no-repeat';
		button.onclick = () => this.__openFile();
		container.appendChild(button);
    }

    __createSaveButton(container){
    	var button = document.createElement('input');
		button.type='button';
		button.title = 'Save';
		button.className = 'treez-code-area-button';
		button.style.background = 'url("' + this.__urlPrefix + '/icons/save.png")';
		button.style.backgroundRepeat = 'no-repeat';
		button.onclick = () => this.__saveFile();
		container.appendChild(button);
    }

    __createUploadButton(container){
    	var button = document.createElement('input');
		button.type='button';
		button.title = 'Upload';
		button.className = 'treez-code-area-button';
		button.style.background = 'url("' + this.__urlPrefix + '/icons/upload.png")';
		button.style.backgroundRepeat = 'no-repeat';
		button.onclick = (event) => this.__uploadFile(event);
		container.appendChild(button);
    }

    __createDownloadButton(container){
    	var button = document.createElement('input');
		button.type='button';
		button.title = 'Download';
		button.className = 'treez-code-area-button';
		button.style.background = 'url("' + this.__urlPrefix + '/icons/download.png")';
		button.style.backgroundRepeat = 'no-repeat';
		button.onclick = () => this.download();
		container.appendChild(button);
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

    __saveFile(){
    	window.treezTerminal.inputDialog('export.svg','Save as...')
    	    .then(async (filePath) => {
    	    	if(filePath){    	    	   
    	    	    window.treezTerminal.saveTextFile(filePath, this.value);
    	    	}
    	});
    }   

    __uploadFile(event){
    	const element = document.createElement('input');
		element.type = 'file';
		element.onchange = async (event)=>{
			if(event.srcElement.files.length < 1){
				return
			}
			let file = event.srcElement.files[0];
			let content = await file.text();
			
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

   

    attributeChangedCallback(attr, oldStringValue, newStringValue) {
		super.attributeChangedCallback(attr, oldStringValue, newStringValue)

		if(attr==='mode'){
			if(this.__editor){
				this.__editor.setOption('mode', newStringValue);
			}
		}
	}

	updateElements(newValue){
    	if(this.__editor){
    		var oldValue = this.__editor.getValue();
    		if(oldValue !== newValue) {
    			this.__isSettingValue = true;
    			this.__editor.setValue(newValue);
    			this.__isSettingValue = false;
    		}
    	}
    }

    updateContentWidth(width){
		super.updateWidth(width);
		this.updateWidthFor(this.__container, width);
    	if(this.__editor){
    		//TODO
    		//this.__editor.setSize(width, null);
    	}
    }

	updateWidth(newValue){
		this.updateContentWidth(newValue)
	}

    disableElements(booleanValue){
		if(booleanValue === undefined){
			throw Error('This method expects a boolean argument');
		}
    	if(this.__editor){
    		this.__editor.options.disableInput = booleanValue;

    		let parentDiv = this.__editor.getScrollerElement().parentNode;

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
    	if(this.__editor){
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