default export class class DirectoryPathList extends StringList {

	//#region CONSTRUCTORS

	public DirectoryPathList(String name) {
		super(name);
	}

	/**
	 * Copy constructor
	 */
	protected DirectoryPathList(DirectoryPathList atomToCopy) {
		super(atomToCopy);
	}

	//#end region

	//#region METHODS

	@Override
	public DirectoryPathList getThis() {
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
		treezList.enableDirectoryPathButton();
	}

	//#end region

}
