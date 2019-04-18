import AtomCodeAdaption from './../../core/code/atomCodeAdaption.js';
import CodeContainer from './../../core/code/codeContainer.js';

export default class VariableCodeAdaption extends AtomCodeAdaption {

	constructor(atom) {
		super(atom);
	}
	
	propertyNames(atom){
		var propertyNames = super.propertyNames(atom);
				
		return propertyNames.filter((name)=>{
			return name !== 'value'; //the value property is already considered by the code for creating the atom
		});
	}
	
	buildCreationCodeContainerWithoutVariableName(codeContainer) {

		if(!codeContainer){
			codeContainer = new CodeContainer();
		}

		var name = this.__atom.name;	
		var className = this.__atom.constructor.name;		
		var hasParent = this.__atom.hasParent;
		var variableValueString = this.valueString(this.__atom.value);		
		
		if (hasParent) {
			codeContainer.extendBulk(this.indent + this.__parentVariableNamePlaceholder + '.create' + className + "('" + name + "', " + variableValueString + ");");
		} else {
			var message = 'The atom ' + name
					+ '" has no parent atom and no code to create children or set properties. '
					+ 'Creating it would be useless. If it is a root atom wihout children create a custom code adaption for it.';
			console.warn(message);
		}
		return codeContainer;
	}

	buildCreationCodeContainerWithVariableName(variableName, codeContainer) {

		if(!codeContainer){
			codeContainer = new CodeContainer();
		}

		var name = this.__atom.name;	
		var className = this.__atom.constructor.name;		
		var hasParent = this.__atom.hasParent;
		var variableValueString = this.valueString(this.__atom.value);		
		
		if (hasParent) {
			codeContainer.extendBulk(this.indent + 'var ' + variableName + ' = ' + this.__parentVariableNamePlaceholder + '.create'
					+ className + "('" + name + "', " + variableValueString + ");");
		} else {
			
			
			//TODO import of class
			
			codeContainer.extendBulkWithEmptyLine();
			codeContainer.extendBulk(this.indent + 'var ' + variableName + ' = new ' + className + "('" + name + ", " + variableValueString + "');");
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
