import TreezEnumImageComboBox from '../comboBox/treezEnumImageComboBox.js';
import SymbolStyle from './symbolStyle.js';

export default class TreezSymbolStyle extends TreezEnumImageComboBox {  
     	
    constructor(){
        super();                     
    }

    beforeConnectedCallbackHook(){
        this.enum = SymbolStyle;
    }

    get folderName(){
		return 'symbolStyle';
	}                
}

window.customElements.define('treez-symbol-style', TreezSymbolStyle);