import TreezEnumImageComboBox from '../comboBox/treezEnumImageComboBox.js';
import LineStyle from './lineStyle.js';

export default class TreezLineStyle extends TreezEnumImageComboBox {  
    	
   constructor(){
        super();                     
    }

    beforeConnectedCallbackHook(){
        this.enum = LineStyle;
    }

    get folderName(){
		return 'lineStyle';
	}
                         
}

window.customElements.define('treez-line-style', TreezLineStyle);