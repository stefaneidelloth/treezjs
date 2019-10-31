import ComponentAtomCodeAdaption from './../../core/component/componentAtomCodeAdaption.js';
import CodeContainer from './../../core/code/codeContainer.js';

export default class ColumnCodeAdaption extends ComponentAtomCodeAdaption {

    constructor(atom) {
		super(atom);
	}

	constructorArgumentsString(propertyContainer){

		let atom = this.__atom;

		let name = atom.name;
		let hasDefaultName = name === atom.__defaultName;

		let type = atom.type;
		let defaultValues = atom.__treezProperties;
		let hasDefaultType = this.__propertyValueEqualsDefaultValue('type', type, defaultValues)

		if(hasDefaultName){
			if(hasDefaultType){
				return "()";
			} 
		} else {
			if(hasDefaultType){
				return "('" + name + "')";
			} 
		}

		this.createImportsForValue(propertyContainer, type);

		return "('" + name + "', ColumnType." + type +  ")";
		
	}

	extendCodeContainerForProperty(propertyContainer, propertyName, propertyValue, defaultValues, propertyParentName){
		if(propertyName === 'name'){				
			return propertyContainer;				
		}	

		if(propertyName === 'type'){				
			return propertyContainer;				
		}	

		if(propertyName === 'legend'){	
				if(this.__atom.legend === this.__atom.name){
					return propertyContainer;		
				}	
			}	

		if(this.__propertyValueEqualsDefaultValue(propertyName, propertyValue, defaultValues)){
			return propertyContainer;
		}			

		return this.extendCodeForProperty(propertyContainer, propertyName, propertyValue, propertyParentName);		
	}

	
}