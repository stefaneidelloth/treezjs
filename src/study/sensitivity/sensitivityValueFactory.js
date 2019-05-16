import SensitivityType from './sensitivityType.js';
import RelationType from './relationType.js';

export default class SensitivityValueFactory {

	static updateVariableInfos(variableMap, sensitivity) {		
		switch (sensitivity.type) {
		case SensitivityType.relativeDistance:
			this.__updateByRelativeDistance(variableMap, sensitivity);
			break;
		case SensitivityType.relativePosition:
			this.__updateByRelativePosition(variableMap, sensitivity);
			break;
		case SensitivityType.absoluteDistance:
			this.__updateByAbsoluteDistance(variableMap, sensitivity);
			break;
		default:
			throw new Error('Not yet implemented type ' + sensitivity.type);
		}
	}

	static __updateByRelativeDistance(variableMap, sensitivity) {		
		switch (sensitivity.relationType) {
		case RelationType.percentage:
			this.__updateByRelativeDistanceWithPercentage(variableMap, sensitivity);
			break;
		case RelationType.factor:
			this.__updateByRelativeDistanceWithFactor(variableMap, sensitivity);
			break;
		case RelationType.exponent:
			this.__updateByRelativeDistanceWithExponent(variableMap, sensitivity);
			break;
		default:
			throw new IllegalStateException('Not yet implemented type ' + sensitivity.relationType);
		}
	}

	static __updateByRelativeDistanceWithPercentage(variableMap, sensitivity) {

	}

	static __updateByRelativeDistanceWithFactor(variableMap, sensitivity) {

	}

	static __updateByRelativeDistanceWithExponent(variableMap, sensitivity) {

	}

	static __updateByRelativePosition(variableMap, sensitivity) {		
		switch (sensitivity.relationType) {
		case RelationType.percentage:
			this.__updateByRelativePositionWithPercentage(variableMap, sensitivity);
			break;
		case RelationType.factor:
			this.__updateByRelativePositionWithFactor(variableMap, sensitivity);
			break;
		case RelationType.exponent:
			this.__updateByRelativePositionWithExponent(variableMap, sensitivity);
			break;
		default:
			throw new IllegalStateException('Not yet implemented type ' + sensitivity.relationType);
		}
	}

	static __updateByRelativePositionWithPercentage(variableMap, sensitivity) {
		var percentages = this.__sortedIndividualValues(sensitivity);
		for (var variable of variableMap.keys()) {				
			var variableInfo = this.__variableInfoByRelativePositionWithPercentage(variable.value, percentages);
			variableMap.set(variable, variableInfo);
		}
	}

	static __variableInfoByRelativePositionWithPercentage(workingPointValue, percentages) {
		if (percentages.length < 1) {
			return '[' + workingPointValue + ']';
		}

		var percent = 1.0 / 100;

		var variableInfo = '[';
		var workingPointValueIncluded = false;
		for (var percentage of percentages) {
			if (percentage === 0) {
				variableInfo += '0, ';
			} else if (percentage === 100) {
				variableInfo += workingPointValue + ', ';
				workingPointValueIncluded = true;
			} else if (percentage > 100) {
				if (!workingPointValueIncluded) {
					variableInfo += workingPointValue + ', ';
					workingPointValueIncluded = true;
				}
				variableInfo += (workingPointValue * (percentage * percent)) + ', ';

			} else {
				variableInfo += (workingPointValue * (percentage * percent)) + ', ';
			}
		}

		if(!workingPointValueIncluded){
			variableInfo += workingPointValue + ', ';
		}

		variableInfo = variableInfo.substring(0, variableInfo.length - 2) + ']';

		return variableInfo;
	}

	static __updateByRelativePositionWithFactor(variableMap, sensitivity) {
		var factors = this.__sortedIndividualValues(sensitivity);
		for (var variable of variableMap.values()) {				
			var variableInfo = this.__variableInfoByRelativePositionWithFactor(variable.value, factors);
			variableMap.set(variable.name, variableInfo);
		}
	}

	__variableInfoByRelativePositionWithFactor(workingPointValue, factors) {

		if (factors.isEmpty()) {
			return '[' + workingPointValue + ']';
		}

		var variableInfo = '[';
		var workingPointValueIncluded = false;
		for (var factor of factors) {
			if (factor == 0) {
				variableInfo += '0, ';
			} else if (factor == 1) {
				variableInfo += workingPointValue + ', ';
			} else if (factor > 1) {
				if (!workingPointValueIncluded) {
					variableInfo += workingPointValue + ', ';
				}
				variableInfo += (workingPointValue * factor) + ', ';

			} else {
				variableInfo += (workingPointValue * factor) + ', ';
			}
		}

		variableInfo = variableInfo.substring(0, variableInfo.length - 2) + ']';

		return variableInfo;
	}

	static __updateByRelativePositionWithExponent(variableMap, sensitivity) {
		var exponents = this.__sortedIndividualValues(sensitivity);
		for (var variable of variableMap.values()) {						
			var variableInfo = this.__variableInfoByRelativePositionWithExponent(variable.value, exponents);
			variableMap.set(variable.name, variableInfo);
		}
	}

	static __variableInfoByRelativePositionWithExponent(workingPointValue, expontents) {

		if (expontents.length < 1) {
			return '[' + workingPointValue + ']';
		}

		var base = 10.0;

		var variableInfo = '[';
		var workingPointValueIncluded = false;
		for (var exponent of expontents) {
			if (exponent == 0) {
				variableInfo += workingPointValue + ', ';
			} else if (exponent > 1) {
				if (!workingPointValueIncluded) {
					variableInfo += workingPointValue + ', ';
				}
				variableInfo += (workingPointValue * Math.pow(base, exponent)) + ', ';

			} else {
				variableInfo += (workingPointValue * Math.pow(base, exponent)) + ', ';
			}
		}

		variableInfo = variableInfo.substring(0, variableInfo.length - 2) + ']';

		return variableInfo;
	}

	static __updateByAbsoluteDistance(variableMap, sensitivity) {
		var distances = this.__sortedIndividualValues(sensitivity);
		for (var variable of variableMap.values()) {			
			var variableInfo = this.__variableInfoByAbsoluteDistance(variable.value, distances);
			variableMap.set(variable, variableInfo);
		}
	}

	static __variableInfoByAbsoluteDistance(workingPointValue, distances) {
		if (distances.length < 1) {
			return '[' + workingPointValue + ']';
		}

		var variableInfo = '[';
		var workingPointValueIncluded = false;
		for (var distance of distances) {
			if (distance == 0) {
				variableInfo += workingPointValue + ', ';
			} else if (distance > 0) {
				if (!workingPointValueIncluded) {
					variableInfo += workingPointValue + ', ';
				}
				variableInfo += (workingPointValue + distance) + ', ';

			} else {
				variableInfo += (workingPointValue + distance) + ', ';
			}
		}

		variableInfo = variableInfo.substring(0, variableInfo.length - 1) + ']';

		return variableInfo;
	}

	static __sortedIndividualValues(sensitivity) {
		var individualValues = eval(sensitivity.valuesString);
		individualValues.sort();
		return individualValues;
	}	

}
