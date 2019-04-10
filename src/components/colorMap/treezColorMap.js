import TreezImageComboBox from './../imageComboBox/treezImageComboBox.js';
import ColorMap from './colorMap.js';

export default class TreezColorMap extends TreezImageComboBox {  
            	
	get value() {
		 let stringValue = this.getAttribute('value');
		 try{
		 	 return ColorMap.forName(stringValue);
		 } catch(error){
			 return null;
		 }					
	}  
	
	set value(colorMap) {
		super.value = colorMap;	
	}  		
	
    constructor(){
        super();                     
    }  

    beforeConnectedCallbackHook(){
    	 this.options=ColorMap.names;
	} 
                         
}
window.customElements.define('treez-color-map', TreezColorMap); 