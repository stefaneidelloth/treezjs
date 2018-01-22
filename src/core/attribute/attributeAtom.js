import Atom from "../atom/atom.js";

export default class AttributeAtom extends Atom	{


	constructor(name) {
		super(name);

        this.DEFAULT_BACKGROUND_COLOR = "white";

	    this.attributeValue = null;
	
	    this.isInitialized = false;

        /**
         * Listener that will react on modifications of the the attribute value. (The bindings of that listeners have to be
         * considered in the implementations of the AttributeAtom, e.g. by calling triggerModificationListeners) In order to
         * avoid duplicate lambda expressions, the listeners are managed as a map.
         */
        this.modifyListeners = {};

        /**
         * If this is true, the modifyListeners are informed when the method triggerModificationListeners is called. If it
         * is false, the modifyListener will not be informed. This can be used to avoid that the modifyListeners are
         * informed several times.
         */
        this.modificationConsumersAreEnabled = true;

        this.isEnabled = true;

        this.isVisible = true;

        this.backgroundColor = this.DEFAULT_BACKGROUND_COLOR;		
	}

	copy() {
		var newAtom =  new AttributeAtom();		
		
		newAtom.attributeValue = this.attributeValue;		
		newAtom.isInitialized = this.isInitialized;
		newAtom.modificationConsumersAreEnabled = this.modificationConsumersAreEnabled;
		newAtom.isEnabled = this.isEnabled;
		newAtom.isVisible = this.isVisible;
		newAtom.backgroundColor = this.backgroundColor;

		return newAtom;
	}
	
	createAttributeAtomControl(parent, treeViewerRefreshable){
	    throw new Error("Has to be overwritten.");
	}

	/**
	 * Refreshes the control of the AttributeAtom after the attribute value has been set by calling setValue()
	 */
	refreshAttributeAtomControl(){
	    throw new Error("Has to be overwritten.");
	}
	
	createCodeAdaption() {
		return new AttributeAtomCodeAdaption(this);
	}

	 createContextMenuActions(treeViewerRefreshable) {
		return [];		
	}

	resetToDefaultValue() {
		this.set(this.getDefaultValue());
	}

	//#region MODIFICATION CONSUMERS	

	addModificationConsumer(key, consumer) {
		this.addModificationConsumers[key] = consumer;
		return this;
	}

	addModificationConsumerAndRun(key, consumer) {
		this.addModificationConsumer(key, consumer);
		consumer.consume();
		return this;
	}


	removeModificationConsumer(key) {
		this.modificaitonConsumers[key]=undefined;
		return this;
	}

	triggerModificationConsumers() {
		if (this.modificationConsumersAreEnabled) {
		    var consumerNames = Object.keys(this.modificationConsumers);
		    consumerNames.forEach(consumerName=>{
		        this.modificationConsumers[consumerName].consume();
		    });
	   }
	}

	//#end region


	//#region ACCESSORS

	get() {
		if (this.isInitialized) {
			return this.attributeValue;
		} else {
			return this.getDefaultValue();
		}
	}

	set(value) {
		if (value != this.attributeValue) {
			this.attributeValue = value;
			this.isInitialized=true;
			this.refreshAttributeAtomControl();
			this.triggerModificationConsumers();
		}
		return this;
	}	

	setEnabled(state) {
		isEnabled = state;
		return this;
	}

    setVisible(state) {
		isVisible = state;
		return this;
	}	

	getDefaultValue(){
	    throw new Error("Has to be overwritten.");
	}

    /**
     * Returns true if the attribute value equals the default value
     */
	hasDefaultValue() {
		var value = get();
		var defaultValue = getDefaultValue();
		if (value === undefined) {			
			return defaultValue === undefined;
		} else {
		    if(value === null) {
                return defaultValue === null;
		    } else {
              return get().equals(getDefaultValue());			
            }
		}
	}

	setInitialized() {
		this.isInitialized = true;
		return this;
	}

    resetInitialized() {
		this.isInitialized = false;
		return this;
	}

	//#end region

}
