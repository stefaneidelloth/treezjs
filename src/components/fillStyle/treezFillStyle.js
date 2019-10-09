import TreezEnumImageComboBox from '../comboBox/treezEnumImageComboBox.js';
import FillStyle from './fillStyle.js';

export default class TreezFillStyle extends TreezEnumImageComboBox {  
    	
    constructor(){
        super();                     
    }

    beforeConnectedCallbackHook(){
        this.enum = FillStyle;
    }

    get folderName(){
		return 'fillStyle';
	}
                         
}

window.customElements.define('treez-fill-style', TreezFillStyle);