import TreezCodeArea from './treezCodeArea.js';

export default class TreezSvg extends TreezCodeArea {    

   	constructor(){
   		super();
   		this.__svgContainer = undefined;
   	}

    async connectedCallback() {         
       await super.connectedCallback();
	
       this.__svgContainer = document.createElement('div');
       this.__svgContainer.setAttribute('id','svg-container');
       this.__container.appendChild(this.__svgContainer);
       this.codeMirrorChanged(this.__codeMirror);				      
    }

    codeMirrorChanged(codeMirror){
    	super.codeMirrorChanged(codeMirror);
    	if(this.__svgContainer){
    		try{
    			//var onErrorBackup = window.onerror;
    			//window.onerror = (message) => {
    			//	console.warn('Could not display svg\n:'+message);
    			//}
                this.__svgContainer.innerHTML = codeMirror.getValue();
               
    		} catch(error){
     		    console.warn('Could not display svg.', error);	
    		}    		
    	}    	
    } 

    download(){
    	var svgText = this.value.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
        window.treezTerminal.downloadTextFile(this.fileName, svgText);
    }

    initializeMode(){  
		//overrides super method to do nothing
    }

    initializeValue(){
        if(!this.value){
			this.value = 
			'<svg with="16" height="16">\n' +
			    '\t<circle r="8" cx="8" cy="8" fill="red"/>\n' +
			'</svg>';
		}    	
    }    

    

    get mode() {
		 return 'htmlmixed';
	}   

	get fileExtension(){
    	return '.svg';
    }
                              
}

window.customElements.define('treez-svg', TreezSvg);