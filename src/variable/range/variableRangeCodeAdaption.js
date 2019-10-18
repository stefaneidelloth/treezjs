import AtomCodeAdaption from './../../core/code/atomCodeAdaption.js';
import CodeContainer from './../../core/code/codeContainer.js';

export default class VariableRangeCodeAdaption extends AtomCodeAdaption {

	constructor(atom) {
		super(atom);
	}
	
	propertyNames(atom){
		var propertyNames = super.propertyNames(atom);
				
		return propertyNames.filter((name)=>{
			return (name !== 'value') && (name !== 'rangeString'); //these properties are already considered by the code for creating the atom
		});
	}	

	buildCreationCodeContainerWithVariableName(variableName, codeContainer) {

		if(!codeContainer){
			codeContainer = new CodeContainer();
		}

		var name = this.__atom.name;	
		var className = this.__atom.constructor.name;		
		var hasParent = this.__atom.hasParent;
		var variableValuesString = this.valueString(this.__atom.values);		
		
		if (hasParent) {
			codeContainer.extendBulk(this.indent + 'let ' + variableName + ' = ' + this.__parentVariableNamePlaceholder + '.create'
					+ className + "('" + name + "', " + variableValuesString + ");");
		} else {			
			throw new Error('The atom "'+ name+'" has no parent atom.');			
		}
		return codeContainer;
	}
	
	buildCreationCodeContainerWithoutVariableName(codeContainer) {

		if(!codeContainer){
			codeContainer = new CodeContainer();
		}

		var name = this.__atom.name;	
		var className = this.__atom.constructor.name;		
		var hasParent = this.__atom.hasParent;
		var variableValuesString = this.valueString(this.__atom.values);		
		
		if (hasParent) {
			codeContainer.extendBulk(this.indent + this.__parentVariableNamePlaceholder + '.create' + className + "('" + name + "', " + variableValuesString + ");");
		} else {
			var message = 'The atom ' + name
					+ '" has no parent atom and no code to create children or set properties. '
					+ 'Creating it would be useless. If it is a root atom wihout children create a custom code adaption for it.';
			console.warn(message);
		}
		return codeContainer;
	}

	extendCodeForProperty(propertyContainer, propertyName, propertyValue) {
		
		this.createImportsForValue(propertyContainer, propertyValue);
		
		var propertyValueString = this.valueString(propertyValue); 
				
		var additionalLine = this.indent + this.__variableNamePlaceholder + '.' + propertyName + ' = ' + propertyValueString + ';';
	
		propertyContainer.extendBulk(additionalLine);
		return propertyContainer;
	}

}
