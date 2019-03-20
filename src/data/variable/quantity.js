
export default class Quantity {

	constructor(value, unit) {
		this.value = value;
		this.unit = unit;
	}
	
	copy() {
		return new Quantity(this.value, this.unit);
	}

	createQuantityList(values, unit) {		
		var quantities = []
		for (var value of values) {			
			quantities.push(new Quantity(value, unit));
		}
		return quantities;
	}

	createDoubleList(quantities) {
				
		if (quantities.length < 1) {
			return [];
		} else {
			var doubleList = [];
			var firstUnit = quantities[0].unit;
			for (var quantity of quantities) {				
				if (unit === firstUnit) {					
					doubleList.push(quantity.doubleValue);
				} else {
					var message = 'The unit of all quantities has to be the same';
					throw new Error(message);
				}
			}			
			return doubleList;		
		}
	}

	get doubleValue() {
		if (this.value == null) {
			return null;
		}
		return parseDouble('' + this.value);
	}

	toString() {
		var quantityString = '' + value;
		if (this.unit) {
			quantityString += ' ' + unit;
		}
		return quantityString;
	}	

}
