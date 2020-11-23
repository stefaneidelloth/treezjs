import Enum from '../../components/enum.js';

export default class LabelAlignment extends Enum {}

if(window.LabelAlignment){
	LabelAlignment = window.LabelAlignment;
} else {
	LabelAlignment.Above = new LabelAlignment('Above');	
	LabelAlignment.Center = new LabelAlignment('Center');
	LabelAlignment.Below = new LabelAlignment('Below');	
	
	window.LabelAlignment = LabelAlignment;
}