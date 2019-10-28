import LabeledTreezElement from '../labeledTreezElement.js';

//parent class for number inputs (TreezDouble, TreezInteger)
export default class TreezNumber extends LabeledTreezElement {
            	            	
    constructor(){
        super();                                  
        this.__label = undefined;   
        this.__numberInput = undefined;  
    }  
    
    static get observedAttributes() {
		return LabeledTreezElement.observedAttributes.concat(['min','max']);                    
    }  

    connectedCallback() {
    	
        if(!this.__label){                       

            this.className = 'treez-number';
            let label = document.createElement('label');  
            this.__label = label;                     
            label.innerText = this.label;  
            label.className = 'treez-number-label';
            this.appendChild(label);                                                            

            let numberInput = document.createElement('input');
            this.__numberInput = numberInput;
            numberInput.type = 'number'; 
            numberInput.min = this.min;
            numberInput.max = this.max;
            numberInput.className = 'treez-number-input';                
            numberInput.onchange = (event)=> this.__numberInputChanged(event);
            this.appendChild(numberInput);
        }

        if(Number.isNaN(this.min)){
            this.min = Number.MIN_SAFE_INTEGER;       
        }

        if(Number.isNaN(this.max)){
            this.max = Number.MAX_SAFE_INTEGER; 
        }
        
        this.update();
    }    			        

	attributeChangedCallback(attr, oldStringValue, newStringValue) {
    	super.attributeChangedCallback(attr, oldStringValue, newStringValue)                	     	      
    	
        if(attr==='min'){
        	if(this.__numberInput){
        		 this.__numberInput.min = newStringValue;   
        	}                                           
        }	
        
        if(attr==='max'){
        	if(this.__numberInput){
        		 this.__numberInput.max = newStringValue;   
        	}                                           
        }
       
    }  	
    
    updateElements(newValue){
    	if(this.__numberInput){ 
    		this.__numberInput.value = this.convertToStringValue(newValue); 
    	}					    
    }

    updateContentWidth(width){
        this.updateWidthFor(this.__numberInput, width);
    }

    convertFromStringValue(stringValue){
        if(stringValue === undefined || stringValue === null || stringValue === ''){
        	return Number.NaN;
        }

    	return Number(stringValue);
    }

    convertToStringValue(value){
        
        if(value === undefined || value === null || Number.isNaN(value)){
    		return '';
    	}

    	if(typeof value === 'string' || value instanceof String){
    	    throw new Error('The passed value must not be a string but is "'+ value +'"');
    	}
 
    	let directNotation = '' + value;
    	let scientificNotation = value.toExponential().replace('+','');
    	return (scientificNotation.length < directNotation.length)
    		?scientificNotation
    		:directNotation;    	
    }                

    disableElements(booleanValue){
        if(booleanValue === undefined){
            throw Error('This method expects a boolean argument');
        }
		if(this.__numberInput){                    	
			this.__numberInput.disabled = booleanValue;
    	}
    }	
   
    hideElements(booleanValue){
        if(booleanValue === undefined){
            throw Error('This method expects a boolean argument');
        }
    	if(this.__label){   
    		LabeledTreezElement.hide(this.__label, booleanValue);
    		LabeledTreezElement.hide(this.__numberInput, booleanValue); 
    	}
    }

    validateValue(value){        

        if(value > this.max){
            let message = 'Number ' + value + ' exceeds max value ' + this.max + '. ';
            if(this.max === Number.MAX_SAFE_INTEGER){
                message += ('This might cause incorrect calculations. Also see '+
                'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER');
            }             
            return {
                isValid: false,
                errorMessage: message
            };  
        }

        if(value < this.min){
            let message = 'Number ' + value + ' goes below min value ' + this.min + '. ';
            if(this.min === Number.MIN_SAFE_INTEGER){
                message += ('This might cause incorrect calculations. Also see '+
                            'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER');
            }    
            
            return {
                isValid: false,
                errorMessage: message
            };  
        }
        
        return {
            isValid: true,
            errorMessage: undefined
        };  
    }

    __numberInputChanged(event){
        event.stopPropagation();
        let value = this.convertFromStringValue(this.__numberInput.value); //yea, value form input element is a string and needs to be converted    
        let validationState = this.validateValue(value);
        if(validationState.isValid) {
            this.__resetErrorState();
            this.value = value;
        } else {
            this.__showErrorState(validationState.errorMessage);
        }                    	
    }     

    __showErrorState(message){
        this.__numberInput.style.backgroundColor = 'orange';
        this.__numberInput.title = message;
    }

    __resetErrorState(message){
        this.__numberInput.style.backgroundColor = 'white';
        this.__numberInput.title = '';
    }

    get min() {
        return this.convertFromStringValue(this.getAttribute('min'));
    }

    set min(newValue) {
        this.setAttribute('min', this.convertToStringValue(newValue));	
    } 

    get max() {
        return this.convertFromStringValue(this.getAttribute('max'));
    }

    set max(newValue) {
        this.setAttribute('max', this.convertToStringValue(newValue));	
    }
   
                          
}

