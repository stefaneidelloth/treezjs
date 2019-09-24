import LabeledTreezElement from './../labeledTreezElement.js';

export default class TreezComboBox extends LabeledTreezElement {

    constructor(){
        super(); 
        this.__container = undefined;
        this.__comboBox = undefined;   
        this.__label = undefined;                         
    }  
    
    static get observedAttributes() {
		return LabeledTreezElement.observedAttributes.concat(['options']);                    
    } 

    connectedCallback() {
    
        if(!this.__comboBox){   

			var container = document.createElement('div');  
			this.__container = container;
			container.className = 'treez-combo-box-container';
			this.appendChild(container);      

			var label = document.createElement('label');
			this.__label = label;
			label.className = 'treez-combo-box-label';
			label.innerText = this.label;                                            
			container.appendChild(label);             

			var comboBox = document.createElement('select');                       
			this.__comboBox = comboBox;	
			comboBox.className = 'treez-combo-box-select';
			comboBox.onchange = () => this.__comboBoxChanged();                                              
			container.appendChild(comboBox); 
			
			if(this.getAttribute('options')){
               this.__recreateOptionTags();	                           
			}                                     		
        }

        var initialValue;
        try{
        	initialValue = this.value;
        } catch(error){
        	
        }
        
        this.updateElements(initialValue);	
        this.disableElements(this.disabled)
		this.hideElements(this.hidden); 
    }  	
    
    updateElements(newValue){
    	if(this.__comboBox){                    	
			this.__comboBox.value= '' + newValue; 
    	}	
    }
    
    __comboBoxChanged(){
	    let index = this.__comboBox.selectedIndex;	
	    let newInputValue = this.__comboBox.options[index].value; 				   	
    	this.value =  this.convertFromStringValue(newInputValue);    	
    } 
   
    disableElements(booleanValue){
    	if(this.__comboBox){   
    		this.__comboBox.disabled = booleanValue;
    	}
    }	
   
    hideElements(booleanValue){
    	if(this.__container){   
    		LabeledTreezElement.hide(this.__container, booleanValue);                		
    	}
    }    

	__recreateOptionTags(){
	    var comboBox = this.__comboBox;
	    var oldValue = comboBox.value;

		while (comboBox.hasChildNodes()) {
			comboBox.removeChild(comboBox.lastChild);
		}

		var options = this.getAttribute('options');
		if(options){
			var optionEntries = options.split(',');
			optionEntries.forEach(option=>{
				var optionTag = TreezComboBox.__createOptionTag(option)						
				comboBox.appendChild(optionTag);
			});

			if(oldValue){
				if (optionEntries.indexOf(oldValue) > -1){
					comboBox.value = oldValue;
				} else {
					if (optionEntries.length > 0 ){
						this.value = optionEntries[0];
					}
				}
			}	
		}		
	}	
	
	static __createOptionTag(option){
		var optionTag = document.createElement('option')
	 	optionTag.innerText=option;
		return optionTag;
	}

    attributeChangedCallback(attr, oldValue, newValue) {
    	super.attributeChangedCallback(attr, oldValue, newValue)                     
		
		if(attr==='options'){
        	if(this.__comboBox){                    		
        		 this.__recreateOptionTags();
        	}                                           
        } 
    }
    
  	get value(){
  		return super.value;
  	} 	

  	set value(newValue) {

  		if(newValue === undefined){
  			throw new Error("Value for combo box must not be undefined!");
  		}

  		if(newValue === null){
  			this.setAttribute('value', null);
  			return;
		}
  		
  		let stringValue = newValue.toString();

  		var options = this.getAttribute('options');
  		if(options){
  			var optionEntries = options.split(',');
  			if (optionEntries.indexOf(stringValue) > -1){
  				this.setAttribute('value', stringValue);	
  			} else {
  				throw new Error("The option '"+ stringValue +"' is not known by the combo box. Available options: " + this.options);
  			}   
  		} else {
  			this.setAttribute('value', stringValue);
  		}
  	}  
  	
  	get options() {
  		return this.getAttribute('options');
    }

    set options(newValue) {
    	this.setAttribute('options', newValue);	
    } 
                            
}

window.customElements.define('treez-combo-box', TreezComboBox);                    

       