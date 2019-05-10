import ComponentAtom from './../../core/component/componentAtom.js';

export default class Sample extends ComponentAtom {

	constructor(name) {
		super(name);
		this.image = 'pickingSample.png';
		this.isDisableable = true;
		
		this.__variableAtomMap = {};
		this.__tempVariableAtomMap = {};
		this.__pickingSection = undefined
	}
	
	createComponentControl(tabFolder){   
	     
		this.__page = tabFolder.append('treez-tab')
            .label('Data');		

		const section = this.__page.append('treez-section')
        	.label(this.constructor.name); 		

		this.__sectionContent = section.append('div'); 
		
		this.__createVariableComponents(this.__sectionContent);
	}

	__createVariableComponents(sectionContent) {
		this.__createSampleVariableAtoms();							
		this.__createTimeSeriesLabel(sectionContent);		
		this.__createVariableAtomControls(sectionContent);		
	}

	__createSampleVariableAtoms(){
		var picking = this.parent;
		var isTimeDependent = picking.isTimeDependent;					
		this.__tempVariableAtomMap = {};		
		for (var variable of picking.selectedVariables) {			
			if (isTimeDependent) {			
				this.__createVariableRange(variable, picking.nameOfTimeVariable);
			} else {
				this.__createVariable(variable);
			}			
		}
		this.__variableAtomMap = this.__tempVariableAtomMap;
	}

	__createTimeSeriesLabel(sectionContent) {
		var picking = this.parent;
		var timeVariableName = picking.nameOfTimeVariable;

		sectionContent.append('treez-text-label')
			.value(timeVariableName);

		sectionContent.append('treez-text-label')
			.value('' + picking.timeRange);	

	}	
	
	__createVariableAtomControls(sectionContent){		
		for (var variableName in this.__variableAtomMap) {
			var variableAtom = this.__variableAtomMap[variableName];			
			variableAtom.createVariableControl(sectionContent, this.treeView.dTreez);
		}
	}	

	__createVariableRange(variable, timeVariableName) {
		var variableRange = variable.createRange();		
		var name = variable.name + '(' + timeVariableName + ')';
		variableRange.name = name;
		this.__tempVariableAtomMap[name] = variableRange;
		this.__tryToRestoreVariable(variable.name);	
	}

	__createVariable(variable) {
		this.__tempVariableAtomMap[variable.name] = variable.copy();
		this.__tryToRestoreVariable(variable.name);	
	}

	__tryToRestoreVariable(name){
		if(name in this.__variableAtomMap){			
			var newVariable = this.__tempVariableAtomMap[name];
			var oldVariable = this.__variableAtomMap[name];
			newVariable.value = oldVariable.value;
			if(oldVariable.unit){
				newVariable.unit = oldVariable.unit;
			}
			if(oldVariable.number){
				newVariable.number = oldVariable.number;
			}		
		} 
	}	
	
	
	//Sets the (sample-) value for the variable with the given name to the given value. Only specify the name of the
	// variable, not its full path. The path to the source model has to be specified before using this method.
	
	setVariable(variableName, value) {
		var variableMapIsEmpty = Object.keys(this.__variableAtomMap).length < 1;
		if (variableMapIsEmpty) {
			this.__createSampleVariableAtoms();	
		}

		var variable = this.__variableAtomMap[variableName];
		if (variable) {
			variable.value = value;
		} else {
			var message = 'A variable with name "' + variableName + '" could not be found.';
			throw new Error(message);
		}
	}
	
	get variableMap() {
		return this.__variableAtomMap;
	}	

}
