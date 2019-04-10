import TreezImageComboBox from './../imageComboBox/treezImageComboBox.js';
import SymbolStyle from './symbolStyle.js';

export default class TreezSymbolStyle extends TreezImageComboBox {  
            	
	get value() {
		 let stringValue = this.getAttribute('value');
		 try{
		 	return SymbolStyle.forName(stringValue);
		 } catch(error){
			 return null;
		 }
	}  
	
	set value(symbolStyle) {
		super.value = symbolStyle;	
	}  		
	
    constructor(){
        super();                     
    }

    beforeConnectedCallbackHook(){
    	this.options=SymbolStyle.names;
	}  
                         
}

window.customElements.define('treez-symbol-style', TreezSymbolStyle);