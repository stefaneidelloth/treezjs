import ComponentAtom from './../../core/component/componentAtom.js';

export default class Sample extends ComponentAtom {

	constructor(name) {
		super(name);
		this.image = 'sample.png';
		this.isDisableable = true;
		
		this.__variableMap = {};
		this.__tempVariableMap = {};
		this.__studySection = undefined
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
		var variableMapIsEmpty = Object.keys(this.__variableMap).length < 1;
		if (variableMapIsEmpty) {
			this.__createSampleVariables();	
		}		
		
		if(this.isTimeDependent){
			this.__createTimeSeriesLabel(sectionContent);
		}
		this.__createVariableAtomControls(sectionContent);		
	}

	__createSampleVariables(){
						
		this.__tempVariableMap = {};		
		for (var variable of this.study.selectedVariables) {			
			if (this.isTimeDependent) {			
				this.__createVariableRange(variable);
			} else {
				this.__createVariable(variable);
			}			
		}
		this.__variableMap = this.__tempVariableMap;
	}

	__createTimeSeriesLabel(sectionContent) {	
		sectionContent.append('treez-text-label')
			.value('' + this.nameOfTimeVariable + ': ');

		sectionContent.append('treez-text-label')
			.value('[' + this.study.timeRange + ']');	

	}	

	__createVariableRange(variable) {
		var variableRange = variable.createRange();	
		var name = variable.name;
		variableRange.name = name;
		this.__tempVariableMap[name] = variableRange;
		this.__tryToRestoreVariable(name);	
	}
	
	__createVariable(variable) {
		this.__tempVariableMap[variable.name] = variable.copy();
		this.__tryToRestoreVariable(variable.name);	
	}
	
	__createVariableAtomControls(sectionContent){		
		for (var variableName in this.__variableMap) {
			var variableAtom = this.__variableMap[variableName];			
			variableAtom.createVariableControl(sectionContent, this.treeView.dTreez);
		}
	}	

	__tryToRestoreVariable(name){
		if(name in this.__variableMap){			
			var newVariable = this.__tempVariableMap[name];
			var oldVariable = this.__variableMap[name];
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
		var variableMapIsEmpty = Object.keys(this.__variableMap).length < 1;
		if (variableMapIsEmpty) {
			this.__createSampleVariables();	
		}
		
		var variable = this.__variableMap[variableName];
		if(!variable){
			var message = 'A variable with name "' + variable.name + '" could not be found.';
			throw new Error(message);
		}

		if(this.isTimeDependent){
			if(!(value instanceof Array)){
				throw new Error('Variables for time dependent samples have to be set with arrays.')
			}
			variable.values = value;			

		} else {
			variable.value = value;			
		}		
	}
	
	get variableMap() {
		return this.__variableMap;
	}	

	get study(){
		return this.parent;
	}

	get nameOfTimeVariable(){
		return this.study.nameOfTimeVariable;
	}

	get isTimeDependent(){
		return this.study.isTimeDependent;
	}

}
