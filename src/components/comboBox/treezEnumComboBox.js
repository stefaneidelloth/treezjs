import TreezComboBox from './treezComboBox.js';
import Enum from './../enum.js';

export default class TreezEnumComboBox extends TreezComboBox {            	       	
				
    constructor(){
        super(); 
        this.__enumClass = undefined;                        
    }  

    convertFromStringValue(stringValue){

    	if(!this.__enumClass){
			throw new Error('Options have to be set before retrieving value');
		}

    	if(stringValue === 'undefined'){
			return this.__enumClass.values[0];
		}
		
		return this.__enumClass.forName(stringValue);
		                	
	} 
		
	set options(enumClass) { //using/overriding attribute name "options" ensures that the super attribute "options" of TreezComboBox is not used by mistake.
		this.__enumClass = enumClass;		
		var optionsString = this.__arrayToString(enumClass.names);
	  	this.setAttribute('options', optionsString);	
	}

	get options(){
    	return this.__enumClass;
	}

	get value(){
		let stringValue = super.value;
		return this.__enumClass.forName(stringValue);
	}

	set value(value) {
    	if(value instanceof Enum){
			super.value = enumValue.name;
		} else {
			super.value = value;
		}
	}
                          
}

window.customElements.define('treez-enum-combo-box', TreezEnumComboBox);