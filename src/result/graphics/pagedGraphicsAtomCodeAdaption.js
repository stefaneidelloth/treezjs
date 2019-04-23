import AtomCodeAdaption from './../../core/code/atomCodeAdaption.js';
import GraphicsAtom from './graphicsAtom.js';

export default class PagedGraphicsAtomCodeAdaption extends AtomCodeAdaption {

	constructor(atom) {
		super(atom);
	}

	extendCodeForProperty(propertyContainer, propertyName, propertyValue, propertyParentName) {		

		if(propertyParentName){
			this.createImportsForValue(propertyContainer, propertyValue);
			var propertyValueString = this.valueString(propertyValue); 
			var additionalLine = this.indent + this.__variableNamePlaceholder + '.' + propertyParentName + '.' + propertyName + ' = ' + propertyValueString + ';';	
			propertyContainer.extendBulk(additionalLine);
		} else {
			var page = propertyValue; 

			if (!(page instanceof GraphicsAtom)){
				throw new Error('Property must be GraphisAtom');
			}

			var subPropertyContainer = super.buildCodeContainerForProperties(page, page.name);
			var hasEmptyPropertyBulk = subPropertyContainer.hasEmptyBulk;
			if (!hasEmptyPropertyBulk) {
				subPropertyContainer.makeBulkEndWithSingleEmptyLine();
			}	

			propertyContainer.extend(subPropertyContainer);		
			
		}				
		
		return propertyContainer;
	}
	
}
