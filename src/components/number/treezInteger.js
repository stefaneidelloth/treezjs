import TreezNumber from './treezNumber.js';

export default class TreezInteger extends TreezNumber {
            	            	
    constructor(){
        super();               
    }            	

    connectedCallback() {
        super.connectedCallback();
        var numberInput = this.__numberInput;
        numberInput.step = '1';    	
    }

    validateValue(value){
        var superValidationState = super.validateValue(value);
        if(!superValidationState.isValid){
            return superValidationState;
        }

        var isInteger = Math.floor(value) === value;
        if(!isInteger){
            return {
                isValid: false,
                errorMessage: 'The entered number is no integer. Please add missing exponent or remove decimal places.'
            };
        }

        return {
            isValid: true,
            errorMessage: undefined
        };
    }   
                          
}

window.customElements.define('treez-integer', TreezInteger);