import AbstractAtomCodeAdaption from './abstractAtomCodeAdaption.js';
import CodeContainer from './codeContainer.js';
import RootCodeContainer from './rootCodeContainer.js';
import Enum from './../../components/enum.js';

/**
 * CodeAdaption for AbstractAtoms: used to create java code from the tree. The creation of the code is separated in two
 * parts: one for creating the imports and one for creating the main code. This allows to put the imports for all
 * children at the beginning of the java code.
 */
 export default class AtomCodeAdaption extends AbstractAtomCodeAdaption {

	constructor(atom){
		super(atom);
		this.indent = '    ';
	}

	buildRootCodeContainer(className) {
		return new RootCodeContainer(this.__atom, className);		
	}

	postProcessAllChildrenCodeContainer(allChildrenCodeContainer) {

		var bulkIsEmpty = allChildrenCodeContainer.hasEmptyBulk;
		if (!bulkIsEmpty) {
			//make sure that the bulk code ends with an extra line if the bulk code is not empty
			//(this creates some distance to the code for the next sibling or uncle)
			allChildrenCodeContainer.makeBulkEndWithSingleEmptyLine();
		}
		return allChildrenCodeContainer;
	}

	buildCreationCodeContainerWithoutVariableName(codeContainer) {

		if(!codeContainer){
			codeContainer = new CodeContainer();
		}

		var name = this.__atom.name;	
		var className = this.__atom.constructor.name;		
		var hasParent = this.__atom.hasParent;
				
		if (hasParent) {
			codeContainer.extendBulk(this.indent + this.__parentVariableNamePlaceholder + '.create' + className + "('" + name + "');");
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
		
		if (hasParent) {
			codeContainer.extendBulk(this.indent + 'var ' + variableName + ' = ' + this.__parentVariableNamePlaceholder + '.create'
					+ className + "('" + name + "');");
		} else {
			
			
			//TODO import of class
			
			codeContainer.extendBulkWithEmptyLine();
			codeContainer.extendBulk(this.indent +	'var ' + variableName + ' = new ' + className + "('" + name + "');");
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


	/**
	 * Returns a String that represents the given value as code. If the property value can not be returned as a 
	 * code String, null is returned.
	 */

	valueString(value) {

		if (typeof value === 'string' || value instanceof String) {
			return this.__createValueStringForString(value);			
		}

		var isPrimitive = value !== Object(value);
		if (isPrimitive) {
			return '' + value;			
		}		
		
		if (value instanceof Enum) {
			return this.__createValueStringForEnum(value);			
		}		

		var isArray = value instanceof Array;
		if (isArray) {
			return this.__createValueStringForArray(value);
		}

		return null;
	}

	createImportsForValue(propertyContainer, propertyValue){

		if(!(propertyValue instanceof Enum)){
			return;
		}
		propertyContainer.extendImports(this.__createEnumImport(propertyValue));
	}

	__createEnumImport(enumValue){
		var constructor = enumValue.constructor;
		
		var urlPrefix = window.treezConfig
								?window.treezConfig.home
								:'.';
		
		return 'import ' + constructor.name + " from '" + urlPrefix + constructor.importLocation + "';";
	}
		
	__createValueStringForString(value) {
		var valueString = value;
		valueString = valueString.replace(/\\/g, '\\\\');
		return "'" + valueString + "'";		
	}

	__createValueStringForEnum(enumValue) {	
		return enumValue.constructor.name + '.' + enumValue.name;			
	}
	
	__createValueStringForArray(array) {
		var valueStrings = [];
		for (var value of array) {
			var valueString = this.valueString(value);
			valueStrings.push(valueString);
		}
		return '[' + valueStrings.join(', ') + ']';		
	}
	
}
