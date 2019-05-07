
import ComponentAtom from './../../core/component/componentAtom.js';
import TreeViewAction from './../../core/treeView/TreeViewAction.js';
import ColumnType from './../../data/column/columnType.js';
import VariableRangeCodeAdaption from './variableRangeCodeAdaption.js';

export default class VariableRange extends ComponentAtom {

	
	constructor(name, values) {
		super(name);
		this.__rangeString = undefined;
		
		if(values){
			this.values = values;
		} else {
			this.values = [];
		}
				
		this.isDisableable = true;		
		this.variablePath = undefined;
		this.columnType = ColumnType.string;		
	}
	
	createComponentControl(tabFolder){    
		
	}	
	
	get values(){
		return eval(this.__rangeString);
	}

	set values(array){
		this.__rangeString = '[' + array + ']';		
	}
	
	getSourceModelPath(){
		var study = this.parent;
		return study.sourceModelPath;	
	}
	
	createCodeAdaption(){
		return new VariableRangeCodeAdaption(this);
	}
	
	/*
	

	
	
	// Changes the model path selection for the source variable to use the source model as relative root
	
	protected void assignRealtiveRootToSourceVariablePath() {
		Objects.requireNonNull(sourceModelModelPath, "Source model path must not be null when calling this function.");
		data.setLabel("Data for " + sourceModelModelPath);
		AbstractAtom<?> relativeRootAtom = this.childFromRoot(sourceModelModelPath);
		AttributeWrapper<String> pathWrapper = (AttributeWrapper<String>) sourceVariableModelPath;
		ModelPath modelPath = (ModelPath) pathWrapper.getAttribute();
		modelPath.setModelRelativeRoot(relativeRootAtom);
	}

	@Override
	public void setParentAtom(AbstractAtom<?> parent) {
		super.setParentAtom(parent);
		checkParentAndUpdateSourceModel(parent);
	}

	


	 // Checks if the parent is a study, gets the source model from it and updates the source model for this
	 // VariableRange

	public void checkParentAndUpdateSourceModel(AbstractAtom<?> parent) {

		if (parent == null) {
			// throw exception if the parent is null
			String message = "The parent of " + this.getName() + " must not be null";
			throw new IllegalStateException(message);
		}

		String wantedTypeName = org.treez.study.atom.Study.class.getName();
		boolean hasWantedType = Utils.checkIfHasWantedType(parent, wantedTypeName);
		if (hasWantedType) {
			// update source model
			Study study = (Study) parent;
			updateSourceModel(study);
		} else {
			// throw exception if parent is no Study
			String message = "The parent '" + parent.getName() + "' is not a valid parent for the "
					+ this.getClass().getSimpleName() + " '" + this.getName()
					+ "' since it does not implement the interface " + wantedTypeName;
			throw new IllegalStateException(message);
		}

	}

	
	// Updates the source model

	private void updateSourceModel(Study parentStudy) {
		sourceModelModelPath = parentStudy.getSourceModelPath();
		boolean assignRelativeRoot = sourceModelModelPath != null && !sourceModelModelPath.isEmpty();
		if (assignRelativeRoot) {
			assignRealtiveRootToSourceVariablePath();
		}
	}

	protected void createEnabledCheckBox() {
		// enabled state
		CheckBox enabledCheck = data.createCheckBox(enabled, this, enabled.get());
		enabledCheck.addModificationConsumer("updateEnabledState", () -> {
			boolean enabledState = enabled.get();
			setEnabled(enabledState);
		});
	}

	
	// Creates an image that is decorated with the enabled state and based on the given base image

	protected Image decorateImageWidthEnabledState(Image baseImage) {
		Image image;
		if (enabled.get()) {
			String overlayImageName = "enabledDecoration.png";
			image = Activator.getOverlayImageStatic(baseImage, overlayImageName);
		} else {
			String overlayImageName = "disabledDecoration.png";
			image = Activator.getOverlayImageStatic(baseImage, overlayImageName);
		}
		return image;
	}

	//#end region

	//#region ACCESSORS

	

	//#end region

	//#region SOURCE VARIABLE

	public void setSourceVariableModelPath(String sourceVariableModelPath) {
		this.sourceVariableModelPath.set(sourceVariableModelPath);
	}

	public void setRelativeSourceVariableModelPath(String relativePath) {
		if (sourceModelModelPath == null) {
			String message = "The source model path must not be null when calling this method. "
					+ "Please ensure that this VariableRange has a valid parent atom that "
					+ "provides the source model path before calling this method.";
			throw new IllegalStateException(message);
		}
		String absoluteSourceModelModelPath = sourceModelModelPath + "." + relativePath;
		sourceVariableModelPath.set(absoluteSourceModelModelPath);

		//trigger modification listeners
		Wrap<String> wrap = (Wrap<String>) sourceVariableModelPath;
		Attribute<String> attribute = wrap.getAttribute();
		AbstractStringAttributeAtom<?> attributeAtom = (AbstractStringAttributeAtom<?>) attribute;
		attributeAtom.triggerListeners();
	}

	public String getRelativeSourceVariableModelPath() {
		if (sourceModelModelPath == null) {
			String message = "The source model path must not be null when calling this method. "
					+ "Please ensure that this VariableRange has a valid parent atom that "
					+ "provides the source model path before calling this method.";
			throw new IllegalStateException(message);
		}

		int prefixLength = sourceModelModelPath.length();

		String relativePath = sourceVariableModelPath.get().substring(prefixLength + 1);

		return relativePath;
	}

	
	*/
	

}
