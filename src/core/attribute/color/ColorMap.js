default export class ColorMap extends StringAttributeAtom {

	//#region ATTRIBUTES

	@IsParameter(defaultValue = "My Color Map:")
	private String label;

	@IsParameter(defaultValue = "complement")
	private String defaultValue;

	@IsParameter(defaultValue = "")
	private String tooltip;

	private Label imageLabel = null;

	private ImageCombo styleCombo = null;

	/**
	 * Prefix for the image file names
	 */
	private final String imagePrefix = "color_map_";

	/**
	 * Predefined colors
	 */
	private final List<String> colorMaps = ColorMapValue.getAllStringValues();

	//#end region

	//#region CONSTRUCTORS

	public ColorMap(String name) {
		super(name);
		label = name;
	}

	public ColorMap(String name, String defaultStyle) {
		super(name);
		label = name;

		boolean isColorMap = colorMaps.contains(defaultStyle);
		if (isColorMap) {
			attributeValue = defaultStyle;
		} else {
			throw new IllegalArgumentException("The specified color map '" + defaultStyle + "' is not known.");
		}
	}

	/**
	 * Copy constructor
	 */
	private ColorMap(ColorMap colorMapToCopy) {
		super(colorMapToCopy);
		label = colorMapToCopy.label;
		defaultValue = colorMapToCopy.defaultValue;
		tooltip = colorMapToCopy.tooltip;
	}

	//#end region

	//#region METHODS

	@Override
	public ColorMap getThis() {
		return this;
	}

	@Override
	public ColorMap copy() {
		return new ColorMap(this);
	}

	@Override
	public Image provideImage() {
		return Activator.getImage("color_map_grey.png");
	}

	/**
	 * Creates the composite on a given parent
	 */
	@Override
	public AbstractStringAttributeAtom<ColorMap> createAttributeAtomControl(
			GridComposite parent,
			FocusChangingRefreshable treeViewerRefreshable) {

		//initialize value at the first call
		if (!isInitialized()) {
			set(defaultValue);
		}

		//toolkit
		FormToolkit toolkit = new FormToolkit(Display.getCurrent());

		//create container control for labels and line style
		GridComposite container = createContainer(parent);
		container.setVisible(isVisible());

		//label
		String currentLabel = getLabel();
		CustomLabel labelComposite = new CustomLabel(toolkit, container, currentLabel);
		final int prefferedLabelWidth = 80;
		labelComposite.setPrefferedWidth(prefferedLabelWidth);

		//image label
		imageLabel = toolkit.createLabel(container, "");

		//combo box
		styleCombo = new ImageCombo(container, SWT.DEFAULT);
		styleCombo.setEnabled(isEnabled());
		styleCombo.setEditable(false);

		//set predefined color map
		final List<String> currentColorMaps = getColorMaps();
		for (String styleString : currentColorMaps) {
			styleCombo.add(styleString, Activator.getImage(imagePrefix + styleString + ".png"));
		}

		//initialize selected item
		refreshAttributeAtomControl();

		//action listener for combo box
		styleCombo.addSelectionListener(new SelectionAdapter() {

			@SuppressWarnings("synthetic-access")
			@Override
			public void widgetSelected(SelectionEvent e) {
				int index = styleCombo.getSelectionIndex();
				String currentStyle = currentColorMaps.get(index);
				set(currentStyle);

				//trigger modification listeners
				triggerListeners();
			}
		});

		return this;

	}

	@Override
	public AbstractAttributeAtom<ColorMap, String> createAttributeAtomControl(
			Browser browser,
			Selection sectionBody,
			FocusChangingRefreshable treeViewerRefreshable) {
		//TODO Auto-generated method stub
		return null;
	}

	@SuppressWarnings("checkstyle:magicnumber")
	private static GridComposite createContainer(GridComposite parent) {

		//create grid data to use all horizontal space
		GridData fillHorizontal = new GridData();
		fillHorizontal.grabExcessHorizontalSpace = true;
		fillHorizontal.horizontalAlignment = GridData.FILL;

		GridComposite container = new GridComposite(parent);
		GridLayout gridLayout = new GridLayout(4, false);
		gridLayout.horizontalSpacing = 5;
		gridLayout.marginHeight = 4;
		gridLayout.marginWidth = 0;

		container.setLayout(gridLayout);
		container.setLayoutData(fillHorizontal);
		return container;
	}

	@Override
	public void refreshAttributeAtomControl() {
		if (isAvailable(styleCombo)) {
			final String currentStyle = get();
			int index = colorMaps.indexOf(currentStyle);
			if (styleCombo.getSelectionIndex() != index) {
				styleCombo.select(index);
				imageLabel.setImage(Activator.getImage(imagePrefix + currentStyle + ".png"));
			}
		}
	}

	//#end region

	//#region ACCESSORS

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	@Override
	public String getDefaultValue() {
		return defaultValue;
	}

	public void setDefaultValue(String defaultValue) {
		this.defaultValue = defaultValue;
	}

	public void setDefaultValue(ColorMapValue colorMapValue) {
		setDefaultValue(colorMapValue.toString());
	}

	public String getTooltip() {
		return tooltip;
	}

	public void setTooltip(String tooltip) {
		this.tooltip = tooltip;
	}

	/**
	 * Get color map value as string
	 *
	 * @return the value
	 */
	@Override
	public String get() {
		return super.get();
	}

	/**
	 * Set color map with string
	 *
	 * @param value
	 */
	@Override
	public ColorMap set(String value) {
		super.set(value);
		return getThis();
	}

	/**
	 * Get predefined color maps
	 */
	public List<String> getColorMaps() {
		return colorMaps;
	}

	@Override
	public ColorMap setBackgroundColor(org.eclipse.swt.graphics.Color backgroundColor) {
		throw new IllegalStateException("Not yet implemented");
	}

	//#end region

}