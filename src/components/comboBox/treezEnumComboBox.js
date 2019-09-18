import TreezComboBox from './treezComboBox.js';

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
		
	set options(enumClass) {
		this.__enumClass = enumClass;		
		var optionsString = enumClass.names.join(',');
	  	this.setAttribute('options', optionsString);	
	}              		
                          
}

window.customElements.define('treez-enum-combo-box', TreezEnumComboBox);