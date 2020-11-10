import TreezDouble from './treezDouble.js';

export default class TreezUnitInterval extends TreezDouble {
            	            	
    constructor(){
        super();                  
    }            	

    connectedCallback() {
        super.connectedCallback();
        let numberInput = this.__numberInput; 
        this.min = 0;
        this.max = 1;
        this.step = '0.1';                     
    }  
                          
}

window.customElements.define('treez-unit-interval', TreezUnitInterval);