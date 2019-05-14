import SensitivityType from './sensitivityType.js';
import RelationType from './relationType.js';

export default class SensitivityValueFactory {

	static updateVariableInfos(variableList, sensitivity) {		
		switch (sensitivity.type) {
		case SensitivityType.relativeDistance:
			this.__updateByRelativeDistance(variableList, sensitivity);
			break;
		case SensitivityType.relativePosition:
			this.__updateByRelativePosition(variableList, sensitivity);
			break;
		case SensitivityType.absoluteDistance:
			this.__updateByAbsoluteDistance(variableList, sensitivity);
			break;
		default:
			throw new Error('Not yet implemented type ' + sensitivity.type);
		}
	}

	static __updateByRelativeDistance(variableList, sensitivity) {		
		switch (sensitivity.relationType) {
		case RelationType.percentage:
			this.__updateByRelativeDistanceWithPercentage(variableList, sensitivity);
			break;
		case RelationType.factor:
			this.__updateByRelativeDistanceWithFactor(variableList, sensitivity);
			break;
		case RelationType.exponent:
			this.__updateByRelativeDistanceWithExponent(variableList, sensitivity);
			break;
		default:
			throw new IllegalStateException('Not yet implemented type ' + sensitivity.relationType);
		}
	}

	static __updateByRelativeDistanceWithPercentage(variableList, sensitivity) {

	}

	static __updateByRelativeDistanceWithFactor(variableList, sensitivity) {

	}

	static __updateByRelativeDistanceWithExponent(variableList, sensitivity) {

	}

	static __updateByRelativePosition(variableList, sensitivity) {		
		switch (sensitivity.relationType) {
		case RelationType.percentage:
			this.__updateByRelativePositionWithPercentage(variableList, sensitivity);
			break;
		case RelationType.factor:
			this.__updateByRelativePositionWithFactor(variableList, sensitivity);
			break;
		case RelationType.exponent:
			this.__updateByRelativePositionWithExponent(variableList, sensitivity);
			break;
		default:
			throw new IllegalStateException('Not yet implemented type ' + sensitivity.relationType);
		}
	}

	static __updateByRelativePositionWithPercentage(variableList, sensitivity) {
		var percentages = this.__sortedIndividualValues(sensitivity);
		for (var variable of variableList.value) {				
			var variableInfo = this.__variableInfoByRelativePositionWithPercentage(variable.value, percentages);
			variableList.setVariableInfo(variable.name, variableInfo);
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
			if (percentage == 0) {
				variableInfo += '0, ';
			} else if (percentage == 1) {
				variableInfo += workingPointValue + ', ';
			} else if (percentage > 1) {
				if (!workingPointValueIncluded) {
					variableInfo += workingPointValue + ', ';
				}
				variableInfo += (workingPointValue * (percentage * percent)) + ', ';

			} else {
				variableInfo += (workingPointValue * (percentage * percent)) + ', ';
			}
		}

		variableInfo = variableInfo.substring(variableInfo.length() - 2) + ']';

		return variableInfo;
	}

	static __updateByRelativePositionWithFactor(variableList, sensitivity) {
		var factors = this.__sortedIndividualValues(sensitivity);
		for (var variable of variableList.value) {				
			var variableInfo = this.__variableInfoByRelativePositionWithFactor(variable.value, factors);
			variableList.setVariableInfo(variable.name, variableInfo);
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

		variableInfo = variableInfo.substring(variableInfo.length() - 2) + ']';

		return variableInfo;
	}

	static __updateByRelativePositionWithExponent(variableList, sensitivity) {
		var exponents = this.__sortedIndividualValues(sensitivity);
		for (var variable of variableList.value) {						
			var variableInfo = this.__variableInfoByRelativePositionWithExponent(variable.value, exponents);
			variableList.setVariableInfo(variable.name, variableInfo);
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

		variableInfo = variableInfo.substring(variableInfo.length() - 2) + ']';

		return variableInfo;
	}

	static __updateByAbsoluteDistance(variableList, sensitivity) {
		var distances = this.__sortedIndividualValues(sensitivity);
		for (var variable of variableList.value) {			
			var variableInfo = this.__variableInfoByAbsoluteDistance(variable.value, distances);
			variableList.setVariableInfo(variable.name, variableInfo);
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

		variableInfo = variableInfo.substring(variableInfo.length() - 1) + ']';

		return variableInfo;
	}

	static __sortedIndividualValues(sensitivity) {
		var individualValues = sensitivity.values;
		individualValues.sort(null);
		return individualValues;
	}	

}
