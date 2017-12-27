import NameAndNumber from "./nameAndNumber.js";
import AtomTreeNodeAdapter from "./atomTreeNodeAdapter.js";
import AtomCodeAdaption from "./atomCodeAdaption.js";
import AtomGraphicsAdaption from "./atomGraphicsAdaption.js";
import TreeViewerAction from "./treeViewerAction.js";

export default class Atom {		

   

	constructor(name) {	
		
		/**
		 * In order to be able to identify an Atom by its tree path, this name should only be used once for all children of the parent
		 * Atom. The name might also be used in code for saving the tree structure. It is recommended to use lower case names.
		 */
		this.name = name;		
		
		this.nameChangeConsumers = [];
		
		this.parent = undefined;
		
		this.children = [];	
		
		this.contextMenuActions = [];
	
		this.expandedNodes = [];
		
		this.helpId = undefined;			
	}		

	copy() {
		var newAtom = new Atom(this.name);		
		newAtom.children = copyAtoms(atomToCopy.children);
		
		newAtom.children.forEach(function(child){
			child.parentAtom = newAtom;
		});		

		newAtom.expandedNodes = atomToCopy.expandedNodes;		
	}

	copyAtoms(atomsToCopy) {
		var atoms = [];
		atomsToCopy.forEach(function(atomToCopy){
			atoms.push(atomToCopy.copy())
		});		
		return atoms;
	}	

	createCodeAdaption() {
	   return new AtomCodeAdaption(this);
	}

	createGraphicsAdaption(parentD3Selection) {
		return new AtomGraphicsAdaption(this,parentD3Selection);		
	}	

	createTreeNodeAdaption(parent, d3, treeViewerRefreshable){
		AtomTreeNodeAdapter.createTreeNode(parent,d3,treeViewerRefreshable,this);		
	}	

	//#region actions

	execute(treeViewerRefreshable) {
		//empty default implementation
	}

	
	executeChildren(wantedClass, treeViewerRefreshable){

		this.children.forEach(function(child){
			
			var hasWantedClass = child instanceof wantedClass;
			if (hasWantedClass) {
				try {
					child.execute(treeViewerRefreshable);
				} catch (exception) {
					var message = "Could not execute child '" + child.name + "' of '" + this.name + "'.";
					console.error(message, exception);
				}
			}
		});		
	}


	createContextMenuActions(treeViewerRefreshable) {

		if(!treeViewerRefreshable){
			throw Error("treeViewerRefreshable is undefined")
		}

		var actions = [];

		//rename
		actions.push(new TreeViewerAction(
						"Rename",
						"rename.png",
						treeViewerRefreshable,
						()=>this.rename())
					);

		//move up
		var canBeMovedUp = this.canBeMovedUp();
		if (canBeMovedUp) {
			actions.push(new TreeViewerAction(
							"Move up",
							"up.png",
							treeViewerRefreshable,
							()=>this.moveUp())
						);
		}

		//move down
		var canBeMovedDown = this.canBeMovedDown();
		if (canBeMovedDown) {
			actions.push(new TreeViewerAction(
							"Move down",
							"down.png",
							treeViewerRefreshable,
							()=>this.moveDown())
						);
		}

		//delete
		actions.push(new TreeViewerAction(
						"Delete",
						"delete.png",
						treeViewerRefreshable,
						()=>this.delete())
					);

		return actions;
	}

	/**
	 * Returns true if this atom can be moved up in the children of its parent
	 */
	canBeMovedUp() {		
		if (this.parent != null) {
			var currentChildren = parent.children;
			var childrenExist = currentChildren != null && currentChildren.length > 1;
			if (childrenExist) {
				var currentIndex = currentChildren.indexOf(this);
				if (currentIndex > 0) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * Moves the atom up in the children of the parent atom
	 */
	moveUp() {
		
		if (canBeMovedUp()) {			
			var currentChildren = this.parent.children;
			var currentIndex = currentChildren.indexOf(this);
			
			var tmp = currentChildren[currentIndex - 1];
			currentChildren[currentIndex - 1] = currentChildren[currentIndex];
			currentChildren[currentIndex] = tmp;			
			
			this.tryToRefreshAtom(this.parent);
		}
		return this;
	}

	/**
	 * Moves the atom in the children of the parent atom to a specific index (Position)
	 */
	moveAtom(position) {		
		if (canBeMovedUp()) {			
			var currentChildren = this.parent.children;
			var currentIndex = currentChildren.indexOf(this);
			throw new Error("not yet implemented");
			//Collections.rotate(currentChildren.subList(position, currentIndex + 1), 1);
			
			this.tryToRefreshAtom(parent);
		}
		return this;
	}

	/**
	 * Returns true if this atom can be moved down in the children of its parent
	 */
	canBeMovedDown() {		
		if (this.parent != null) {
			var currentChildren = this.parent.children;
			var childrenExist = currentChildren != null && currentChildren.length > 1;
			if (childrenExist) {
				var currentIndex = currentChildren.indexOf(this);
				if (currentIndex < currentChildren.length - 1) {
					return true;
				}
			}
		}
		return false;
	}

	moveDown() {		
		if (this.canBeMovedDown()) {			
			var currentChildren = this.parent.children;
			var currentIndex = currentChildren.indexOf(this);
			
			var tmp = currentChildren[currentIndex + 1];
			currentChildren[currentIndex + 1] = currentChildren[currentIndex];
			currentChildren[currentIndex] = tmp;
			
			this.tryToRefreshAtom(parent);
		}
		return this;
	}
	
	tryToRefreshAtom(atom) {		
		if (atom.refresh) {
			atom.refresh();
		}
	}

	//#end region

	//#region name	

	rename() {
		var newName = prompt("Please enter the new name:", this.name); 
		this.setName(newName);
	}

	addNameChangedConsumer(nameChangedConsumer) {		
		this.nameChangedConsumers.push(nameChangedConsumer);
	}

	removeNameChangedConsumer(nameChangedConsumer) {
		nameChangedConsumers.remove(nameChangedConsumer);
	}

	triggerNameChangedConsumers(newName) {
		nameChangedConsumers.forEach(function(nameChangedConsumer){
			nameChangedConsumer.consume(newName);
		});		
	}

	//#end region

	//#region image

	provideImage() {
		return "root.png";
	}

	//#end region	

	//#region child operations

	hasChildren() {
	  return this.children.length > 0;	  	
	}

	/**
	 * Add the given Atom as a child and removes it from the old parent if an old parent exists.
	 */
	addChild(child) {		
		var oldParent = child.parent;
		child.parent = this;
		this.children.push(child);
		if (oldParent !== undefined) {			
			oldParent.removeChild(child);
		}
	}

	/**
	 * Adds the given Atom as a child but does not set the parent of the child. The given Atom
	 * will be listed as a child of this Atom. If the given Atom is asked for its parent, the old
	 * parent will be returned. This way, an Atom can be used in several trees as a child while the "one and
	 * only real parent" is kept.
	 */
	addChildReference(child) {
		children.add(child);
	}

	/**
	 * Get child atom with given child name/sub model path. Throws an Error if the child could not be found.
	 */
	getChild(childPath) {

		var isPath = childPath.contains(".");

		if (isPath) {
			//iterate through path to get wanted child
			var childNames = childPath.split("\\.");
			var firstName = childNames[0];
			var child = this.getChildByName(firstName);
			//go to the wanted child in a loop; each iteration
			//overrides the previous parent atom in the loop
			for (var index = 1; index < childNames.length; index++) {
				child = child.getChildByName(childNames[index]);
			}
			return child;
		} else {			
			var childName = childPath;
			return this.getChildByName(childName);
		}
	}

	/**
	 * Get child atom with given child tree path. Throws an Error if the child tree path can not be found.
	 */
	getChildFromRoot(childPathStartingWithRoot) {

		var rootLength = 5; //"root."
		var isTooShort = childPathStartingWithRoot.length() < rootLength + 1;
		if (isTooShort) {
			throw new Error("The path has to start with 'root.' but is '" + childPathStartingWithRoot + "'.");
		}

		var startsWithRoot = childPathStartingWithRoot.substring(0, rootLength).equals("root.");

		if (startsWithRoot) {
			var length = childPathStartingWithRoot.length();
			var childPath = childPathStartingWithRoot.substring(rootLength, length);
			var root = this.getRoot();
			var child = root.getChild(childPath);
			if (child == null) {
				return null;
			}
			return child;
		} else {
			throw new Error("The path has to start with 'root.' but is '" + childPathStartingWithRoot + "'.");
		}

	}

	/**
	 * Creates a child atom with the same class as the given atomInstance.
	 * The name of the new child atom will start with the given prefix.
	 */	
	createChildAtom(atomInstance, namePrefix) {
		
		var newName = this.createChildNameStartingWith(namePrefix);
		var newChild;
		try {
			var atomConstructor = atomClass.constructor;
			newChild = new atomConstructor(newName);
		} catch (exception) {
			var message = "Could not create child atom for class " + atomInstance.constructor.name;
			throw new Error(message, exception);
		}
		this.addChild(newChild);
		return newChild;
	}

	/**
	 * Returns true if the root of this atom has a child at the given child path.
	 */
	rootHasChild(childPathStartingWithRoot) {
		try {
			getChildFromRoot(childPathStartingWithRoot);
			return true;
		} catch (exception) {
			return false;
		}
	}

	/**
	 * Gets the first child atom with the given name. Throws an Error if the child could not be
	 * found.
	 */
	getChildByName(childName) {
		this.children.forEach(function(child){
			var isWantedChild = childName.equals(currentChild.name);
			if (isWantedChild) {
				return currentChild;
			}
		});
		
		throw new Error("Could not find child '" + childName + "' in '" + name + "'.");
	}

	/**
	 * Gets the first child atom with the given class. Throws an Error if the child could not be
	 * found.
	 */
	getChildByClass(clazz) {

        this.children.forEach(child => {
			var isWantedChild = currentChild instanceof clazz;
			if (isWantedChild) {				
				return child;
			}
        });
        		
		throw new Error("Could not find a child with class'" + clazz + "' in '" + this.name + "'.");
	}

	/**
	 * Gets a list of all child atoms with the given class. Returns an empty list if no child with the given class could
	 * be found.
	 */
	getChildrenByClass(clazz) {
		var wantedChildren = [];
        this.children.forEach(child => {
			var isWantedChild = currentChild instanceof clazz;
			if (isWantedChild) {			
				wantedChildren.push(child);
			}
        }); 
		return wantedChildren;
	}	

	removeChildrenByClass(clazz) {
		var childrenToRemove = [];
		this.children.forEach(child => {
			var isWantedChild = child instanceof clazz;
			if (isWantedChild) {
				childrenToRemove.push(child);
			}
		});
		this.children.removeAll(childrenToRemove);
	}

	/**
	 * Checks if any of the children, sub children and so on is of the class with the given name
	 */
	containsChildOfType(targetClassName) {
		
		this.children.forEach(child => {
			var hasWantedType = child.constructor.name.equals(targetClassName);
			if (hasWantedType) {
				return true;
			}
		});	
	

		//go on and check if any of the children of the children has the wanted
		//type
		this.children.forEach(child => {
			var hasWantedType = child.containsChildOfType(targetClassName);
			if (hasWantedType) {
				return true;
			}
		});		

		//could not find any child that has the wanted type
		return false;
	}

	/**
	 * Removes all children of this atom
	 */
	removeAllChildren() {
		this.children.clear();
	}

	/**
	 * Removes the child with the given name if it exists. The names of the children should be unique. Only the first
	 * child with the given name is removed.
	 */
	removeChildIfExists(childName) {

		var childToRemove;
		this.children.forEach(child => {			
			var isWantedChild = child.name.equals(childName);
			if (isWantedChild) {
				childToRemove = child;				
			}
		});
		if (childToRemove) {
			this.children.remove(childToRemove);
		}

	}

	//#end region

	//#region expansion state

	setExpandedNodes(expandedNodesString) {		
		this.expandedNodes = expandedNodesString.split(",");		
	}

	//#end region

	//#region parent operations

	hasParent() {
		
		if (!this.parent) {
			return false;
		}
		
		var parentName = this.parent.name;
		if (parentName) {
			if (parentName.equals("invisibleRoot")) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Returns the root atom of the tree this atom is included in. Returns null if the parent node of this atom is null.
	 */
	getRoot() {

		if (this.name.equals("root")) {
			return this;
		}
		
		if (!this.parent) {
			throw new Error("The Atom '" + this.name + "' has no parent. Could not get root.");
		} else {			
			var parentIsRoot = this.parent.name.equals("root");
			if (parentIsRoot) {
				return this.parent;
			} else {				
				return this.parent.getRoot();
			}
		}
	}

	//#end region

	//#region ATTRIBUTES

	/**
	 * Helper method that extracts a wrapped Attribute from a Wrap
	 */
	static getWrappedAttribute(wrappingAttribute) {
		return wrappingAttribute.getAttribute();		
	}

	/**
	 * Adds a modification listener to the attribute that is wrapped by the given wrapping attribute.
	 */
	addModificationConsumer(key, wrappingAttribute, consumer) {
		var wrappedAttribute = this.getWrappedAttribute(wrappingAttribute);
		wrappedAttribute.addModificationConsumer(key, consumer);
		return this;
	}

	static addModificationConsumerStatic(key, wrappingAttribute, consumer) {
		var wrappedAttribute = this.getWrappedAttribute(wrappingAttribute);
		wrappedAttribute.addModificationConsumer(key, consumer);
	}

	/**
	 * Adds a modification listener to the attribute that is wrapped by the given wrapping attribute and executes it
	 * once
	 */
	static addModificationConsumerAndRun(key, wrappingAttribute, consumer) {
		var wrappedAttribute = this.getWrappedAttribute(wrappingAttribute);
		wrappedAttribute.addModificationConsumerAndRun(key, consumer);
	}

	//#end region

	//#end region

	setName(name) {
		var isDifferentName = (name != null && !name.equals(this.name)) || (name == null && this.name != null);
		if (isDifferentName) {
			this.name = name;
			triggerNameChangedConsumers(name);
		}
		return this;
	}	

	//#end region


	
	getTreePath() {
		var path = this.name;		
		if (this.parent != null) {			
			var parentName = this.parent.name;
			if (!parentName.equals("invisibleRoot")) {
				path = parent.getTreePath() + "." + path;
			}
		}
		return path;
	}

	delete() {		
		this.children.forEach(child =>{
			child.delete();
		});	
		this.parent.children.remove(this);		
	}

	removeChild(child) {
		child.parent = undefined;
		this.children.remove(child);
	}

	

	

	/**
	 * Expands the tree node in the tree viewer
	 */
	expand(treeViewer) {
		treeViewer.setExpandedState(this, true);
	}	

	/**
	 * Determines a new name for the next child to be created
	 */
	createChildNameStartingWith(defaultName) {

		var currentNameAndNumber = new NameAndNumber(defaultName, 0);
		var nextNameAndNumber;
		var goOn = true;
		while (goOn) {
			nextNameAndNumber = getNextDummyChildNameAndNumber(atom, currentNameAndNumber);
			var currentNameIsOk = nextNameAndNumber.equals(currentNameAndNumber);
			if (currentNameIsOk) {
				goOn = false;
			}
			currentNameAndNumber = nextNameAndNumber;
		}

		var fullName = currentNameAndNumber.getFullName();
		return fullName;
	}

	/**
	 * Checks if a child atom with a name that corresponds to the given NameAndNumber already exists and returns a new
	 * NameAndNumber
	 */
	static getNextDummyChildNameAndNumber(startNameAndNumber) {
		var next = Object.create(startNameAndNumber);
		var childWithSameNameAlreadyExists = false;
		var currentName = start.getFullName();
		
		this.children.forEach(child=>{			
			var namesAreEqual = currentName.equals(child.name);
			if (namesAreEqual) {
				childWithSameNameAlreadyExists = true;				
			}
		});		
		
		if (childWithSameNameAlreadyExists) {
			//increase number to generate a new name
			next.increaseNumber();
		}
		return next;
	}

	//#end region	

}