export default class OrdinalScaleBuilder {

	constructor() {
		this.__scale = undefined;
		this.__ordinalValues = new Set();
	}

	
	createScale(dTreez, isHorizontal, graphWidthInPx, graphHeightInPx) {
		this.__scale = dTreez.scaleBand();
		this.__createRange(isHorizontal, graphWidthInPx, graphHeightInPx);
		this.__updateDomain();
	}

	__createRange(isHorizontal, graphWidthInPx, graphHeightInPx) {
		if (isHorizontal) {
			this.__scale.rangeRound([0.0, graphWidthInPx])
						.padding(1);
		} else {
			this.__scale.rangeRound([graphHeightInPx, 0.0])
						.padding(1);
		}
	}

	__updateDomain() {
		if (this.__scale) {	
		    let domainArray = [... this.__ordinalValues];
			this.__scale.domain(domainArray);
		}
	}

	get scale() {
		return this.__scale;
	}

	get numberOfValues() {
		return this.__scale.domain().length;
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
