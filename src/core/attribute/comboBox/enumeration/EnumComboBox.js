default export class EnumComboBox extends EnumAttributeAtom {

	//#region ATTRIBUTES

	@IsParameter(defaultValue = "My Enum value:")
	private String label;

	@IsParameter(defaultValue = "")
	private String tooltip;

	private GrabbingRowComposite contentContainer;

	private CustomLabel labelComposite;

	private Combo comboBox;

	private Label imageLabel;

	/**
	 * The default enum value (also implicitly provides the available values)
	 */
	private E defaultValue;

	//#end region

	//#region CONSTRUCTORS

	public EnumComboBox(E defaultValue, String name) {
		super(name);
		label = Utils.firstToUpperCase(name);
		setDefaultValue(defaultValue);
	}

	public EnumComboBox(E defaultValue, String name, String label) {
		super(name);
		this.label = label;
		setDefaultValue(defaultValue);
	}

	/**
	 * Copy constructor
	 */
	private EnumComboBox(EnumComboBox<E> comboToCopy) {
		super(comboToCopy);
		label = comboToCopy.label;
		defaultValue = comboToCopy.defaultValue;
		tooltip = comboToCopy.tooltip;
		comboBox = comboToCopy.comboBox;
		imageLabel = comboToCopy.imageLabel;
	}

	//#end region

	//#region METHODS

	@Override
	public EnumComboBox<E> getThis() {
		return this;
	}

	@Override
	public EnumComboBox<E> copy() {
		return new EnumComboBox<E>(this);
	}

	@Override
	public Image provideImage() {
		return Activator.getImage("combobox.png");
	}

	@Override
	public AbstractEnumAttributeAtom<EnumComboBox<E>, E> createAttributeAtomControl(
			GridComposite parent,
			FocusChangingRefreshable treeViewerRefreshable) {

		//initialize value at the first call
		if (!isInitialized()) {
			set(defaultValue);
		}

		//toolkit
		FormToolkit toolkit = new FormToolkit(Display.getCurrent());

		//create content composite for label and check box
		contentContainer = new GrabbingRowComposite(parent);

		GridData gridData = new GridData(SWT.FILL, SWT.FILL, true, false);
		contentContainer.setLayoutData(gridData);

		contentContainer.setVisible(isVisible());

		createLabel(toolkit);

		comboBox = new Combo(contentContainer, SWT.DEFAULT);
		comboBox.setEnabled(isEnabled());

		//set available values
		List<E> allEnumValues = getAvailableEnumValues();
		for (E value : allEnumValues) {
			comboBox.add(value.toString());
		}

		//initialize selected item
		refreshAttributeAtomControl();

		//action listener for combo box
		comboBox.addSelectionListener(new SelectionAdapter() {

			@SuppressWarnings("synthetic-access")
			@Override
			public void widgetSelected(SelectionEvent e) {
				int index = comboBox.getSelectionIndex();
				E currentValue = allEnumValues.get(index);
				set(currentValue);

				//updates enabled states if ComboBoxEnableTarget children exist
				updateTargetsEnabledStates(currentValue);
			}
		});

		//updates enabled states if ComboBoxEnableTarget children exist
		updateTargetsEnabledStates(get());

		return this;

	}

	@Override
	public AbstractAttributeAtom<EnumComboBox<E>, E> createAttributeAtomControl(
			Browser browser,
			Selection sectionBody,
			FocusChangingRefreshable treeViewerRefreshable) {
		//TODO Auto-generated method stub
		return null;
	}

	private List<E> getAvailableEnumValues() {
		E[] allEnumValues = defaultValue.getDeclaringClass().getEnumConstants();
		return Arrays.asList(allEnumValues);
	}

	private void createLabel(FormToolkit toolkit) {
		labelComposite = new CustomLabel(toolkit, contentContainer, label);
		final int prefferedLabelWidth = 80;
		labelComposite.setPrefferedWidth(prefferedLabelWidth);
	}

	@Override
	public void refreshAttributeAtomControl() {
		if (isAvailable(comboBox)) {
			List<E> allEnumValues = getAvailableEnumValues();
			E value = get();
			int index = allEnumValues.indexOf(value);

			if (comboBox.getSelectionIndex() != index) {
				comboBox.select(index);
			}
		}
	}

	public void createEnableTarget(String name, E enablingEnumValue, String targetPath) {
		ComboBoxEnableTarget enableDomainSection = new ComboBoxEnableTarget(name, enablingEnumValue.name(), targetPath);
		addChild(enableDomainSection);
	}

	public void createDisableTarget(String name, E disablingEnumValue, String targetPath) {

		List<E> allEnumValues = getAvailableEnumValues();
		List<String> enablingEnumNames = new ArrayList<>();
		for (E enumValue : allEnumValues) {
			if (enumValue != disablingEnumValue) {
				enablingEnumNames.add(enumValue.name());
			}
		}

		ComboBoxEnableTarget enableDomainSection = new ComboBoxEnableTarget(
				name,
				String.join(",", enablingEnumNames),
				targetPath);
		addChild(enableDomainSection);
	}

	/**
	 * Updates the enabled/disabled state of other components, dependent on the current value
	 *
	 * @param currentEnumValue
	 */
	@SuppressWarnings("checkstyle:linelength")
	private void updateTargetsEnabledStates(E currentEnumValue) {
		List<TreeNodeAdaption> enableNodes = createTreeNodeAdaption().getChildren();
		for (TreeNodeAdaption enableNode : enableNodes) {
			org.treez.core.atom.attribute.comboBox.ComboBoxEnableTarget comboBoxEnableTarget = (org.treez.core.atom.attribute.comboBox.ComboBoxEnableTarget) enableNode
					.getAdaptable();

			List<String> enableValues = comboBoxEnableTarget.getItems();
			String targetPath = comboBoxEnableTarget.getTargetPath();
			AttributeRoot root = (AttributeRoot) getRoot();
			AbstractAttributeParentAtom<?> target = (AbstractAttributeParentAtom<?>) root.getChild(targetPath);
			boolean enableTarget = enableValues.contains(currentEnumValue.name());
			if (enableTarget) {
				target.setEnabled(true);
			} else {
				target.setEnabled(false);
			}
		}
	}

	//#end region

	//#region ACCESSORS

	public String getLabel() {
		return label;
	}

	public EnumComboBox<E> setLabel(String label) {
		this.label = label;
		return getThis();
	}

	@Override
	public E getDefaultValue() {
		return defaultValue;
	}

	public EnumComboBox<E> setDefaultValue(E defaultValue) {
		this.defaultValue = defaultValue;
		return getThis();
	}

	public String getTooltip() {
		return tooltip;
	}

	public EnumComboBox<E> setTooltip(String tooltip) {
		this.tooltip = tooltip;
		return getThis();
	}

	@Override
	public E get() {
		return super.get();
	}

	@Override
	public EnumComboBox<E> set(E value) {
		super.set(value);
		return getThis();
	}

	@Override
	public EnumComboBox<E> setEnabled(boolean state) {
		super.setEnabled(state);
		if (isAvailable(comboBox)) {
			comboBox.setEnabled(state);
		}
		if (treeViewRefreshable != null) {
			//treeViewRefreshable.refresh(); //creates flickering when targets are updated
		}
		refreshAttributeAtomControl();
		return getThis();
	}

	@Override
	public EnumComboBox<E> setBackgroundColor(org.eclipse.swt.graphics.Color backgroundColor) {
		throw new IllegalStateException("Not yet implemented");
	}

	@Override
	public EnumComboBox<E> setVisible(boolean visible) {
		super.setVisible(visible);
		if (isAvailable(contentContainer)) {
			contentContainer.setVisible(visible);
		}
		return getThis();
	}

	//#end region

}
