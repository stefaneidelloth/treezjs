import TreezImageComboBox from '../comboBox/treezImageComboBox.js';
import Enum from "../enum.js";

export default class TreezEnumImageComboBox extends TreezImageComboBox {
       	
    constructor(){
        super();
		this.__enumClass = undefined;
	}

	convertFromStringValue(stringValue){

		if(!this.__enumClass){
			if(!stringValue){
				return null;
			} else {
				throw new Error('Enum class has to be set before retrieving value');
			}			
		}

		if(stringValue === 'undefined'){
			return this.__enumClass.values[0];
		}

		return this.__enumClass.forName(stringValue);

	}

	convertToStringValue(value){

		if(value instanceof Enum){
			return value.name;
		} else {
			return value;
		}

	}

	set enum(enumClass) {
		this.__enumClass = enumClass;
		var optionsString = this.__arrayToString(enumClass.names);
		this.setAttribute('options', optionsString);
	}

	get enum(){
		return this.__enumClass;
	}

	set options(value) {
		throw new Error('Options cannot be set directly. Please set enumClass instead.');
	}

	get options(){
		if(this.__enumClass){
			return this.__enumClass.values;
		} else {
			return [];
		}
	}

}
window.customElements.define('treez-enum-image-combo-box', TreezEnumImageComboBox);