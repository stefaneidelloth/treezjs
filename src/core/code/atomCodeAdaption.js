import AbstractAtomCodeAdaption from './abstractAtomCodeAdaption.js';
import CodeContainer from './codeContainer.js';
import RootCodeContainer from './rootCodeContainer.js';
import Enum from './../../components/enum.js';
import Root from './../../root/root.js';

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

		let bulkIsEmpty = allChildrenCodeContainer.hasEmptyBulk;
		if (!bulkIsEmpty) {
			//make sure that the bulk code ends with an extra line if the bulk code is not empty
			//(this creates some distance to the code for the next sibling or uncle)
			allChildrenCodeContainer.makeBulkEndWithSingleEmptyLine();
		}
		return allChildrenCodeContainer;
	}	

	buildCreationCodeContainerWithVariableName(variableName, codeContainer) {

		if(!codeContainer){
			codeContainer = new CodeContainer();
		}

		let name = this.__atom.name;
		let hasDefaultName = name === this.__atom.__defaultName;
		let className = this.getClassName(this.__atom);		
		let hasParent = this.__atom.hasParent;

		let constructorArgs = hasDefaultName
			?"()"
			:"('" + name + "')";
		
		if (hasParent) {
			codeContainer.extendBulk(this.indent + 'let ' + variableName + ' = ' + this.__parentVariableNamePlaceholder + '.create'
					+ className + constructorArgs + ";");
		} else {			
			
			if(!this.__atom instanceof Root){
				throw new Error('The atom "'+ name+'" has no parent atom.');
			}
			
			codeContainer.extendBulkWithEmptyLine();
			codeContainer.extendBulk(this.indent +	'let ' + variableName + ' = new ' + className + constructorArgs + ";");

		}
		return codeContainer;
	}
	
	getClassName(atom){
		return atom.constructor.name;
	}

	buildCreationCodeContainerWithoutVariableName(codeContainer) {

		if(!codeContainer){
			codeContainer = new CodeContainer();
		}

		let name = this.__atom.name;
		let hasDefaultName = name === this.__atom.__defaultName;

		let className = this.getClassName(this.__atom);		
		let hasParent = this.__atom.hasParent;

		let constructorArgs = hasDefaultName
			?"()"
			:"('" + name + "')";
				
		if (hasParent) {
			codeContainer.extendBulk(this.indent + this.__parentVariableNamePlaceholder + '.create' + className + constructorArgs + ";");
		} else {
			let message = 'The atom "' + name
					+ '" has no parent atom and no code to create children or set properties. '
					+ 'Creating it would be useless. If it is a root atom wihout children create a custom code adaption for it.';
			console.warn(message);
		}
		return codeContainer;
	}

	extendCodeForProperty(propertyContainer, propertyName, propertyValue) {
				
		this.createImportsForValue(propertyContainer, propertyValue);		

		let propertyValueString = this.valueString(propertyValue); 
				
		let additionalLine = this.indent + this.__variableNamePlaceholder + '.' + propertyName + ' = ' + propertyValueString + ';';	
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

		let isPrimitive = value !== Object(value);
		if (isPrimitive) {
			return '' + value;			
		}		
		
		if (value instanceof Enum) {
			return this.__createValueStringForEnum(value);			
		}		

		let isArray = value instanceof Array;
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
		let constructor = enumValue.constructor;
		
		let urlPrefix = window.treezConfig
								?window.treezConfig.home
								:'.';
		
		return 'import ' + constructor.name + " from '" + urlPrefix + constructor.importLocation + "';";
	}
		
	__createValueStringForString(value) {
		let valueString = value;
		valueString = valueString.replace(/\\/g, '\\\\');
		if(value.includes("'")){
			return '"' + valueString + '"';		
		} else {
			return "'" + valueString + "'";		
		}
		
	}

	__createValueStringForEnum(enumValue) {	
		return enumValue.constructor.name + '.' + enumValue.name;			
	}
	
	__createValueStringForArray(array) {
		let valueStrings = [];
		for (let value of array) {
			let valueString = this.valueString(value);
			valueStrings.push(valueString);
		}
		return '[' + valueStrings.join(', ') + ']';		
	}
	
}
