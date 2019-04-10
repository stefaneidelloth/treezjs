import Enum from './../../components/enum.js';

// The possible units for geometric length that are used with treez graphics
export default class LengthUnit extends Enum {
	
	constructor(name, conversionFactor){
		super(name);
		this.conversionFactor = conversionFactor;
	}	
	
}

var defaultResulution = 96; //dpi

LengthUnit.cm = new LengthUnit('cm', defaultResulution / 2.54);
LengthUnit.mm = new LengthUnit('mm', defaultResulution / 25.4),
LengthUnit.in = new LengthUnit('in', defaultResulution);
LengthUnit.pt = new LengthUnit('pt', defaultResulution / 72);
LengthUnit.px = new LengthUnit('px', 1);