class SymbolStyle extends Enum {

  constructor(name, index){
      super(name);
      this.index=index;
  }

  d3Symbol(dTreez){
      return dTreez.symbols[this.index];
  }

}                 

SymbolStyle.none = new SymbolStyle('none',-1);                    
SymbolStyle.circle = new SymbolStyle('circle',0);                    
SymbolStyle.cross = new SymbolStyle('cross',1);                    
SymbolStyle.diamond = new SymbolStyle('diamond',2);                    
SymbolStyle.square = new SymbolStyle('square',3);  
SymbolStyle.star = new SymbolStyle('star',4);                   
SymbolStyle.triangle = new SymbolStyle('triangle',5);                    
SymbolStyle.why = new SymbolStyle('why',6);                    
           	


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