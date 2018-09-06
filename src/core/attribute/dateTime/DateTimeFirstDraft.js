default export class DateTimeFirstDraft extends ZonedDateTimeAttributeAtom {

	//#region ATTRIBUTES

	@IsParameter(defaultValue = "Label")
	private String label;

	@IsParameter(defaultValue = "Tooltip")
	private String tooltip;

	@IsParameter(defaultValue = "2016-01-30T10:15:30+01:00[Europe/Paris].")
	private String defaultValueString;

	private GrabbingRowComposite contentContainer;

	private CustomLabel labelComposite;

	private Button valueCheckBox;

	/**
	 * The parent composite for the attribute atom control can be stored here to be able to refresh it.
	 */
	protected Composite attributeAtomParent = null;

	//#end region

	//#region CONSTRUCTORS

	public DateTimeFirstDraft(String name) {
		super(name);
		label = Utils.firstToUpperCase(name); //this default label might be overridden by explicitly setting the label
	}

	public DateTimeFirstDraft(String name, ZonedDateTime dateTime) {
		super(name);
		label = name;
		set(dateTime);
	}

	/**
	 * Copy constructor
	 */
	protected DateTimeFirstDraft(DateTimeFirstDraft atomToCopy) {
		super(atomToCopy);
		label = atomToCopy.label;
		tooltip = atomToCopy.tooltip;
		defaultValueString = atomToCopy.defaultValueString;

	}

	//#end region

	//#region METHODS

	@Override
	public DateTimeFirstDraft getThis() {
		return this;
	}

	//#region COPY

	@Override
	public DateTimeFirstDraft copy() {
		return new DateTimeFirstDraft(this);
	}

	//#end region

	@Override
	public Image provideImage() {
		Image baseImage = Activator.getImage("DateTime.png");
		return baseImage;
	}

	@Override
	@SuppressWarnings("checkstyle:magicnumber")
	public AbstractZonedDateTimeAttributeAtom<DateTimeFirstDraft> createAttributeAtomControl(
			GridComposite parent,
			FocusChangingRefreshable treeViewerRefreshable) {
		this.attributeAtomParent = parent;
		this.treeViewRefreshable = treeViewerRefreshable;

		//initialize value at the first call
		if (!isInitialized()) {
			ZonedDateTime defaultValue = getDateTimeFromString(defaultValueString);
			set(defaultValue);
		}

		//create toolkit
		FormToolkit toolkit = new FormToolkit(Display.getCurrent());

		//create content composite for label and check box
		contentContainer = new GrabbingRowComposite(parent);
		contentContainer.setBackground(backgroundColor);

		//create label
		createLabel(toolkit);

		//create check box
		createCheckBox(toolkit);

		//initialize filePath
		//set(valueCheckBox.getSelection());

		return this;
	}

	@Override
	public AbstractAttributeAtom<DateTimeFirstDraft, ZonedDateTime> createAttributeAtomControl(
			Browser browser,
			Selection sectionBody,
			FocusChangingRefreshable treeViewerRefreshable) {
		//TODO Auto-generated method stub
		return null;
	}

	private ZonedDateTime getDateTimeFromString(String defaultValueString2) {
		//TODO Auto-generated method stub
		return null;
	}

	private void createLabel(FormToolkit toolkit) {
		labelComposite = new CustomLabel(toolkit, contentContainer, label);
		final int prefferedLabelWidth = 80;
		labelComposite.setPrefferedWidth(prefferedLabelWidth);
		labelComposite.setBackground(backgroundColor);
	}

	private void createCheckBox(FormToolkit toolkit) {
		valueCheckBox = toolkit.createButton(contentContainer, "", SWT.CHECK);
		valueCheckBox.setEnabled(isEnabled());
		valueCheckBox.setVisible(isVisible());
		//valueCheckBox.setSelection(get());
		valueCheckBox.setToolTipText(tooltip);
		valueCheckBox.setBackground(backgroundColor);

		//action listener
		valueCheckBox.addSelectionListener(new SelectionAdapter() {

			@SuppressWarnings("synthetic-access")
			@Override
			public void widgetSelected(SelectionEvent e) {
				boolean currentValue = valueCheckBox.getSelection();
				//set(currentValue);
				//updated enabled states if ComboBoxEnableTarget children exist
				updateTargetsEnabledStates(currentValue);

				//trigger modification listeners
				triggerListeners();
			}

		});
	}

	@Override
	public DateTimeFirstDraft setEnabled(boolean state) {
		super.setEnabled(state);
		if (isAvailable(valueCheckBox)) {
			valueCheckBox.setEnabled(state);
		}
		if (treeViewRefreshable != null) {
			treeViewRefreshable.refresh();
		}
		this.refreshAttributeAtomControl();
		return getThis();
	}

	@Override
	public void refreshAttributeAtomControl() {
		if (isAvailable(valueCheckBox)) {
			ZonedDateTime value = get();
			//if (valueCheckBox.getSelection() != value) {
			//valueCheckBox.setSelection(value);
			//}
		}
	}

	/**
	 * Updates the enabled/disabled state of other components, dependent on the current value
	 *
	 * @param currentValue
	 */
	@SuppressWarnings("checkstyle:linelength")
	private void updateTargetsEnabledStates(Boolean currentValue) {
		List<TreeNodeAdaption> enableNodes = createTreeNodeAdaption().getChildren();
		for (TreeNodeAdaption enableNode : enableNodes) {
			org.treez.core.atom.attribute.checkBox.CheckBoxEnableTarget enableProperty = (org.treez.core.atom.attribute.checkBox.CheckBoxEnableTarget) enableNode
					.getAdaptable();

			Boolean enableValue = enableProperty.getValue();
			String targetPath = enableProperty.getTargetPath();
			AttributeRoot root = (AttributeRoot) getRoot();
			AbstractAttributeAtom<?, ?> target = (AbstractAttributeAtom<?, ?>) root.getChild(targetPath);
			boolean enableTarget = enableValue.equals(currentValue);
			if (enableTarget) {
				target.setEnabled(true);
			} else {
				target.setEnabled(false);
			}
		}
	}

	public void createEnableTarget(String name, String targetPath) {
		CheckBoxEnableTarget enableTarget = new CheckBoxEnableTarget(name, true, targetPath);
		addChild(enableTarget);
	}

	public void createDisableTarget(String name, String targetPath) {
		CheckBoxEnableTarget enableTarget = new CheckBoxEnableTarget(name, false, targetPath);
		addChild(enableTarget);
	}

	//#end region

	//#region ACCESSORS

	public String getLabel() {
		return label;
	}

	public DateTimeFirstDraft setLabel(String label) {
		this.label = label;
		return getThis();
	}

	public String getTooltip() {
		return tooltip;
	}

	public DateTimeFirstDraft setTooltip(String tooltip) {
		this.tooltip = tooltip;
		return this;
	}

	@Override
	public ZonedDateTime getDefaultValue() {
		return getDateTimeFromString(defaultValueString);
	}

	public DateTimeFirstDraft setDefaultValue(ZonedDateTime defaultValue) {
		this.defaultValueString = defaultValue.toString();
		return getThis();
	}

	@Override
	public DateTimeFirstDraft setBackgroundColor(Color color) {
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

	//#end region

}
