import Enum from '../../components/enum.js';

export default class SankeyAlignment extends Enum {}

//also see 
//https://github.com/d3/d3-sankey#sankey_nodeAlign

if(window.SankeyAlignment){
	SankeyAlignment = window.SankeyAlignment;
} else {
	SankeyAlignment.Justify = new SankeyAlignment('Justify');
	SankeyAlignment.Left = new SankeyAlignment('Left');
	SankeyAlignment.Center = new SankeyAlignment('Center');
	SankeyAlignment.Right = new SankeyAlignment('Right');	
	
	window.SankeyAlignment = SankeyAlignment;
}