import TreezTabFolder from './treezTabFolder.js';

export default class TreezTab extends HTMLElement {
            	
	static get observedAttributes() {
		return TreezElement.observedAttributes.concat(['label']);                    
    }
	
	get label() {
	  return this.getAttribute('label');
	}

	set label(newValue) {
	  this.setAttribute('label', newValue);	
	} 

    constructor(){
        super();                   
        this.tabHeader=undefined;
    }

    static get observedAttributes() {
        return ['label']; 
    }               

    connectedCallback() { 
		let tabFolder = this.parentElement;
		if(tabFolder){			
			tabFolder.createTabHeaderForTabIfNotExists(this);
		}               
    }

    disconnectedCallback(){
    	//console.log('disconnected callback');
    	while (this.firstChild) {
			this.removeChild(this.firstChild);
		}
    }

    adoptedCallback(){
        //console.log('adopted callback');
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        if(attr==='label' && this.tabHeader){
            this.tabHeader.innerText= newValue;                       
        }
    } 
   
}

window.customElements.define('treez-tab', TreezTab);