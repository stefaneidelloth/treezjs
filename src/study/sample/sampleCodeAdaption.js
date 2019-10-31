import ComponentAtomCodeAdaption from './../../core/component/componentAtomCodeAdaption.js';
import CodeContainer from './../../core/code/codeContainer.js';

export default class SampleCodeAdaption extends ComponentAtomCodeAdaption {

    constructor(atom) {
		super(atom);
	}

	buildCodeContainerForProperties(atom) {
		let propertyContainer = new CodeContainer();

        let map = atom.variableMap;
		for(let variableName in map){
		    let variableValue = map[variableName].value;
            propertyContainer = this.__extendCodeForSampleVariable(propertyContainer, variableName, variableValue);	
		};

		return propertyContainer;		
	}

	__extendCodeForSampleVariable(propertyContainer, variableName, variableValue){

        let valueString = this.valueString(variableValue); 

        let additionalLine = this.indent + this.__variableNamePlaceholder + ".set('" + variableName + "', " + valueString + ");";	
        propertyContainer.extendBulk(additionalLine);
        return propertyContainer;

	}
}