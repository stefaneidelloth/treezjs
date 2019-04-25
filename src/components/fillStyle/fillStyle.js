import Enum from './../enum.js';

export default class FillStyle extends Enum {}
  
if(window.FillStyle){
	FillStyle = window.FillStyle;
} else {
	FillStyle.solid = new FillStyle('solid');                    
	FillStyle.vertical = new FillStyle('vertical');                    
	FillStyle.horizontal = new FillStyle('horizontal');                    
	FillStyle.cross = new FillStyle('cross');
	window.FillStyle = FillStyle;
}