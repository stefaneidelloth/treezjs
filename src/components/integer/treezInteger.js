import LabeledTreezElement from './../labeledTreezElement.js';

export default class TreezInteger extends LabeledTreezElement {
            	            	
    constructor(){
        super();                                  
        this.__label = undefined;   
        this.__numberInput = undefined;                            
    }            	

    connectedCallback() {
    	
        if(!this.__label){                       

            var label = document.createElement('label');  
            this.__label = label;                     
            label.innerText = this.label;  
            label.setAttribute('class','treez-integer-label');
            this.appendChild(label);                                                            

            var numberInput = document.createElement('input'); 
            numberInput.type = 'number';
            numberInput.step = '1';
            numberInput.max = Number.MAX_SAFE_INTEGER;
            
            this.__numberInput = numberInput;
            this.appendChild(numberInput); 
            numberInput.setAttribute('class','treez-integer')                
            numberInput.onchange = (event)=>{
            	event.stopPropagation();
            	this.__numberInputChanged();
            }
        }

        if(!this.width){
        	this.width='99%';
        }
        
        this.updateElements(this.value);	
        this.disableElements(this.disabled)
		this.hideElements(this.hidden); 
    }

    updateElements(newValue){
    	if(this.__numberInput){ 
    		this.__numberInput.value= this.convertToStringValue(newValue); 
    	}					    
    }
    
    __numberInputChanged(){
    	this.value = this.convertFromStringValue(this.__numberInput.value);                	
    }
    
    convertFromStringValue(stringValue){
        if(stringValue === undefined || stringValue === ''){
        	return undefined;
        }

    	var number = Math.floor(Number(stringValue));
    	if(number > Number.MAX_SAFE_INTEGER){    	
    		console.warn('Number '+number+' exceeds MAX_SAFE_INTEGER ' + Number.MAX_SAFE_INTEGER);
    	}    	
    	return number;
    }

    convertToStringValue(value){
    	if(value === undefined || value === null || value === Number.NaN){
    		return '';
    	}
    	var directNotation = '' + value;
    	var scientificNotation = value.toExponential().replace('+','');
    	return (scientificNotation.length < directNotation.length)
    		?scientificNotation
    		:directNotation;    	
	}

    updateWidth(width){
    	if(this.__numberInput){ 
    		this.__numberInput.style.width = width;  //TODO: consider label width?   
    	}                	
    }                 

    disableElements(newValue){
		if(this.__numberInput){                    	
			this.__numberInput.disabled= newValue; 
    	}
    }	
   
    hideElements(booleanValue){
    	if(this.__label){   
    		LabeledTreezElement.hide(this.__label, booleanValue);
    		LabeledTreezElement.hide(this.__numberInput, booleanValue); 
    	}
    }      
                          
}

window.customElements.define('treez-integer', TreezInteger);