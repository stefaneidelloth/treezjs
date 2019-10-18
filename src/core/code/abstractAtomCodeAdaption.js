import VariableNameRegistry from './variableNameRegistry.js';
import CodeContainer from './codeContainer.js';
import Atom from './../atom/atom.js';

export default class AbstractAtomCodeAdaption {

	constructor(atom) {
		if(!atom){
			throw new Error('Invalid atom');
		}
		
		this.__atom = atom;
		this.__variableNamePlaceholder = '{#VariableName#}';
		this.__parentVariableNamePlaceholder = '{#ParentVariableName#}';			  
	}

	buildCodeContainer(parentCodeContainer, injectedChildCodeContainer) {
		return this.__extendParentCodeContainer(parentCodeContainer, injectedChildCodeContainer);
	}

	buildRootCodeContainer(className){
		throw new Error('not yet implemented');
	}

	/**
	 * Extends the given parent code container with the code for the atom that corresponds to this code adaption
	 * and all of its children. (This basic implementation of the method, that only modifies the imports and the bulk,
	 * might be overridden by inheriting classes.)

	 */
	__extendParentCodeContainer(parentContainer, injectedChildContainer) {
				
		console.debug('Getting code container for atom "' + this.__atom.name + '".');

		//Create code container for the children of the atom and check if it is empty.
		//Instead of actual variable names place holders will be used. Those
		//place holders need to be replaced after the variable names are known.
		var childContainer = this.createCodeContainerForChildAtoms();
		var childContainerHasEmptyBulk = childContainer.hasEmptyBulk;

		//check if bulk of injected child container is empty
		var injectedChildContainerHasEmptyBulk = this.__checkIfOptionalContainerHasEmptyBulk(injectedChildContainer);

		//check if bulk child code exists
		var hasEmptyChildBulk = (childContainerHasEmptyBulk && injectedChildContainerHasEmptyBulk);

		//create property code container and check if it its bulk is empty.
		//Instead of actual variable names place holders will be used. Those
		//place holders need to be replaced after the actual variable names are known.
		var propertyContainer = this.buildCodeContainerForProperties(this.__atom);
		var hasEmptyPropertyBulk = propertyContainer.hasEmptyBulk;
		if (!hasEmptyPropertyBulk) {
			propertyContainer.makeBulkEndWithSingleEmptyLine();
		}

		var useVariableName = !hasEmptyChildBulk || !hasEmptyPropertyBulk;

		//create new code container for the current atom (might depend on hasNoBulkChildCode)
		//create code container (depends on existence of property bulk code)
		var currentContainer;
		if (useVariableName) {
			//create variable name
			var variableName = this.__createVariableName(this.__atom);

			//create current container using the variable name
			currentContainer = this.buildCreationCodeContainerWithVariableName(variableName);

			//replace variable name place holders with the actual variable names
			childContainer.replaceInBulk(this.__parentVariableNamePlaceholder, variableName);
			propertyContainer.replaceInBulk(this.__variableNamePlaceholder, variableName);

		} else {
			//create current container
			//Instead of actual variable names place holders will be used. Those
			//place holders need to be replaced after the actual variable names are known.
			currentContainer = this.buildCreationCodeContainerWithoutVariableName();			
		}
		
		currentContainer.extend(propertyContainer);
		
		if (injectedChildContainer) {
			currentContainer.extend(injectedChildContainer);
		}
		
		currentContainer.extend(childContainer);
		
		parentContainer.extend(currentContainer);
		
		return parentContainer;
	}
	
	//might be overridden by inheriting classes
	createCodeContainerForChildAtoms() {
		
		var allChildrenCodeContainer = new CodeContainer();
		for (var child of this.__atom.children) {
			console.debug('Creating code container for child ' + child.name);
		
			var childCodeAdaption = child.createCodeAdaption();
			allChildrenCodeContainer = childCodeAdaption.buildCodeContainer(allChildrenCodeContainer);
		}

		//post process the container
		allChildrenCodeContainer = this.postProcessAllChildrenCodeContainer(allChildrenCodeContainer);

		return allChildrenCodeContainer;
	}


	postProcessAllChildrenCodeContainer(allChildrenCodeContainer){
		//can be overridden by inhering classes
	}
	
	/**
	 * Creates a new code container that contains code for setting the property values of the atom that
	 * corresponds to this code adaption. Might be overridden by inheriting classes.
	 */
	buildCodeContainerForProperties(atom, propertyParentName) {
		var propertyContainer = new CodeContainer();
		var propertyNames = this.propertyNames(atom);
		
		var defaultValues = atom.__treezProperties;
		for (var propertyName of propertyNames) {			
			var propertyValue = atom[propertyName];

			//continue loop for name property
			if(propertyName === 'name'){				
				continue;				
			}	
			
			//continue loop if value equals default value
			if(defaultValues){
				if(propertyName in defaultValues){
					var defaultValue = defaultValues[propertyName];
					if(!(defaultValue instanceof Atom)){
						if(propertyValue === defaultValue){
							continue;
						}
					}
				}
			}	
			
				
			
			propertyContainer = this.extendCodeForProperty(propertyContainer, propertyName, propertyValue, propertyParentName);			
		}
		return propertyContainer;
	}
	
	propertyNames(atom){
		var propertyNames = Object.getOwnPropertyNames(atom);		
		
		var publicPropertyNames =  propertyNames.filter((name)=>{
			return !name.startsWith('__')
		});
		
		return publicPropertyNames;
	}
	
	
	buildCreationCodeContainerWithVariableName(variableName){
		throw new Error('Not yet implemented');
	}

	buildCreationCodeContainerWithoutVariableName(){
		throw new Error('Not yet implemented');
	}
	
	extendCodeForProperty(propertyContainer, propertyName, propertyValue){
		throw new Error('Not yet implemented');
	};

	__checkIfOptionalContainerHasEmptyBulk(optionalContainer) {
		if (optionalContainer) {			
			return container.hasEmptyBulk;
		} else {
			return true;
		}
	}
	

	

	/**
	 * Returns true if the atom that corresponds to this CodeAdaption is the first child of its parent
	 * atom. Throws an exception if the atom has no parent.
	 */
	get isFirstChild() {		
		var parent = this.__atom.parent;
		if (!parent) {
			throw new Error('There is no parent atom');
		}
		var firstChild = parent.children[0];
		return firstChild === this.atom;		
	}

	/**
	 * Returns true if the previous sibling atom has children. Throws an exception if the atom
	 * has no parent or no previous sibling.
	 */
	previousSiblingHasChildren() {	
		var parent = this.__atom.parent;
		if (!parent) {
			throw new Error('There is no parent atom.');
		}

		var children = this.__atom.children;
		var thisTreePath = this.__atom.treePath;
		var thisIndex = -1;
		for (var child of children) {
			var treePath = child.treePath;
			var isWantedChild = child.treePath === thisTreePath;
			if (isWantedChild) {
				thisIndex = children.indexof(child);
				break;
			}
		}

		//get previous sibling
		var previousSiblingIndex = thisIndex - 1;
		var hasNoPreviousSibling = previousSiblingIndex < 0;
		if (hasNoPreviousSibling) {
			throw new Error('There is no previous sibling.');
		}
		var previousSibling = children[previousSiblingIndex];		

		return previousSibling.hasChildren;
	}

	__createVariableName(atom) {
		return VariableNameRegistry.newVariableName(atom);		
	}

	

	

	get atom() {
		return this.__atom;
	}	

}
