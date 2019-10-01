import TreezTabFolder from './treezTabFolder.js';

export default class TreezTab extends HTMLElement {

    static get observedAttributes() {
        return ['label'];
    }

    constructor(){
        super();                   
        this.tabHeader=undefined; //also see usage in TreezTabFolder
    }

    connectedCallback() { 
		let tabFolder = this.parentElement;
		if(tabFolder){			
			tabFolder.createTabHeaderForTabIfNotExists(this);
		}               
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        if(attr==='label' && this.tabHeader){
            this.tabHeader.innerText= newValue;
        }
    }

    disconnectedCallback(){
    	while (this.firstChild) {
			this.removeChild(this.firstChild);
		}
    }

    get label() {
        return this.getAttribute('label');
    }

    set label(newValue) {
        this.setAttribute('label', newValue);
    }

}

window.customElements.define('treez-tab', TreezTab);