import TreezCodeArea from './treezCodeArea.js';
import Treez from './../../../treez.js';
import {StarboardEmbed} from "../../../../node_modules/starboard-wrap/dist/index.js"

export default class TreezNotebookArea extends TreezCodeArea {

	constructor(){
		super();
		this._codeAreaContainer = undefined;
		this._starboardEmbed = undefined;
		this._changeListener = undefined;
		this._notebookContent = "# %% [javascript]";
	}

    async createEditor(codeAreaContainer){

    	codeAreaContainer.style.height="400px";       
       
        this._starboardEmbed = this.createStarBoard(this._notebookContent);

        codeAreaContainer.appendChild(this._starboardEmbed); 
        this._codeAreaContainer = codeAreaContainer;
           
        return this;       
    }

    recreateEditor(value){
    	this._starboardEmbed = this.createStarBoard(value);
    	this._codeAreaContainer.removeChild(this._codeAreaContainer.childNodes[0]);
        this._codeAreaContainer.appendChild(this._starboardEmbed); 
    }

    createStarBoard(initialValue){
    	//Doc on StarBoard: https://github.com/gzuidhof/starboard-notebook    
        let starboardUrl = "https://cdn.starboard.gg/npm/starboard-notebook@0.13.2/dist/index.html";
        //let starboardUrl = window.treezConfig.home + "/node_modules/starboard-notebook/dist/index.html";       
        let starBoard =  new StarboardEmbed({
            notebookContent: initialValue,
            src: starboardUrl,
            onContentUpdateMessage: (message) => {
            	let notebookContent = message.content;
            	this._notebookContent = notebookContent;
            	if(this._changeListener){
            		this._changeListener(this, notebookContent);
            	}
            }
        });
        return starBoard;
    }

    on(type, listener){
		if(type=="change"){
            this._changeListener = listener;
		}				
	}

	getValue(){
	    return this._notebookContent;
	}

	setValue(value){	
	    this.recreateEditor(value);  			
	}

    disableElements(booleanValue){
		if(booleanValue === undefined){
			throw Error('This method expects a boolean argument');
		}
    	if(this._starboardEmbed){
    		//TODO
    		//disale notebook
    		throw new Error("not yet implemented"); 
    	}
    }

    get fileExtension(){
    	return '.sbnb'; //https://github.com/gzuidhof/starboard-notebook/blob/master/docs/format.md    		
    }

}

window.customElements.define('treez-notebook-area', TreezNotebookArea);