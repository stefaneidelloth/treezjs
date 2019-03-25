export default class QuantitativeScaleBuilder {

	constructor(parent) {
		this.__parent = parent;
		this.__scale = undefined;
		this.__dataForAutoScale = [];
	}

	createScale(scaleFactory, graphWidthInPx, graphHeightInPx) {

		if (this.__parent.data.isLog) {
			this.__scale = scaleFactory //
					.log() //
					.clamp(true);

		} else {
			this.__scale = scaleFactory //					
					.clamp(true);
		}

		this.__createRange(graphWidthInPx, graphHeightInPx);
		this.__updateManualLimits();
		this.__updateAutoLimits();
	}
	
	includeDomainValuesForAutoScale(dataForAutoScale) {
		var minAndMax = this.__getMinAndMax(dataForAutoScale);
		this.dataForAutoScale = this.dataForAutoScale.concat(minAndMax).sort();
		this.__updateAutoLimits();
	}

	includeForAutoScale(valueToInclude) {
		var added = this.__dataForAutoScale.push(valueToInclude);  //todo check if this works
		if (added) {
			this.__dataForAutoScale = this.__dataForAutoScale.sort();
			this.__updateAutoLimits();
		}
	}

	clearDataForAutoScale() {
		this.__dataForAutoScale.length = 0;
		this.__updateAutoLimits();
	}

	excludeForAutScale(valueToExclude) {
		var removeIndex = this.__dataForAutoScale.indexOf(valueToExclude);
		if(removeIndex >-1){
			this.__dataForAutoScale.splice(remvoeIndex,1);
			this.__updateAutoLimits();
		}		
	}

	__createRange(graphWidthInPx, graphHeightInPx) {
		if (this.__parent.data.isHorizontal) {
			this.__scale.range(0.0, graphWidthInPx);
		} else {
			this.__scale.range(graphHeightInPx, 0.0);
		}
	}

	__updateManualLimits() {
		if (!this.__scale) {
			return;
		}

		if (!this.__parent.data.autoMin) {
			var minValue = this.__correctMinIfLogScaleAndZero(parseFloat(this.__parent.data.min));
			this.__minScaleValue = minValue;
		}

		if (!this.__parent.data.autoMax) {
			this.__maxScaleValue = parseFloat(this.__parent.data.max);
		}
	}

	__updateAutoLimits() {
		if (!this.__scale) {
			return;
		}

		if (this.__parent.data.autoMin) {
			this.__updateAutoMinValue();
		}

		if (this.__parent.data.autoMax) {
			this.__updateAutoMaxValue();
		}
	}	

	__updateAutoMinValue() {		
		this.__minScaleValue = this.autoMinValue;
	}	

	__updateAutoMaxValue() {		
		this.__maxScaleValue = this.autoMaxValue;
	}	

	__correctMinIfLogScaleAndZero(value) {
		if (!this.__parent.data.isLog) {
			return value;
		} else {
			if (!value) {
				var smallValueNextToZero = 1e-10;
				return smallValueNextToZero;
			} else {
				return value;
			}
		}
	}

	__getMinAndMax(dataForAutoScale) {
		var sortedList = dataForAutoScale.sort();		
		return [sortedList.first(), sortedList.last()];
	}	

	
	
	get scale() {
		return this.__scale;
	}

	set dataForAutoScale(dataForAutoScale) {
		var minAndMax = this.__getMinAndMax(dataForAutoScale);
		this.__dataForAutoScale.length = 0;
		this.__dataForAutoScale = this.__dataForAutoScale.concat(minAndMax).sort();
		this.__updateAutoLimits();
	}

	get autoMinValue() {
		
		var min = 0.0
		var autoDataExists = this.__dataForAutoScale.length > 0;
		if (autoDataExists) {
			var minValue = this.__dataForAutoScale.first();
			var maxValue = dataForAutoScale.last();
			var delta = maxValue - minValue;
			var minBorderMode = parent.data.borderMin;
			var borderFactor = minBorderMode.getFactor();
			var autoMinValue = minValue - borderFactor * delta;
			min = autoMinValue;
		}		
		
		return this.__correctMinIfLogScaleAndZero(min);		
	}

	get autoMaxValue() {
		var autoDataExists = this.__dataForAutoScale.length > 0;
		if (autoDataExists) {
			var minValue = dataForAutoScale.first();
			var maxValue = dataForAutoScale.last();
			var delta = maxValue - minValue;
			var maxBorderMode = parent.data.borderMax;
			var borderFactor = maxBorderMode.getFactor();
			var autoMaxValue = maxValue + borderFactor * delta;
			return autoMaxValue;
		}
		return 0.0;
	}
	
	set __minScaleValue(min) {
		var oldDomain = this.__scale.domain();
		var oldMax = oldDomain.length> 1
						?oldDomain[1]
						:1;
		this.__scale.domain(min, oldMax);
	}

	set __maxScaleValue(max) {
		var oldDomain = this.__scale.domain();
		var oldMin = oldDomain.length>0
			?oldDomain[0]
			:0;
		this.__scale.domain(oldMin, max);
	}

}
