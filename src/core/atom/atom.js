import NameAndNumber from './../nameAndNumber.js';
import AtomTreeNodeAdapter from './atomTreeNodeAdapter.js';
import AtomCodeAdaption from './../code/atomCodeAdaption.js';
import AtomGraphicsAdaption from './atomGraphicsAdaption.js';
import TreeViewAction from './../treeview/treeViewAction.js';
import TreeView from './../../views/treeView.js';
import VariableNameRegistry from './../code/variableNameRegistry.js';
import Utils from './../utils/utils.js';


export default class Atom {		

	//Important note: Except for the root atom, users should not create an atom directly with the constructor but 
	//with the method createChild of its parent atom (or with the static create method).
	//That work flow includes an initialization routine, that is called after the construction has been finished.
	//Using the constructur directly would mean that the initialization routine is not called. 
	constructor(name) {			
		
		/**
		 * In order to be able to identify an Atom by its tree path, this name should only be used once for all children of the parent
		 * Atom. The name might also be used in code for saving the tree structure. It is recommended to use lower case names.
		 */
		this.__name = name
						?name
						:this.__defaultName;
		
		this.__treezProperties = {};
		
		this.__image = 'tree.png';
		this.__overlayImage = undefined;
		
		this.__nameChangedConsumers = [];		
		this.__parent = undefined;
		this.__children = [];			
		this.__contextMenuActions = [];				
		this.__helpId = undefined;			
		this.__isExpanded=true;
		this.__expandedNodes = [];		
		this.__isRunnable = false;		
	}	
	
	//#region METHODS
	
	static create(name, value){
		return Atom.__createAtom(this, name, value);
	}	

	copy() {
		return Atom.__deepCopy(this);		
	}	
	
	createControlAdaption(propertiesView, treeView){
		
		treeView.clearPropertiesView();
		
		propertiesView.append('div') //
		.html('The control for this type of atom is not yet implemented; should be overridden by inheriting class!');
		
	}
	
	createCode(){
		VariableNameRegistry.reset();
		var codeAdaption = this.createCodeAdaption();
		var rootContainer = codeAdaption.buildRootCodeContainer(this);		
		var codeContainer = codeAdaption.buildCodeContainer(rootContainer);
		return codeContainer.buildCode();		
	}

	createCodeAdaption() {
	   return new AtomCodeAdaption(this);
	}

	createGraphicsAdaption(parentSelection) {
		return new AtomGraphicsAdaption(this,parentSelection);		
	}	

	createTreeNodeAdaption(parentSelection, treeView){		
		return AtomTreeNodeAdapter.createTreeNode(parentSelection,treeView,this);		
	}		

	async execute(treeView, optionalMonitor) {		
		alert('Execute of atom not yet implemented!');
	}
	
	async executeChildren(wantedClass, treeView, monitor){		
		
		var monitorId = wantedClass.name + 's';
		var subMonitor = monitor.createChild(monitorId, treeView, monitorId, 1);
		subMonitor.totalWork = this.numberOfChildrenByClass(wantedClass);

		for(const child of this.children){			
			var hasWantedClass = child instanceof wantedClass;
			if (hasWantedClass) {
				try {
					var subSubMonitor = subMonitor.createChild(child.name, treeView, child.name, 1);
					await child.execute(treeView, subSubMonitor);
				} catch (exception) {
					var message = 'Could not execute child "' + child.name + '" of "' + this.name + '".';
					console.error(message, exception);
				}
			}
		};		
	}
	
	async executeRunnableChildren(treeView, monitor) {
		for(const child of this.children){
			if (child.isRunnable) {	
				var subMonitor = monitor.createChild(child.name, treeView, child.name, 1);			
				await child.execute(treeView, subMonitor);
			}
		};		
	}

	createContextMenuActions(selection, parentSelection, treeView) {

		if(!treeView){
			throw Error('treeView is undefined')
		}

		var actions = [];

		//rename
		actions.push(new TreeViewAction(
						'Rename',
						'rename.png',
						this,
						treeView,
						()=>this.rename())
					);

		//move up		
		if (this.canBeMovedUp) {
			actions.push(new TreeViewAction(
							'Move up',
							'up.png',
							this,
							treeView,
							()=>this.moveUp())
						);
		}

		//move down		
		if (this.canBeMovedDown) {
			actions.push(new TreeViewAction(
							'Move down',
							'down.png',
							this,
							treeView,
							()=>this.moveDown())
						);
		}

		//delete
		actions.push(new TreeViewAction(
						'Delete',
						'delete.png',
						this,
						treeView,
						()=>this.delete())
					);

		return actions;
	}

	/**
	 * Moves the atom up in the children of the parent atom
	 */
	moveUp() {
		
		if (this.canBeMovedUp) {			
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
		if (this.canBeMovedUp) {			
			var currentChildren = this.parent.children;
			var currentIndex = currentChildren.indexOf(this);
			throw new Error('not yet implemented');
			//Collections.rotate(currentChildren.subList(position, currentIndex + 1), 1);
			
			this.tryToRefreshAtom(parent);
		}
		return this;
	}	

	moveDown() {		
		if (this.canBeMovedDown) {			
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

	rename() {
		var newName = prompt('Please enter the new name:', this.name); 
		this.name = newName;
	}

	addNameChangedConsumer(nameChangedConsumer) {		
		this.nameChangedConsumers.push(nameChangedConsumer);
	}

	removeNameChangedConsumer(nameChangedConsumer) {
		this.nameChangedConsumers.remove(nameChangedConsumer);
	}

	triggerNameChangedConsumers(newName) {
		this.nameChangedConsumers.forEach(function(nameChangedConsumer){
			nameChangedConsumer.consume(newName);
		});		
	}	
	
	hasChildByClass(clazz){
		for(var child of this.children){
			if(child instanceof clazz){
				return true;
			}
		}
		return false;
	}

	numberOfChildrenByClass(clazz){
		var numberOfChildren=0;		
		for(var child of this.children){
			if(child instanceof clazz){
				numberOfChildren++;
			}
		}
		return numberOfChildren;
	}	

	/**
	 * Add the given Atom as a child and removes it from the old parent if an old parent exists.
	 */
	addChild(child) {		
		var oldParent = child.parent;		
		this.children.push(child);
		if (oldParent !== undefined) {			
			oldParent.removeChild(child);
		}
		child.parent = this;
	}

	/**
	 * Adds the given Atom as a child but does not set the parent of the child. The given Atom
	 * will be listed as a child of this Atom. If the given Atom is asked for its parent, the old
	 * parent will be returned. This way, an Atom can be used in several trees as a child while the 'one and
	 * only real parent' is kept.
	 */
	addChildReference(child) {
		children.add(child);
	}

	/**
	 * Get child atom with given child name/sub model path. Throws an Error if the child could not be found.
	 */
	child(childPath) {

		var isPath = childPath.indexOf('.') > -1;

		if (isPath) {
			//iterate through path to get wanted child
			var childNames = childPath.split('.');
			var firstName = childNames[0];
			var child = this.childByName(firstName);
			//go to the wanted child in a loop; each iteration
			//overrides the previous parent atom in the loop
			for (var index = 1; index < childNames.length; index++) {
				try{
					child = child.childByName(childNames[index]);
				} catch (error){
					throw new Error('Could not find child "' + childNames[index] + '" in tree path "' + childPath + '".', error);
				}				
			}
			return child;
		} else {			
			var childName = childPath;
			return this.childByName(childName);
		}
	}

	/**
	 * Get child atom with given child tree path. Throws an Error if the child tree path can not be found.
	 */
	childFromRoot(childPathStartingWithRoot) {

		var rootLength = 5; //'root.'
		var isTooShort = childPathStartingWithRoot.length < rootLength + 1;
		if (isTooShort) {
			throw new Error('The path has to start with "root." but is "' + childPathStartingWithRoot + '".');
		}

		var startsWithRoot = (childPathStartingWithRoot.substring(0, rootLength) === 'root.');

		if (startsWithRoot) {
			var length = childPathStartingWithRoot.length;
			var childPath = childPathStartingWithRoot.substring(rootLength, length);
			var root = this.root;
			var child = root.child(childPath);
			if (child == null) {
				return null;
			}
			return child;
		} else {
			throw new Error('The path has to start with "root." but is "' + childPathStartingWithRoot + '".');
		}

	}

	createChild(atomClass, name, value) {
		var child = Atom.__createAtom(atomClass, name, value);
		this.addChild(child);
		return child;
	}
	
	static __createAtom(atomClass, name, value){
		var atom;
		if(value !== undefined){
			atom = new atomClass(name, value);
		} else {
			atom = new atomClass(name)
		}
		atom.__initializeProperties();
		return atom;
	}

	createChildWithNamePrefix(atomClass, namePrefix) {
		
		var newName = this.createChildNameStartingWith(namePrefix);
		var newChild;
		try {			
			newChild = new atomClass(newName);
		} catch (error) {
			var message = 'Could not create child atom for class ' + atomClass.constructor.name + ': ';
			throw new Error(message + error);
		}
		this.addChild(newChild);
		return newChild;
	}


	rootHasChild(childPathStartingWithRoot) {
		try {
			var child = this.childFromRoot(childPathStartingWithRoot);
			return child
				?true
				:false;
		} catch (error) {
			return false;
		}
	}

	childByName(childName) {

		var wantedChild = null;

		this.children.every(function(child){
			var isWantedChild = child.name === childName;
			if (isWantedChild) {
				wantedChild = child;
				return false;				
			} else {
				return true;
			}
		});		
		
		return wantedChild;		
	}
	
	childByClass(clazz) {
		for(var child of this.children){
			if(child instanceof clazz){
				return child;
			}
		}		
        return null;      		
	}

	childrenByClass(clazz) {
		var wantedChildren = [];
        this.children.forEach(child => {
			var isWantedChild = child instanceof clazz;
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
		this.removeChildren(childrenToRemove);
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
		
	removeAllChildren() {
		this.children.length = 0;
	}
	
	removeChildIfExists(childName) {

		try{
			var childToRemove = this.childByName(childName);
			this.removeChild(childToRemove);
		} catch(error){

		}		
	}


	collapseAll(){
		this.isExpanded=false;
		this.children.forEach((child)=>{
			child.collapseAll();
		});
	}

	expandAll(){
		this.isExpanded=true;
		this.children.forEach((child)=>{
			child.expandAll();
		});
	}

	delete() {		
		this.children.forEach(child =>{
			child.delete();
		});	
		var childIndex = this.parent.children.indexOf(this);
		this.parent.children.splice(childIndex,1);		
	}

	removeChild(child) {
		child.parent = undefined;
		var index = this.children.indexOf(child);
		if(index>-1){
			this.children.splice(index,1);
		}		
	}

	removeChildren(children){
		for(var child of children){
			this.removeChild(child);
		}
	}	

	expand(treeViewer) {
		treeViewer.setExpandedState(this, true);
	}	

	createChildNameStartingWith(defaultName) {

		var currentNameAndNumber = new NameAndNumber(defaultName, 0);
		var nextNameAndNumber;
		var goOn = true;
		while (goOn) {
			nextNameAndNumber = this.__getNextDummyChildNameAndNumber(currentNameAndNumber);
			var currentNameIsOk = nextNameAndNumber.equals(currentNameAndNumber);
			if (currentNameIsOk) {
				goOn = false;
			}
			currentNameAndNumber = nextNameAndNumber;
		}

		var fullName = currentNameAndNumber.getFullName();
		return fullName;
	}



	createHelpAction(section, relativeUrl){
		if(relativeUrl){
			section.append('treez-section-action')
	        .image('help.png')
	        .label('Show online help')
	        .addAction(()=>this.showHelp(relativeUrl)); 
		}		
	}

	showHelp(relativeUrl){ 
    	var url = this.absoluteHelpUrl(relativeUrl);
    	var newWindow = window.open(url, '_blank');
		newWindow.focus();  
    }	

    absoluteHelpUrl(relativeUrl){    	
    	return 'https://github.com/stefaneidelloth/treezjs/blob/master/doc/atoms/' + relativeUrl;
    }
    
	
	__initializeProperties(){
		var propertyNames = Object.getOwnPropertyNames(this);		
		var publicPropertyNames =  propertyNames.filter((name)=>{
			return !name.startsWith('__')
		});
		
		//store initial values of treez properties to be able to know if a value 
		//has been modified from its initial state
		for(var propertyName of publicPropertyNames){
			this.__treezProperties[propertyName] = this[propertyName];
		}		
	}

	/**
	 * Checks if a child atom with a name that corresponds to the given NameAndNumber already exists and returns a new
	 * NameAndNumber
	 */
	__getNextDummyChildNameAndNumber(startNameAndNumber) {
		var nextNameAndNumber = startNameAndNumber.copy();
		var childWithSameNameAlreadyExists = false;
		var currentName = startNameAndNumber.getFullName();
		
		this.children.forEach(child=>{			
			var namesAreEqual = currentName === child.name;
			if (namesAreEqual) {
				childWithSameNameAlreadyExists = true;				
			}
		});		
		
		if (childWithSameNameAlreadyExists) {
			//increase number to generate a new name
			nextNameAndNumber.increaseNumber();
		}
		return nextNameAndNumber;
	}
	
	//original source:https://stackoverflow.com/questions/4459928/how-to-deep-clone-in-javascript/
	static __deepCopy(obj, parent, hash = new WeakMap()) {
		
		//primitives
	    if (Object(obj) !== obj) {
	    	return obj; 
	    }
	    
	    //Set
	    if (obj instanceof Set) {
	    	return new Set(obj); 
	    }

	    //TreeView
	    if (obj instanceof TreeView){
	    	return obj;
	    }

	    //HtmlElements
	    if (obj instanceof HTMLElement){
	    	return obj;
	    }
	    
	    //cyclic reference
	    if (hash.has(obj)) {
	    	return hash.get(obj); 
	    }

	   	    
	    var result=undefined;

		try{
			result = obj instanceof Date ? new Date(obj)
						 : obj instanceof RegExp ? new RegExp(obj.source, obj.flags)
						 : obj.constructor ? new obj.constructor() 
						 : Object.create(null);
		} catch (error){
			console.error('Could not copy object "'+ obj +'": ' + error);
		}
	                 
	    hash.set(obj, result);
	    
	    //Map
	    if (obj instanceof Map){
	        Array.from(obj, ([key, val]) => result.set(key, Atom.__deepCopy(val, result, hash)) );
	    }
	    
	    var keys = Object.keys(obj);	   
	    var parentIndex = keys.indexOf('parent');
	    if (parentIndex >-1){
	    	keys.splice(parentIndex,1);
	    	
	    	var itemWithAssignedAttributes = Object.assign(result, ...keys.map(
				key => ({ 
							[key]: Atom.__deepCopy(obj[key], result, hash) 
						}) 
			));
	    	itemWithAssignedAttributes['parent'] = parent;
	    	return itemWithAssignedAttributes;
	    }
		
		var values = keys.map(
			key => {
				var value = Atom.__deepCopy(obj[key], result, hash);
				return ({ 
					[key]: value
				});
			}					
		);
	  
	    try{
			return Object.assign(result, ...values);
		} catch(error){
			var foo =1;
		}
	}
	
	//#end region
	
	//#region ACCESSORS
	
	get __defaultName(){
		var className = this.constructor.name;
		var firstLetter = className[0].toLowerCase();
		return firstLetter  + className.substring(1);
	}
	
	get name(){
		return this.__name;
	}

	set name(name){
		this.__name = name;
	}
	
	get parent(){
		return this.__parent;
	}

	set parent(parent){
		this.__parent = parent;
	}
	
	get children(){
		return this.__children;
	}
	
	get image(){
		return this.__image;
	}

	set image(image){
		this.__image = image;
	}
	
	get overlayImage(){
		return this.__overlayImage;
	}

	set overlayImage(overlayImage){
		this.__overlayImage = overlayImage;
	}
	
	get isExpanded(){
		return this.__isExpanded;
	}

	set isExpanded(isExpanded){
		this.__isExpanded = isExpanded;
	}
	
	get isRunnable(){
		return this.__isRunnable;
	}
	
	set isRunnable(isRunnable){
		this.__isRunnable = isRunnable;
	}

	set expandedNodes(expandedNodesString) {		
		this.__expandedNodes = expandedNodesString.split(',');		
	}

	get expandedNodes(){
		return this.__expandedNodes; 
	}

	get hasParent() {
		
		if (!this.parent) {
			return false;
		}
		
		var parentName = this.parent.name;
		if (parentName) {
			if (parentName === 'invisibleRoot') {
				return false;
			}
		}

		return true;
	}

	/**
	 * Returns the root atom of the tree this atom is included in. Returns null if the parent node of this atom is null.
	 */
	get root() {

		if (this.name === 'root') {
			return this;
		}
		
		if (!this.parent) {
			throw new Error('The Atom "' + this.name + '" has no parent. Could not get root.');
		} else {			
			var parentIsRoot = (this.parent.name === 'root');
			if (parentIsRoot) {
				return this.parent;
			} else {				
				return this.parent.root;
			}
		}
	}
		
	get treePath() {
		try{
		return this.parent
			? this.parent.treePath + '.' + this.name
			: this.name;
		} catch (error){
			return '';
		}
	}
	
	/**
	 * Returns true if this atom can be moved down in the children of its parent
	 */
	get canBeMovedDown() {		
		if (this.parent) {
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
	
	get hasChildren() {
		  return this.children.length > 0;	  	
		}
		
		get numberOfRunnableChildren(){
			var numberOfChildren=0;		
			for(var child of this.children){
				if(child.isRunnable){
					numberOfChildren++;
				}
			}
			return numberOfChildren;
		}
		
	/**
	 * Returns true if this atom can be moved up in the children of its parent
	 */
	get canBeMovedUp() {		
		if (this.parent) {
			var currentChildren = this.parent.children;
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

	get atomType(){
		var className = this.constructor.name;
		return Utils.firstToLowerCase(className);
	}


	
	
	//#end region
	

}