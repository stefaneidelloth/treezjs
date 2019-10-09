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

			this.__recreateOptionTags();

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

	attributeChangedCallback(attr, oldValue, newValue) {
		super.attributeChangedCallback(attr, oldValue, newValue)

		if(attr==='options'){
			if(this.__comboBox){
				this.__recreateOptionTags();
			}
		}
	}
    
    updateElements(newValue){
    	if(this.__comboBox){                    	
			this.__comboBox.value= '' + newValue; 
    	}	
    }

    disableElements(booleanValue){
		if(booleanValue === undefined){
			throw Error('This method expects a boolean argument');
		}
    	if(this.__comboBox){   
    		this.__comboBox.disabled = booleanValue;
    	}
    }	
   
    hideElements(booleanValue){
		if(booleanValue === undefined){
			throw Error('This method expects a boolean argument');
		}
    	if(this.__container){   
    		LabeledTreezElement.hide(this.__container, booleanValue);                		
    	}
    }

	hasOption(option){
		return this.options.indexOf(option) > -1
	}

	__comboBoxChanged(){
		let index = this.__comboBox.selectedIndex;
		let newInputValue = this.__comboBox.options[index].value;
		this.value =  this.convertFromStringValue(newInputValue);
	}

	__recreateOptionTags(){
	    var comboBox = this.__comboBox;
	    var oldValue = comboBox.value;

		while (comboBox.hasChildNodes()) {
			comboBox.removeChild(comboBox.lastChild);
		}

		if(this.hasOptions){
			this.options.forEach(option=>{
				var optionTag = this.__createOptionTag(option)						
				comboBox.appendChild(optionTag);
			});

			if(oldValue){
				if (this.hasOption(oldValue)){
					comboBox.value = oldValue;
				} else {
					this.value = this.options[0];
				}
			}	
		}		
	}	
	
	__createOptionTag(option){
		var optionTag = document.createElement('option')
	 	optionTag.innerText=option;
		return optionTag;
	}

	__arrayToString(stringArray){
		let optionsString = '[]';
		if(stringArray){
			if(stringArray.length > 0){
				optionsString = '["' + stringArray.join('","') + '"]';
			}
		}
		return optionsString;
	}

	hasOption(option){
		return this.options.indexOf(option) > -1;
	}
    
  	get value(){
  		return super.value;
  	} 

  	set value(value) {
	  var stringValue = this.convertToStringValue(value);
	  if(stringValue === null){
		  this.removeAttribute('value');
	  } else {
	  	this.setAttribute('value', stringValue);	  	
	  }
	}	

  	set value(newValue) {
  		let stringValue = this.convertToStringValue(newValue);

  		if(stringValue === null){
		  this.removeAttribute('value');
		} else {
			
			if(this.hasOptions){
				if (this.hasOption(newValue)){
					this.setAttribute('value', stringValue);	
				} else {
					throw new Error("The option '"+ stringValue +"' is not known by the combo box. Available options: " + this.options);
				}   
			} else {
				this.setAttribute('value', stringValue); //stores value to use it as default, for the case that it is included in the options to set
			}	
		}   		
  	}  
  	
  	get options() {
    	let optionsString = this.getAttribute('options');
    	if(optionsString){
    		return eval(optionsString);
		} else {
    		return [];
		}
    }

    set options(optionsArray) {
    	let optionsString = this.__arrayToString(optionsArray);
    	this.setAttribute('options', optionsString);
    }

	get hasOptions(){
		return this.options.length > 0;
	}
                            
}

window.customElements.define('treez-combo-box', TreezComboBox);                    

       