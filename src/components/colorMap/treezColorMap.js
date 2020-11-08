import TreezSvgComboBox from '../comboBox/treezSvgComboBox.js';
import ColorMap from './colorMap.js';

export default class TreezColorMap extends TreezSvgComboBox {
       	
    constructor(){
        super();                     
    }

    beforeConnectedCallbackHook(){
        var options = {};

        for(var colorMap of ColorMap.values){
        	options[colorMap.name] = this.__createColorMapSvg(colorMap);
        }
        this.options = options;
    }

    __createColorMapSvg(colorMap){
    	return '<svg width="50px" height="15px">\n' +
    	           '<rect width="50px" height="15px" fill="red"/>'
    	       '</svg>';
    }

    
                         
}
window.customElements.define('treez-color-map', TreezColorMap); 