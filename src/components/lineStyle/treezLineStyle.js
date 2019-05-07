import TreezImageComboBox from './../imageComboBox/treezImageComboBox.js';
import LineStyle from './lineStyle.js';

export default class TreezLineStyle extends TreezImageComboBox {  
    	
    constructor(){
        super();                    
    }  
    
    beforeConnectedCallbackHook(){
    	 this.options=LineStyle.names;
	}
    
    get value() {
		 let stringValue = this.getAttribute('value');
		 try{
		 	return LineStyle.forName(stringValue);
		 } catch(error){
			 return null;
		 }
	}  
	
	set value(lineStyle) {
		super.value = lineStyle;	
	}  	
                         
}

window.customElements.define('treez-line-style', TreezLineStyle);