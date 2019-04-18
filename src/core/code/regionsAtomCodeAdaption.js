import AtomCodeAdaption from './atomCodeAdaption.js';
import CodeContainer from './codeContainer.js';

/**
 * Extends AtomCodeAdaption to include a region (//#region XYZ ... //#end region) for each child
 */
export default class RegionsAtomCodeAdaption extends AtomCodeAdaption {

	constructor(atom) {
		super(atom);	
		this.isEnabled = true; //set this to false if you want to disable the extra //#region lines	
	}

	buildCreationCodeContainerWithoutVariableName(codeContainer) {

		if(!codeContainer){
			codeContainer = new CodeContainer();
		}				

		if(this.isEnabled){
			var name = this.__atom.name;	
			//add region start
			codeContainer.extendBulkWithEmptyLine();
			codeContainer.extendBulk(this.indent + '//#region ' + name.toUpperCase() + this.__separator(name));
		}

		return super.buildCreationCodeContainerWithoutVariableName(codeContainer);		
	}

	buildCreationCodeContainerWithVariableName(variableName, codeContainer) {

		if(!codeContainer){
			codeContainer = new CodeContainer();
		}
				

		if(this.isEnabled){
			var name = this.__atom.name;	
			//add region start
			codeContainer.extendBulkWithEmptyLine();
			codeContainer.extendBulk(this.indent + '//#region ' + name.toUpperCase() + this.__separator(name));
		}

		return super.buildCreationCodeContainerWithVariableName(variableName, codeContainer);
	}

	createCodeContainerForChildAtoms() {
				
		var allChildrenCodeContainer = new CodeContainer();
		for (var child of this.__atom.children) {
			
			var childCodeAdaption = child.createCodeAdaption();

			if(this.isEnabled){
				//add child region start
				allChildrenCodeContainer.extendBulkWithEmptyLine();
				var regionStartLine = this.indent + '//#region ' + child.name;
				allChildrenCodeContainer.extendBulk(regionStartLine);
				allChildrenCodeContainer.extendBulkWithEmptyLine();
			}

			//extend with child code container
			allChildrenCodeContainer = childCodeAdaption.buildCodeContainer(allChildrenCodeContainer);

			if(this.isEnabled){
				//add child region end
				var regionEndLine = this.indent + '//#end region';
				allChildrenCodeContainer.extendBulk(regionEndLine);
			}
		}

		//post process the container
		allChildrenCodeContainer = this.postProcessAllChildrenCodeContainer(allChildrenCodeContainer);

		if(this.isEnabled){
			//add region end
			var regionEndLine = this.indent + '//#end region' + this.__separator('end');
			allChildrenCodeContainer.extendBulk(regionEndLine);
		}

		return allChildrenCodeContainer;
	}	

	__separator(name){
		var length = 60 - name.length;
		var separator = ' ';
		for(var index = 0; index < length;index++){
			separator += '-';
		}
		return separator;
	}	
	
}
