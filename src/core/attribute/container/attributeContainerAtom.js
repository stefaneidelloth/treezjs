import Atom from "../../atom/atom.js";

export default class AttributeContainerAtom extends Atom {

	constructor(name) {
		super(name);
		this.helpUrl = undefined;
		this.isEnabled = true;
		this.isVisible = true;		
	}

	
	/**
	 * Creates the control for the AttributeContainerAtom. A control for the parameters of the AttributeContainerAtom
	 * can be created with the method ControlAdaption getControlAdaption(Composite parent) which is inherited from
	 * AbstractAtom
	 */
	createAtomControl(parent, treeViewerRefreshable){
		throw Error("Needs to be overridden.");
	}

	getAttributeAtom(modelPath) {

	    var root = this.getRoot();

		if (root != null) {
			try {
				return root.getChild(modelPath);				
			} catch (exception) {
				throw new Error("Could not get attribute atom '" + modelPath + "'.", exception);
			}
		} else {
			throw new Error("Could not get attribute atom '" + modelPath + "' due to missing root.");
		}
	}
	
}
