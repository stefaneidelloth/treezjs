import TreezEnumImageComboBox from '../comboBox/treezEnumImageComboBox.js';
import ColorMap from './colorMap.js';

export default class TreezColorMap extends TreezEnumImageComboBox {
       	
    constructor(){
        super();                     
    }

    beforeConnectedCallbackHook(){
        this.enum = ColorMap;
    }

    get folderName(){
		return 'colorMap';
	}
                         
}
window.customElements.define('treez-color-map', TreezColorMap); 