export default class OrdinalScaleBuilder {

	constructor() {
		this.__scale = undefined;
		this.__ordinalValues = new Set();
	}

	
	createScale(dTreez, isHorizontal, graphWidthInPx, graphHeightInPx) {
		this.__scale = dTreez.scaleOrdinal();
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
		if (this.__scale) {			
			this.__scale.domain(this.__ordinalValues);
		}
	}

	get scale() {
		return this.__scale;
	}

	get numberOfValues() {
		return this.__scale.domain().sizes()[0];
	}

	get values() {
		return this.__ordinalValues;
	}

	includeDomainValuesForAutoScale(ordinalValuesToInlcude) {
		this.__ordinalValues = new Set([...this.__ordinalValues, ...ordinalValuesToInlcude]);
		this.__updateDomain();
	}

	removeDomainValue(ordinalValueToRemove) {	
		this.__ordinalValues.delete(ordinalValueToRemove); 		
		this.__updateDomain();
	}
	

}
