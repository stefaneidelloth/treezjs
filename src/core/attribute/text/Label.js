default export class Label extends StringAttributeAtom {

	//#region ATTRIBUTES

	@IsParameter(defaultValue = "Label")
	private String label;

	private FillComposite contentContainer;

	private CustomLabel labelComposite;

	//#end region

	//#region CONSTRUCTORS

	public Label(String name) {
		super(name);
		label = name;
	}

	/**
	 * Copy constructor
	 */
	protected Label(Label atomToCopy) {
		super(atomToCopy);
		label = atomToCopy.label;
	}

	//#end region

	//#region METHODS

	@Override
	public Label getThis() {
		return this;
	}

	@Override
	public Label copy() {
		return new Label(this);
	}

	@Override
	public Image provideImage() {
		return Activator.getImage("label.png");
	}

	@Override
	public AbstractStringAttributeAtom<Label> createAttributeAtomControl(
			GridComposite parent,
			FocusChangingRefreshable treeViewerRefreshable) {

		//initialize value at the first call
		if (!isInitialized()) {
			set(label);
		}

		//create toolkit
		FormToolkit toolkit = new FormToolkit(Display.getCurrent());

		//create content composite for label and check box
		contentContainer = new FillComposite(parent);

		//create label
		labelComposite = new CustomLabel(toolkit, contentContainer, label);

		//set the enabled states of the controls
		setEnabled(isEnabled());
		setVisible(isVisible());

		return this;
	}

	@Override
	public AbstractAttributeAtom<Label, String> createAttributeAtomControl(
			Browser browser,
			Selection sectionBody,
			FocusChangingRefreshable treeViewerRefreshable) {

		Selection labelSelection = sectionBody.append("div");
		labelSelection.text(get());

		return this;
	}

	@Override
	public void refreshAttributeAtomControl() {
		if (isAvailable(labelComposite)) {
			String value = get();
			labelComposite.setText(value);
		}
	}

	//#end region

	//#region ACCESSORS

	public String getLabel() {
		return label;
	}

	public Label setLabel(String label) {
		this.label = label;
		return getThis();
	}

	/**
	 * Returns the object that represents the property value. Might be overridden by implementing classes.
	 *
	 * @return
	 */
	@Override
	public String get() {
		if (isInitialized()) {
			return attributeValue;
		} else {
			return getLabel();
		}

	}

	@Override
	public String getDefaultValue() {
		return get();
	}

	public Label setDefaultValue(String defaultValue) {
		set(defaultValue);
		return getThis();
	}

	@Override
	public Label setBackgroundColor(Color color) {
		if (isAvailable(contentContainer)) {
			contentContainer.setBackground(color);
		}
		if (isAvailable(labelComposite)) {
			labelComposite.setBackground(color);
		}
		return getThis();
	}

	//#end region

}
