default export class StringList extends AttributeAtom {

	//#region ATTRIBUTES

	@IsParameter(defaultValue = "Values:")
	private String label;

	@IsParameter(defaultValue = "a,b")
	private String defaultValueString;

	private CustomLabel labelComposite;

	/**
	 * The wrapped treez list atom
	 */
	protected TreezListAtom treezList;

	/**
	 * The control adaption of the treez list atom
	 */
	private TreezListAtomControlAdaption treezListControlAdaption;

	/**
	 * The parent composite for the list
	 */
	private FillComposite listContainerComposite;

	//#end region

	//#region CONSTRUCTORS

	public StringList(String name) {
		super(name);
		label = name;
		createTreezList();
	}

	/**
	 * Copy constructor
	 */
	protected StringList(StringList atomToCopy) {
		super(atomToCopy);
		label = atomToCopy.label;
		treezList = atomToCopy.treezList;

	}

	//#end region

	//#region METHODS

	@Override
	public StringList getThis() {
		return this;
	}

	/**
	 * Creates a treez list that contains Strings/text
	 */
	protected void createTreezList() {
		treezList = new TreezListAtom("treezList");
		treezList.setColumnType(ColumnType.STRING);
		treezList.setShowHeaders(false);
	}

	@Override
	public StringList copy() {
		return new StringList(this);
	}

	@Override
	public Image provideImage() {
		return Activator.getImage("column.png");
	}

	@Override
	public AbstractAttributeAtom<StringList, List<String>> createAttributeAtomControl(
			GridComposite parent,
			FocusChangingRefreshable treeViewerRefreshable) {

		//initialize value at the first call
		if (!isInitialized()) {
			setValue(defaultValueString);
		}

		//create toolkit
		FormToolkit toolkit = new FormToolkit(Display.getCurrent());

		//create content composite for label and list
		GridComposite contentContainer = GridComposite.createForTowLines(parent);

		//create label
		labelComposite = new CustomLabel(toolkit, contentContainer, label);
		final int prefferedLabelWidth = 80;
		labelComposite.setPrefferedWidth(prefferedLabelWidth);

		//create parent composite for treez list
		listContainerComposite = new FillComposite(contentContainer);
		GridData fillData = new GridData(GridData.FILL, GridData.FILL, true, true);
		listContainerComposite.setLayoutData(fillData);

		//create treez list control
		createTreezListControl();

		return this;
	}

	@Override
	public AbstractAttributeAtom<StringList, List<String>> createAttributeAtomControl(
			Browser browser,
			Selection sectionBody,
			FocusChangingRefreshable treeViewerRefreshable) {
		//TODO Auto-generated method stub
		return null;
	}

	/**
	 * Creates the control for the treezList by calling the corresponding method of the wrapped TreezListAtom
	 */
	private void createTreezListControl() {
		treezListControlAdaption = (TreezListAtomControlAdaption) treezList
				.createControlAdaption(listContainerComposite, treeViewRefreshable);
	}

	@Override
	public void refreshAttributeAtomControl() {
		if (treezList != null) {
			List<String> values = get();
			List<Row> rows = new ArrayList<>();
			for (String value : values) {
				Row newRow = new Row(treezList);
				newRow.setEntry(treezList.getValueHeader(), value);
				rows.add(newRow);
			}
			treezList.setRows(rows);

		}

		if (treezListControlAdaption != null) {
			createTreezListControl();
		}
	}

	/**
	 * Splits the given valueString with "," and returns the individual values as a String list
	 *
	 * @param valueString
	 * @return
	 */
	private static List<String> valueStringToList(String valueString) {
		String[] individualValues = valueString.split(",");
		List<String> stringValues = Arrays.asList(individualValues);
		return stringValues;
	}

	@Override
	public StringList setBackgroundColor(org.eclipse.swt.graphics.Color backgroundColor) {
		throw new IllegalStateException("Not yet implemented");

	}

	//#end region

	//#region ACCESSORS

	//#region LABEL

	public String getLabel() {
		return label;
	}

	public StringList setLabel(String label) {
		this.label = label;
		return getThis();
	}

	//#end region

	//#region VALUE

	/**
	 * Sets the list with a given comma separated value string
	 *
	 * @param valueString
	 */
	public StringList setValue(String valueString) {
		List<String> stringValues = valueStringToList(valueString);
		set(stringValues);
		return getThis();
	}

	//#end region

	//#region DEFAULT VALUE

	@Override
	public List<String> getDefaultValue() {
		List<String> stringValues = valueStringToList(defaultValueString);
		return stringValues;
	}

	public StringList setDefaultValue(String defaultValueString) {
		this.defaultValueString = defaultValueString;
		return getThis();
	}

	//#end region

	//#end region

}
