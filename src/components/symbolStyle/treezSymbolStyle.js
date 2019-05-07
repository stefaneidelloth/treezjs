import TreezImageComboBox from './../imageComboBox/treezImageComboBox.js';
import SymbolStyle from './symbolStyle.js';

export default class TreezSymbolStyle extends TreezImageComboBox {  
     	
    constructor(){
        super();                     
    }

    beforeConnectedCallbackHook(){
    	this.options = SymbolStyle.names;
	} 
    
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
}

window.customElements.define('treez-symbol-style', TreezSymbolStyle);