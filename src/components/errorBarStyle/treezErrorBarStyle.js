import TreezImageComboBox from './../imageComboBox/treezImageComboBox.js';
import ErrorBarStyle from './errorBarStyle.js';

export default class TreezErrorBarStyle extends TreezImageComboBox {  
            	
	get value() {
		 let stringValue = this.getAttribute('value');
		 try{
		 	return ErrorBarStyle.forName(stringValue);
		 } catch(error){
		 	return null;
		 }
	}  
	
	set value(errorBarStyle) {
		super.value = errorBarStyle;	
	}  		
	
    constructor(){
        super();                     
    }  

    beforeConnectedCallbackHook(){
    	 this.options=ErrorBarStyle.names;
	} 
                         
}

window.customElements.define('treez-error-bar-style', TreezErrorBarStyle);