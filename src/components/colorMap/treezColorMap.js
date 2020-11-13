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
        var width = 150;
        var colors = colorMap.colors;
        var id = 'treez-color-map-' + this.uniqueId() +'-' + colorMap;
        var svgText = '<svg width="'+ width +'px" height="15px">\n' +
        '    <defs>\n' +
        '        <linearGradient id="' + id + '" x1="0%" y1="0%" x2="100%" y2="0%">\n';
        var offset = 0;
        for(var color of colors){
            svgText += '            <stop offset="'+offset+ '%" style="stop-color:'+color+';stop-opacity:1" />\n';
            offset+=10;
        }
        svgText += '        </linearGradient>\n' +
        '    </defs>\n' +
        '    <rect width="'+ width +'px" height="15px" fill="url(#' + id + ')"/>\n';
        '</svg>'; 
        return svgText; 
    }  
    
                         
}
window.customElements.define('treez-color-map', TreezColorMap); 