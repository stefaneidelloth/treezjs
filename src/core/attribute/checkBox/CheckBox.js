

default export class CheckBox extends BooleanAttributeAtom {

	constructor(name, state) {
		super(name);
		this.label = Utils.firstToUpperCase(name); 	
		this.tooltip = undefined;
		this.defaultValue = undefined;
	    this.sectionBody = undefined;	   
	
		set(state);
	}

	copy(CheckBox checkBoxToCopy) {
		var newAtom = new CheckBox(this.name);		
		newAtom.label = this.label;
		newAtom.tooltip = this.tooltip;
		newAtom.defaultValue = this.defaultValue;
	}	

	provideImageName() {
		return "CheckBox.png";		
	}

	createAttributeAtomControl(sectionBody, treeViewerRefreshable) {

		this.treeViewRefreshable = treeViewerRefreshable;

		//initialize value at the first call
		if (!isInitialized()) {
			this.set(defaultValue);
		}

		var div = sectionBody.append("div");

		div.append("style")
				.text("input[type='checkbox']:checked + label:before{" //
						+ "border-bottom: 2px solid green;" //
						+ "border-right: 2px solid green;" //
						+ "}");

		var checkBoxSelection = div //
				.append("input") //
				.attr("id", name)
				.attr("type", "checkbox")
				.classed("green-text", true)
				.style("vertical-align", "middle");

		checkBoxSelection //
				.attr("checked",

						get());

		var labelSelection = div //
				.append("label") //
				.attr("for", name);

		labelSelection.text(label);

		checkBoxSelection.on("change", (event) -> {

			HTMLInputElementImpl inputElement = (HTMLInputElementImpl) event.getTarget();
			boolean currentValue = inputElement.getChecked();
			set(currentValue);
			updateTargetsEnabledStates(currentValue);

		});

		return this;
	}

	setEnabled(state) {
		super.setEnabled(state);		
		this.refreshAttributeAtomControl();
		return this;
	}

	refreshTreeView() {
		if (treeViewRefreshable != null) {
			treeViewRefreshable.refresh();
		}
	}

	refreshAttributeAtomControl() {
		
	}

	/**
	 * Updates the enabled/disabled state of other components, dependent on the current value
	 */
	updateTargetsEnabledStates(currentValue) {
		var enableNodes = this.children;
		var root = this.getRoot();
		
		this.children.forEach((enableNode)=>{
			var target = root.getChild(enableNode.targetPath);
			var enableTarget = enableNode.value.equals(currentValue);
			if (enableTarget) {
				target.setEnabled(true);
			} else {
				target.setEnabled(false);
			}
		});
		
	}

	createEnableTarget(name, targetPath) {
		var enableTarget = new CheckBoxEnableTarget(name, true, targetPath);
		this.addChild(enableTarget);
	}

	createDisableTarget(String name, String targetPath) {
		var enableTarget = new CheckBoxEnableTarget(name, false, targetPath);
		this.addChild(enableTarget);
	}

		
	setBackgroundColor(color) {
		this.backgroundColor = color;
		if (isAvailable(contentContainer)) {
			contentContainer.setBackground(color);
		}

		if (isAvailable(labelComposite)) {
			labelComposite.setBackground(color);
		}
		if (isAvailable(valueCheckBox)) {
			valueCheckBox.setBackground(color);
		}
		return getThis();
	}

	setVisible(visible) {
		super.setVisible(visible);
		if (isAvailable(contentContainer)) {
			contentContainer.setVisible(visible);
		}
		return getThis();
	}	

}
