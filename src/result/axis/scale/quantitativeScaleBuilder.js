export default class QuantitativeScaleBuilder {

	constructor(parent) {
		this.__parent = parent;
		this.__scale = undefined;
		this.__dataForAutoScale = new Set();
	}

	createScale(scaleFactory, graphWidthInPx, graphHeightInPx) {

		if (this.__parent.data.log) {
			this.__scale = scaleFactory //
					.log() //
					.clamp(true);

		} else {
			this.__scale = scaleFactory //
					.linear() //
					.clamp(true);
		}

		this.__createRange(graphWidthInPx, graphHeightInPx);
		this.__updateManualLimits();
		this.__updateAutoLimits();
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

		if (!parent.data.autoMin) {
			var minValue = this.__correctMinIfLogScaleAndZero(parent.data.min);
			this.__setMinScaleValue(minValue);
		}

		if (!parent.data.autoMax) {
			this.__setMaxScaleValue(parent.data.max);
		}
	}

	__updateAutoLimits() {
		if (!this.__scale) {
			return;
		}

		if (parent.data.autoMin) {
			this.__updateAutoMinValue();
		}

		if (parent.data.autoMax) {
			this.__updateAutoMaxValue();
		}
	}

	__setMinScaleValue(min) {
		var oldDomain = this.__scale.domain();
		var oldMax = oldDomain.get(1, Value).asDouble();
		this.__scale.domain(min, oldMax);

	}

	setMaxScaleValue(max) {
		var oldDomain = scale.domain();
		var oldMin = oldDomain.get(0, Value).asDouble();
		this.__scale.domain(oldMin, max);

	}

	__updateAutoMinValue() {
		var correctedMin = this.__getAutoMinValue();
		this.__setMinScaleValue(correctedMin);
	}

	__determineAutoMinValue() {
		var autoDataExists = this.__dataForAutoScale.length > 0;
		if (autoDataExists) {
			var minValue = this.__dataForAutoScale.first();
			var maxValue = dataForAutoScale.last();
			var delta = maxValue - minValue;
			var minBorderMode = parent.data.borderMin;
			var borderFactor = minBorderMode.getFactor();
			var autoMinValue = minValue - borderFactor * delta;
			return autoMinValue;
		}
		return 0.0;
	}

	__updateAutoMaxValue() {
		var autoMaxValue = this.__determineAutoMaxValue();
		this.__setMaxScaleValue(autoMaxValue);
	}

	__determineAutoMaxValue() {
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

	__correctMinIfLogScaleAndZero(value) {
		if (!parent.data.log) {
			return value;
		} else {
			if (value === null || value.compareTo(0.0) === 0) {
				var smallValueNextToZero = 1e-10;
				return smallValueNextToZero;
			} else {
				return value;
			}
		}
	}

	__getMinAndMax(dataForAutoScale) {
		var treeSet = new Set();  //TODO implement tree set
		treeSet.addAll(dataForAutoScale);
		return [treeSet.first(), treeSet.last()];
	}

	//#end region

	//#region ACCESSORS

	getScale() {
		return this.__scale;
	}

	setDataForAutoScale(dataForAutoScale) {
		var minAndMax = this.__getMinAndMax(dataForAutoScale);
		this.__dataForAutoScale.length = 0;
		this.__dataForAutoScale = this.__dataForAutoScale.concat(minAndMax);
		this.__updateAutoLimits();
	}

	includeDomainValuesForAutoScale(dataForAutoScale) {
		var minAndMax = this.__getMinAndMax(dataForAutoScale);
		this.dataForAutoScale = this.dataForAutoScale.concat(minAndMax);
		this.__updateAutoLimits();
	}

	includeForAutoScale(valueToInclude) {
		var added = this.__dataForAutoScale.push(valueToInclude);  //todo check if this works
		if (added) {
			this.__updateAutoLimits();
		}
	}

	clearDataForAutoScale() {
		this.__dataForAutoScale.length = 0;
		this.__updateAutoLimits();
	}

	excludeForAutScale(valueToExclude) {
		var removed = this.dataForAutoScale.remove(valueToExclude); //todo
		if (removed) {
			this.__updateAutoLimits();
		}
	}

	getAutoMinValue() {
		var autoMinValue = this.__determineAutoMinValue();
		var correctedMin = this.__correctMinIfLogScaleAndZero(autoMinValue);
		return correctedMin;
	}

	getAutoMaxValue() {
		return this.__determineAutoMaxValue();
	}

	//#end region

}
