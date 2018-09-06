import Atom from "../atom/atom.js";
import AttributeAtom from "../attribute/attributeAtom.js";
import AttributeRoot from "../attribute/attributeRoot.js";
import AdjustableAtomControlAdaption from "./adjustableAtomControlAdaption.js";
import AdjustableAtomCodeAdaption from "./adjustableAtomCodeAdaption.js";
import ActionSeparator from "../actionSeparator.js";


export default class AdjustableAtom extends Atom {

	constructor(name) {
		super(name);
		this.model = undefined;
		this.isRunnable = false;
		this.refreshableContentContainer=undefined;
		
	}

	copy(atomToCopy){
	    var newAtom = new AdjustableAtom(atomToCopy.name);	   
		if (atomToCopy.model) {
		    newAtom.model = atomToCopy.copy();			
		}
		newAtom.isRunnable = atomToCopy.isRunnable;		
	}

	
	copyTreezAttributes(source, target) {

		var fields = this.getFields(source);

		var attributeNames = Object.keys(source);
		attributeNames.forEach(attributeName=>{
		    var attribute = source[attributeName];
		    var isAttributeAtom = attribute instanceof AttributeAtom;
		    if(isAttributeAtom){
		        target[attributeName] = attribute.copy();
		    }
		});	
	}
	

	createControlAdaption(parent, treeViewRefreshable) {
		
		this.treeViewRefreshable = treeViewRefreshable;
	
		parent.selectAll('div').remove();
			
		this.refreshableContentContainer = parent.append("div");

        var controlAdaption = new AdjustableAtomControlAdaption(
					this.refreshableContentContainer,
					this,
					treeViewRefreshable);
		
		this.afterCreateControlAdaptionHook();

		return controlAdaption;
	}

	

	/**
	 * Method that might perform some additional actions after creating the control adaption. Can be overridden by
	 * inheriting classes. This default implementation does nothing.
	 */
	afterCreateControlAdaptionHook() {
		//nothing to do here
	}

	createCodeAdaption() {
		return new AdjustableAtomCodeAdaption(this);		
	}

	createEmptyModel() {
		var emptyModel = new AttributeRoot("root");
		setModel(emptyModel);
		return emptyModel;
	}

	createContextMenuActions(treeViewerRefreshable) {

		var actions = [];
		
		if (this.isRunnable) {
			actions.add(new TreeViewerAction(
								"Run", 
								"run.png",
								treeViewerRefreshable,
								() => this.execute(treeViewerRefreshable)
							)
			);
		}
		
		actions.push(new ActionSeparator());
		
		actions = this.extendContextMenuActions(actions, treeViewerRefreshable);
		
		actions.push(new ActionSeparator());

		var superActions = super.createContextMenuActions(treeViewerRefreshable);
		actions.concat(superActions);

		return actions;
	}

	extendContextMenuActions(actions, treeViewerRefreshable) {
		return actions;
	}

	provideImageName() {
		return "adjustable.png";	
	}

	getAttribute(modelAttributePath) {

		var rootPrefixLength = 5;
		var pathStartsWithRoot = modelAttributePath.substring(0, rootPrefixLength).equals("root.");

		if (pathStartsWithRoot) {
			var remainingAttributePath = modelAttributePath.substring(rootPrefixLength, modelAttributePath.length());
			var attributeAtom = this.model.getChild(remainingAttributePath);			
			return attributeAtom.get();	
		} else {
			throw new Error("The model path has to start with 'root.' ");
		}

	}

	/**
	 * Set the value for the attribute with the given attribute path and string value. The path can be relative or
	 * absolute (=starting with "root").
	 */
	setAttribute(modelAttributePath, value) {
		var atom = this.getAttributeAtom(modelAttributePath);
		atom.set(value);
	}

	getAttributeAtom(modelAttributePath) {

		var rootPrefixLength = 5;
		var pathStartsWithRoot = modelAttributePath.substring(0, rootPrefixLength).equals("root.");

		if (pathStartsWithRoot) {
			var remainingAttributePath = modelAttributePath.substring(rootPrefixLength, modelAttributePath.length());

			//initialize model if required
			var modelIsInitialized = model !== undefined;
			if (!modelIsInitialized) {
				//initialize the model if it is not yet build
				this.initializeModel();
			}

			if (model != null) {
				return model.getChild(remainingAttributePath);			
			} else {
				throw new Errir(
						"Could not get property atom '" + modelAttributePath
								+ "'. The root node does not have the wanted children.");
			}

		} else {
			throw new Error("The model path has to start with 'root.' ");
		}
	}

	initializeModel() {
		var dummyParent = undefined;
		this.createControlAdaption(dummyParent, null);
	}	

	

}
