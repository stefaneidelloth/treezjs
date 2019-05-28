export default class QuantitativeScaleBuilder {

	constructor(axis) {
		this.__axis = axis;
		this.__scale = undefined;
		this.__dataForAutoScale = [];
	}

	createScale(dTreez, graphWidthInPx, graphHeightInPx) {

		if (this.__axis.data.isLog) {
			this.__scale = dTreez.scaleLog() //
					.log() //
					.clamp(true);

		} else {
			this.__scale = dTreez.scaleLinear() //					
					.clamp(true);
		}
		
		this.__createRange(graphWidthInPx, graphHeightInPx);
		this.__updateManualLimits();
		this.__updateAutoLimits();
	}
	
	includeDomainValuesForAutoScale(dataForAutoScale) {
		var minAndMax = this.__getMinAndMax(dataForAutoScale);
		this.__dataForAutoScale = this.__dataForAutoScale.concat(minAndMax).sort((a,b) => a-b);
		this.__updateAutoLimits();
	}

	includeForAutoScale(valueToInclude) {
		var added = this.__dataForAutoScale.push(valueToInclude);  //todo check if this works
		if (added) {
			this.__dataForAutoScale = this.__dataForAutoScale.sort((a,b) => a-b);
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
		if (this.__axis.data.isHorizontal) {			
			this.__scale.range([0.0, graphWidthInPx]);
		} else {		
			this.__scale.range([graphHeightInPx, 0.0]);
		}
	}

	__updateManualLimits() {
		if (!this.__scale) {
			return;
		}

		if (!this.__axis.data.hasAutoMin) {

            var min = parseFloat(this.__axis.data.min);

            if (isNaN(min)){
            	min =0;
            }
            

			var minValue = this.__correctMinIfLogScaleAndZero(min);
			this.__minScaleValue = minValue;
		}

		if (!this.__axis.data.hasAutoMax) {


			var max = parseFloat(this.__axis.data.min);
			if(isNaN(max)){
				max=1;
			}           
            
			this.__maxScaleValue = max;
		}
	}

	__updateAutoLimits() {
		if (!this.__scale) {
			return;
		}

		if (this.__axis.data.hasAutoMin) {
			this.__updateAutoMinValue();
		}

		if (this.__axis.data.hasAutoMax) {
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
		if (!this.__axis.data.isLog) {
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
		var sortedList = dataForAutoScale.sort((a,b) => a-b);		
		return [sortedList[0], sortedList[sortedList.length-1]];
	}	

	
	
	get scale() {
		return this.__scale;
	}

	set dataForAutoScale(dataForAutoScale) {
		var minAndMax = this.__getMinAndMax(dataForAutoScale);
		this.__dataForAutoScale.length = 0;
		this.__dataForAutoScale = this.__dataForAutoScale.concat(minAndMax).sort((a,b) => a-b);
		this.__updateAutoLimits();
	}

	get autoMinValue() {
		
		var min = 0.0
		var autoDataExists = this.__dataForAutoScale.length > 0;
		if (autoDataExists) {
			var minValue = this.__dataForAutoScale[0];
			var maxValue = this.__dataForAutoScale[this.__dataForAutoScale.length-1];
			var delta = maxValue - minValue;
			var minBorderMode = this.__axis.data.borderMin;
			var borderFactor = minBorderMode.factor;
			if(delta===0){
				min = minValue *(1- borderFactor);
			} else {
				min = minValue - borderFactor * delta;
			}	
			
		}		
		
		return this.__correctMinIfLogScaleAndZero(min);		
	}

	get autoMaxValue() {
		var autoDataExists = this.__dataForAutoScale.length > 0;
		if (autoDataExists) {
			var minValue = this.__dataForAutoScale[0];
			var maxValue = this.__dataForAutoScale[this.__dataForAutoScale.length-1];
			var delta = maxValue - minValue;			
			var maxBorderMode = this.__axis.data.borderMax;
			var borderFactor = maxBorderMode.factor;

			if(delta === 0){
				return maxValue * (1+borderFactor);
			} else {
				return maxValue + borderFactor * delta
			}
			
		}
		return 1.0;
	}
	
	set __minScaleValue(min) {
		var oldDomain = this.__scale.domain();

		if(oldDomain.length>1){
			var oldMin = oldDomain[0];
			if(min === oldMin){
				return;
			}
			var oldMax = oldDomain[1];

			this.__scale.domain([min, oldMax]);
		} else {
			this.__scale.domain([min, 1]);
		}		
	}

	set __maxScaleValue(max) {
		var oldDomain = this.__scale.domain();

		if(oldDomain.length>1){			

			var oldMax = oldDomain[1];
			if(max === oldMax){
				return;
			}

			var oldMin = oldDomain[0];			
			
			this.__scale.domain([oldMin, max]);
		} else {
			this.__scale.domain([0, max]);
		}		
	}

}
