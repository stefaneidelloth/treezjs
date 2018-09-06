default export class FilePathList extends StringList {

	//#region CONSTRUCTORS

	public FilePathList(String name) {
		super(name);
	}

	/**
	 * Copy constructor
	 */
	protected FilePathList(FilePathList atomToCopy) {
		super(atomToCopy);
	}

	//#end region

	//#region METHODS

	@Override
	public FilePathList getThis() {
		return this;
	}

	/**
	 * Creates a treez list that contains Strings/text
	 */
	@Override
	protected void createTreezList() {
		treezList = new TreezListAtom("treezList");
		treezList.setColumnType(ColumnType.STRING);
		treezList.setShowHeaders(false);
		treezList.enableFilePathButton();
	}

	//#end region

}
