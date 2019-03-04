export default class OrdinalScaleBuilder {

	constructor() {
		this.__scale=undefnied;
		this.__ordinalValues = new Set();
	}

	
	createScale(scales, isHorizontal, graphWidthInPx, graphHeightInPx) {
		this.__scale = scales.ordinal();
		this.__createRange(isHorizontal, graphWidthInPx, graphHeightInPx);
		this.__updateDomain();
	}

	__createRange(isHorizontal, graphWidthInPx, graphHeightInPx) {
		if (isHorizontal) {
			this.__scale.rangeRoundPoints(0.0, graphWidthInPx, 1);
		} else {
			this.__scale.rangeRoundPoints(graphHeightInPx, 0.0, 1);
		}
	}

	__updateDomain() {
		if (this.__scale != null) {			
			this.__scale.domain(this.__ordinalValues);
		}
	}

	getScale() {
		return this.__scale;
	}

	getNumberOfValues() {
		return this.__scale.domain().sizes().get(0);
	}

	getValues() {
		return this.__ordinalValues;
	}

	includeDomainValuesForAutoScale(ordinalValues) {
		this.__ordinalValues = this.__ordinalValues.concat(ordinalValues);
		this.__updateDomain();
	}

	removeDomainValue(ordinalValue) {
		this.__ordinalValues.remove(ordinalValue); //todo implement remove
		this.__updateDomain();
	}
	

}
