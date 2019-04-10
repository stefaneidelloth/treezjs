import TreezImageComboBox from './../imageComboBox/treezImageComboBox.js';
import FillStyle from './fillStyle.js';

export default class TreezFillStyle extends TreezImageComboBox {  
            	
	get value() {
		 let stringValue = this.getAttribute('value');
		 try{
		 	return FillStyle.forName(stringValue);
		 } catch(error){
			 return null;
		 }
	}  
	
	set value(fillStyle) {
		super.value = fillStyle;	
	}  		
	
    constructor(){
        super();                    
    } 

    beforeConnectedCallbackHook(){
    	 this.options=FillStyle.names;
	} 
                         
}

window.customElements.define('treez-fill-style', TreezFillStyle);