import Enum from './../enum.js';

export default class SymbolStyle extends Enum {

  constructor(name, d3Name, index){
      super(name);
      this.d3Name = d3Name;
      this.index = index;
  }

  d3Symbol(dTreez){
      return dTreez.symbols[this.index];
  }

}    

if(window.SymbolStyle){
	SymbolStyle = window.SymbolStyle;
} else {
	SymbolStyle.none = new SymbolStyle('none','symbolNone'-1);                    
	SymbolStyle.circle = new SymbolStyle('circle','symbolCircle',0);                    
	SymbolStyle.cross = new SymbolStyle('cross','symbolCross',1);                    
	SymbolStyle.diamond = new SymbolStyle('diamond','symbolDiamond',2);                    
	SymbolStyle.square = new SymbolStyle('square','symbolSquare',3);  
	SymbolStyle.star = new SymbolStyle('star','symbolStart',4);                   
	SymbolStyle.triangle = new SymbolStyle('triangle','symbolTriangle',5);                    
	SymbolStyle.why = new SymbolStyle('wye','symbolWye',6);
	
	window.SymbolStyle = SymbolStyle;
}
           	


//	STAR('star'),

//	BARHORZ('barhorz'),

//	BARVERT('barvert'),

//	PENTAGON('pentagon'),

//	HEXAGON('hexagon'),

//	OCTAGON('octagon'),

//	TIEVERT('tievert'),

//	TIEHORZ('tiehorz'),

//	TRIANGLE('triangle'),

//	TRIANGLE_DOWN('triangledown'),

//	TRIANGLE_LEFT('triangleleft'),

//	TRIANGLE_RIGHT('triangleright'),

//	DOT('dot'),

//	CIRCLE_DOT('circledot'),

//	BULLS_EYE('bullseye'),

//	CIRCLE_HOLE('circlehole'),

//	SQUARE_HOLE('squarehole'),

//	DIAMOND_HOLE('diamondhole'),

//	PENTAGON_HOLE('pentagonhole'),

//	SQUARE_ROUNDED('squarerounded'),

//	SQUASH_BOX('squashbox'),

//	ELLIPSE_HORZ('ellipsehorz'),

//	ELLIPSE_VERT('ellipsevert'),

//	LOSENGE_HORZ('losengehorz'),

//	LOSENGE_VERT('losengevert'),

//	PLUS_NARROW('plusnarrow'),

//	CROSS_NARROW('crossnarrow');