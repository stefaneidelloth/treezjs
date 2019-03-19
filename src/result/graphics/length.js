import LengthUnit from './lengthUnit.js';

//Represents a geometric length consisting of a value and a LengthUnit.
export default class Length {

	constructor(value, unit) {
		this.value = value;
		this.unit = unit;
	}
	

	static parse(lengthExpression) {

		if(isNaN(lengthExpression)){
			var expression = lengthExpression.trim().replace(' ','');
			var unitRegularExpression = /[a-zA-Z]{2,}/g;
			var subStrings = expression.split(unitRegularExpression);

			if (subStrings.length !== 2) {
				throw new Error('Could not parse the length expression "' + lengthExpression + '"');
			}

			var valueString = subStrings[0];
			var unitString = expression.substring(valueString.length);
			if (valueString === '') {
				return new Length(0.0, unitString);
			}
			try {
				var value = parseFloat(valueString);
				var unit = LengthUnit.forName(unitString);
				return new Length(value, unit);
			} catch (error) {
				throw new Error('Could not parse the length expression "' + lengthExpression + '"');
			}
		} else {
			var value = parseFloat(lengthExpresssion);
			return new Length(value, LengthUnit.px);
		}
		
		
	}	

	/**
	 * Parses the given length expression as Length and returns its value in px
	 * (assuming a default resolution of 96 dpi)
	 */
	static toPx(lengthExpression) {
		var length = Length.parse(lengthExpression);
		return length.px;		
	}

	/**
	 * Returns the value of the Length in px (assuming a default resolution of
	 * 96 dpi)
	 */
	get px() {
		return this.value * this.unit.conversionFactor;		
	}

	/**
	 * Returns the value of the Length in the given LengthUnit (assuming a
	 * default resolution of 96 dpi)
	 */
	getValueIn(unit) {

		if (unit.equals(this.unit)) {
			return value;
		}		
		return this.px / unit.conversionFactor;
		
	}

	toString() {
		return '' + this.value + this.unit;		
	}	

}
