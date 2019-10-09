import TreezEnumImageComboBox from '../comboBox/treezEnumImageComboBox.js';
import ErrorBarStyle from './errorBarStyle.js';

export default class TreezErrorBarStyle extends TreezEnumImageComboBox {  
     	
   constructor(){
        super();                     
    }

    beforeConnectedCallbackHook(){
        this.enum = ErrorBarStyle;
    }

    get folderName(){
		return 'errorBarStyle';
	}
                         
}

window.customElements.define('treez-error-bar-style', TreezErrorBarStyle);