export default class TreezSectionAction extends HTMLElement {

	static get observedAttributes() {
        return ['image','label'];
    }

    get actions(){
		return this.__actions;
	}

    get image() {
	  return this.getAttribute('image');
	}

	set image(image) {
	  this.setAttribute('image', image);
	}

	 get label() {
	  return this.getAttribute('label');
	}

	set label(label) {
	  this.setAttribute('label', label);
	}
	
    constructor(){
        super();  
        this.__actions = [];                  
    }                            

    addAction(action){
    	this.__actions.push(action);                	
    } 
}

window.customElements.define('treez-section-action', TreezSectionAction);       