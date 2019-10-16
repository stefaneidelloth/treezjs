import TreezNumber from './treezNumber.js';

export default class TreezDouble extends TreezNumber {
            	            	
    constructor(){
        super();                  
    }            	

    connectedCallback() {
        super.connectedCallback();
        let numberInput = this.__numberInput;
        numberInput.step = 'any';        
    }  
                          
}

window.customElements.define('treez-double', TreezDouble);