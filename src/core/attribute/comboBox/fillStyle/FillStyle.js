default export class FillStyle extends StringAttributeAtom {

	//#region ATTRIBUTES

	@IsParameter(defaultValue = "My Symbol Style:")
	private String label;

	@IsParameter(defaultValue = "cross")
	private String defaultValue;

	@IsParameter(defaultValue = "")
	private String tooltip;

	private ImageCombo styleCombo = null;

	private Label imageLabel = null;

	private static final String IMAGE_PREFIX = "fill_";

	/**
	 * Predefined symbol styles
	 */
	private static final List<String> FILL_STYLES = FillStyleValue.getAllStringValues();

	//#end region

	//#region CONSTRUCTORS

	public FillStyle(String name) {
		super(name);
		label = name;
	}

	public FillStyle(String name, String label) {
		super(name);
		this.label = label;
	}

	public FillStyle(String name, String label, String defaultStyle) {
		super(name);
		this.label = label;

		boolean isFillStyle = FILL_STYLES.contains(defaultStyle);
		if (isFillStyle) {
			attributeValue = defaultStyle;
		} else {
			throw new IllegalArgumentException("The specified fill style '" + defaultStyle + "' is not known.");
		}
	}

	/**
	 * Copy constructor
	 */
	private FillStyle(FillStyle fillStyleToCopy) {
		super(fillStyleToCopy);
		label = fillStyleToCopy.label;
		defaultValue = fillStyleToCopy.defaultValue;
		tooltip = fillStyleToCopy.tooltip;
	}

	//#end region

	//#region METHODS

	@Override
	public FillStyle getThis() {
		return this;
	}

	@Override
	public FillStyle copy() {
		return new FillStyle(this);
	}

	@Override
	public Image provideImage() {
		return Activator.getImage("fill_cross.png");
	}

	@Override
	public AbstractStringAttributeAtom<FillStyle> createAttributeAtomControl(
			GridComposite parent,
			FocusChangingRefreshable treeViewerRefreshable) {

		//initialize value at the first call
		if (!isInitialized()) {
			set(defaultValue);
		}

		//toolkit
		FormToolkit toolkit = new FormToolkit(Display.getCurrent());

		GridComposite container = createContainer(parent);
		container.setVisible(isVisible());

		//label
		String currentLabel = getLabel();
		CustomLabel labelComposite = new CustomLabel(toolkit, container, currentLabel);
		final int prefferredLabelWidth = 85;
		labelComposite.setPrefferedWidth(prefferredLabelWidth);

		//image label
		imageLabel = toolkit.createLabel(container, "");

		//separator
		toolkit.createLabel(container, "  ");

		//combo box
		styleCombo = new ImageCombo(container, SWT.DEFAULT);
		styleCombo.setEnabled(isEnabled());
		styleCombo.setEditable(false);

		//set predefined styles
		final List<String> styles = getFillStyles();
		for (String styleString : styles) {
			styleCombo.add(styleString, Activator.getImage(IMAGE_PREFIX + styleString + ".png"));
		}

		//initialize selected item
		refreshAttributeAtomControl();

		//action listener for combo box
		styleCombo.addSelectionListener(new SelectionAdapter() {

			@SuppressWarnings("synthetic-access")
			@Override
			public void widgetSelected(SelectionEvent e) {
				int index = styleCombo.getSelectionIndex();
				String currentStyle = styles.get(index);
				set(currentStyle);
				imageLabel.setImage(Activator.getImage(IMAGE_PREFIX + currentStyle + ".png"));

				//trigger modification listeners
				triggerListeners();
			}
		});

		return this;

	}

	@Override
	public AbstractAttributeAtom<FillStyle, String> createAttributeAtomControl(
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

		//create container control for labels and file style
		GridComposite container = new GridComposite(parent);
		GridLayout gridLayout = new GridLayout(5, false);
		gridLayout.horizontalSpacing = 0;
		container.setLayout(gridLayout);
		container.setLayoutData(fillHorizontal);
		return container;
	}

	@Override
	public void refreshAttributeAtomControl() {
		if (isAvailable(styleCombo)) {
			String style = get();
			final List<String> styles = getFillStyles();
			int index = styles.indexOf(style);
			if (styleCombo.getSelectionIndex() != index) {
				styleCombo.select(index);
				imageLabel.setImage(Activator.getImage(IMAGE_PREFIX + style + ".png"));
			}
		}
	}

	@Override
	public FillStyle setBackgroundColor(org.eclipse.swt.graphics.Color backgroundColor) {
		throw new IllegalStateException("Not yet implemented");

	}

	//#end region

	//#region ACCESSORS

	public String getLabel() {
		return label;
	}

	public FillStyle setLabel(String label) {
		this.label = label;
		return getThis();
	}

	@Override
	public String getDefaultValue() {
		return defaultValue;
	}

	public FillStyle setDefaultValue(String defaultValue) {
		this.defaultValue = defaultValue;
		return getThis();
	}

	public void setDefaultValue(FillStyleValue style) {
		setDefaultValue(style.toString());
	}

	public String getTooltip() {
		return tooltip;
	}

	public FillStyle setTooltip(String tooltip) {
		this.tooltip = tooltip;
		return getThis();
	}

	@Override
	public String get() {
		return super.get();
	}

	@Override
	public FillStyle set(String style) {
		super.set(style);
		return getThis();
	}

	/**
	 * Get predefined fill styles
	 */
	public List<String> getFillStyles() {
		return FILL_STYLES;
	}

	//#end region

}
