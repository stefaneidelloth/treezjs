import Model from "./../model.js";

export default class TableImport extends Model {

	static get LOG(){
		return Log4j.getLogger(TableImport.constructor.name);
	}

	constructor(name) {
		super(name);
        this.columnSeparator = undefined;
        this.customJobId= undefined;
        this.customJobIdField= undefined;
        this.customQuery= undefined;

        this.host = undefined;
		this.image = 'tableImport.png';

        this.isAppendingData= undefined;
        this.isFilteringForJob = undefined;
        this.isInheritingSourceFilePath = undefined;
        this.isLinkingSource = undefined;
		this.isRunnable=true;

        this.isUsingCustomQuery= undefined;
        this.password = undefined;
        this.port = undefined;

        this.resultTableModelPath= undefined;
        this.rowLimit = undefined;

        this.schema = undefined;
        this.sourceFilePath = undefined;
        this.sourceType = undefined;

        this.tableName = undefined;

        this.user = undefined;
	}

	copy() {
		//TODO
	}

	/*

	createTableImportModel() {

		AttributeRoot root = new AttributeRoot("root");

		Page dataPage = root.createPage("data", "   Data   ");

		String relativeHelpContextId = "tableImport";
		String absoluteHelpContextId = Activator.getAbsoluteHelpContextIdStatic(relativeHelpContextId);

		createSourceTypeSection(dataPage, absoluteHelpContextId);
		createSourceDataSection(dataPage, absoluteHelpContextId);
		createTargetSection(dataPage, absoluteHelpContextId);
		setModel(root);
	}

	createSourceTypeSection(page) {
		Section sourceTypeSection = dataPage.createSection("sourceTypeSection", absoluteHelpContextId);
		sourceTypeSection.setLabel("Source type");
		sourceTypeSection.createSectionAction("action", "Import data", () -> execute(treeView));

		//source type
		EnumComboBox<TableSourceType> sourceTypeCheck = sourceTypeSection.createEnumComboBox(sourceType, this,
				TableSourceType.CSV);
		sourceTypeCheck.setLabel("Source type");
		sourceTypeCheck.addModificationConsumer("enableAndDisableDependentComponents",
				() -> enableAndDisableDependentComponents());

		//if true, the target table is linked to the original source
		//pro: for huge tables only the first few rows need to be initialized and the
		//remaining data can be loaded lazily.
		//con: if the source is replaced/changed/deleted, e.g. in a sweep, the
		//link might not give meaningful data.
		sourceTypeSection
				.createCheckBox(linkSource, this, false) //
				.setLabel("Link source") //
				.addModificationConsumer("enableAndDisableLinkComponents", () -> {
					enableAndDisableLinkComponents();
				});

		sourceTypeSection
				.createIntegerVariableField(rowLimit, this, 1000) //
				.setLabel("Row limit");

	}

	enableAndDisableLinkComponents() {
		boolean linkToSource = linkSource.get();
		if (linkToSource) {
			setEnabled(rowLimit, false);
			setEnabled(appendData, false);
		} else {
			setEnabled(rowLimit, true);
			setEnabled(appendData, true);
		}

	}

	createSourceDataSection(page) {
		Section sourceDataSection = dataPage.createSection("sourceDataSection", absoluteHelpContextId);
		sourceDataSection.setLabel("Source data");

		//inherit source file path : take (modified) parent output path
		CheckBox inheritSourcePath = sourceDataSection.createCheckBox(inheritSourceFilePath, this, true);
		inheritSourcePath.setLabel("Inherit source file");
		inheritSourcePath.addModificationConsumer("enableComponents", () -> enableAndDisableDependentComponents());

		//path to data file (enabled if source is file based)
		String sourcePath = getSourcePath();
		sourceDataSection.createFilePath(sourceFilePath, this, "Source file", sourcePath);

		TextField columnSeparatorField = sourceDataSection.createTextField(columnSeparator, this, ";");
		columnSeparatorField.setLabel("Column separator");
		//host
		TextField hostField = sourceDataSection.createTextField(host, this, "localhost");
		hostField.setLabel("Host name/IP address");

		//port
		sourceDataSection.createTextField(port, this, "3306");

		//user
		sourceDataSection.createTextField(user, this, "root");

		//password
		sourceDataSection.createTextField(password, this, "");

		//database name (e.g. for SqLite or MySql sources)
		TextField schemaField = sourceDataSection.createTextField(schema, this, "my_schema");
		schemaField.setLabel("Schema name");

		//table name (e.g. name of Excel sheet or SqLite table )
		TextField tableField = sourceDataSection.createTextField(tableName, this, "Sheet1");
		tableField.setLabel("Table name");

		sourceDataSection
				.createCheckBox(filterForJob, this, false) //
				.setLabel("Filter rows with JobId") //
				.addModificationConsumer("enableAndDistableJobComponents", () -> enableAndDisableJobComponents());

		sourceDataSection
				.createTextField(customJobId, this) //
				.setLabel("JobId") //
				.addModificationConsumer("updateJobIdOfAbstractModelWithUserInput", () -> {
					if (getJobId() != customJobId.get()) {
						this.setJobId(customJobId.get());
					}
				});

		if (customJobIdField != null) {
			if (customJobId.get() == null) {
				customJobId.set(customJobIdField);
			}
		}

		sourceDataSection
				.createCheckBox(useCustomQuery, this, false) //
				.setLabel("Use custom query") //
				.addModificationConsumer("enableAndDistableQueryComponents", () -> enableAndDisableQueryComponents());

		sourceDataSection
				.createTextArea(customQuery, this) //
				.setLabel("Custom query");

	}

	enableAndDisableJobComponents() {
		boolean isFilteringForJob = filterForJob.get();
		if (isFilteringForJob) {
			setEnabled(customJobId, true);
		} else {
			setEnabled(customJobId, false);
		}
	}

	enableAndDisableQueryComponents() {
		boolean isUsingCustomQuery = useCustomQuery.get();
		if (isUsingCustomQuery) {
			setEnabled(customQuery, true);
			setEnabled(tableName, false);
			setEnabled(filterForJob, false);
			setEnabled(customJobId, true);
		} else {
			setEnabled(customQuery, false);
			setEnabled(tableName, true);
			setEnabled(filterForJob, true);
			enableAndDisableJobComponents();
		}
	}

	createTargetSection(page) {
		Section targetSection = dataPage.createSection("target", absoluteHelpContextId);

		//target result table (must already exist for manual execution of the TableImport)
		ModelPathSelectionType selectionType = ModelPathSelectionType.FLAT;
		ModelPath resultTable = targetSection.createModelPath(resultTableModelPath, this, null, Table.class,
				selectionType, this, false);
		resultTable.setLabel("Result table");

		//append check box (if true, existing data is not deleted and new data is appended)
		CheckBox appendDataCheck = targetSection.createCheckBox(appendData, this, false);
		appendDataCheck.setLabel("Append data");
	}

	afterCreateControlAdaptionHook() {
		this.enableAndDisableDependentComponents();
		this.updatedInheritedSourcePath();
	}

	updatedInheritedSourcePath() {
		boolean inheritPath = inheritSourceFilePath.get();
		if (inheritPath) {
			sourceFilePath.set(getSourcePath());
		}
	}

	enableAndDisableDependentComponents() {
		TableSourceType tableSourceType = getSourceType();
		switch (tableSourceType) {
		case CSV:
			enableAndDisableCompontentsForCsv();
			break;
		case SQLITE:
			enableAndDisableCompontentsForSqLite();
			break;
		case MYSQL:
			enableAndDisableCompontentsForMySql();
			break;
		default:
			String message = "The TableSourceType " + tableSourceType + " is not yet implemented.";
			throw new IllegalStateException(message);
		}
	}

	enableAndDisableCompontentsForCsv() {

		setEnabled(linkSource, false); //TODO: check if csv can be read paginated. If so, it might make sense to enable this
		setEnabled(filterForJob, false);

		setEnabled(inheritSourceFilePath, true);

		boolean inheritPath = inheritSourceFilePath.get();
		setEnabled(sourceFilePath, !inheritPath);
		setEnabled(columnSeparator, !inheritPath);

		setEnabled(host, false);
		setEnabled(port, false);
		setEnabled(user, false);
		setEnabled(password, false);
		setEnabled(schema, false);
		setEnabled(tableName, false);

		setEnabled(useCustomQuery, false);
	}

	enableAndDisableCompontentsForSqLite() {

		setEnabled(linkSource, true);
		setEnabled(filterForJob, true);

		setEnabled(inheritSourceFilePath, true);

		boolean inheritPath = inheritSourceFilePath.get();
		setEnabled(sourceFilePath, !inheritPath);

		setEnabled(columnSeparator, false);
		setEnabled(host, false);
		setEnabled(port, false);
		setEnabled(user, false);
		setEnabled(password, true);
		setEnabled(schema, false);
		setEnabled(tableName, true);

		setEnabled(useCustomQuery, true);
		enableAndDisableQueryComponents();
	}

	enableAndDisableCompontentsForMySql() {

		setEnabled(linkSource, true);
		setEnabled(filterForJob, true);

		setEnabled(inheritSourceFilePath, false);
		setEnabled(sourceFilePath, false);
		setEnabled(columnSeparator, false);
		setEnabled(host, true);
		setEnabled(port, true);
		setEnabled(user, true);
		setEnabled(password, true);
		setEnabled(schema, true);
		setEnabled(tableName, true);

		setEnabled(useCustomQuery, true);
		enableAndDisableQueryComponents();
	}


	static setEnabled(attribute, value) {
		Wrap<?> attributeWrapper = (Wrap<?>) attribute;
		AbstractAttributeAtom<?, ?> atom = (AbstractAttributeAtom<?, ?>) attributeWrapper.getAttribute();
		boolean hasEqualValue = (atom.isEnabled() == value);
		if (!hasEqualValue) {
			atom.setEnabled(value);
		}
	}


	doRunModel(refreshable, monitor) {

		LOG.info("Running " + this.getClass().getSimpleName() + " '" + getName() + "'");

		String targetModelPath = resultTableModelPath.get();

		if (targetModelPath.isEmpty()) {
			throw new IllegalStateException("The table import must define a target table.");
		}

		try {
			getChildFromRoot(targetModelPath);
		} catch (Exception exception) {
			String message = "Could not find target table " + targetModelPath;
			throw new IllegalStateException(message);
		}

		Table treezTable;

		boolean linkToSource = linkSource.get();
		if (linkToSource) {
			treezTable = linkTargetTableToSource(targetModelPath, this);
		} else {
			TableData tableData = importTableData();
			Boolean appendFlag = appendData.get();
			treezTable = writeDataToTargetTable(tableData, targetModelPath, appendFlag);
		}

		//create a copy of the target table to be able to conserve it as a model output for the current run
		String outputTableName = getName() + "Output";
		Table outputTable = treezTable.copy();
		outputTable.setName(outputTableName);

		//wrap table in a model output
		ModelOutput modelOutput = () -> {
			//overrides getRootOutput
			return outputTable;
		};

		LOG.info(this.getClass().getSimpleName() + " '" + getName() + "' finished.");

		//return model output
		return modelOutput;
	}

	importTableData() {

		TableSourceType tableSourceType = getSourceType();
		int maxRows = getRowLimit();

		String sourcePath = getSourcePath();

		String columnSeparatorString = columnSeparator.get();

		String passwordString = password.get();
		String tableNameString = tableName.get();

		Boolean filterRows = filterForJob.get();
		String jobIdString = getJobId();

		//determine file extension (=>data type)
		TableData tableData;
		switch (tableSourceType) {
		case CSV:
			tableData = TextDataTableImporter.importData(sourcePath, columnSeparatorString, maxRows);
			return tableData;
		case SQLITE:
			tableData = SqLiteImporter.importData(sourcePath, passwordString, tableNameString, filterRows, jobIdString,
					maxRows, 0);
			return tableData;
		case MYSQL:
			String hostString = host.get();
			String portString = port.get();
			String userString = user.get();
			String schemaString = schema.get();
			String url = hostString + ":" + portString + "/" + schemaString;

			tableData = org.treez.data.database.mysql.MySqlImporter.importData(url, userString, passwordString,
					tableNameString, filterRows, jobIdString, maxRows, 0);
			return tableData;
		default:
			throw new IllegalStateException("The TableSourceType '" + tableSourceType + "' is not yet implemented.");
		}
	}

	getSourcePath() {
		boolean inheritPath = inheritSourceFilePath.get();
		String sourcePath;
		if (inheritPath) {
			sourcePath = getSourcePathFromParent();
		} else {
			sourcePath = sourceFilePath.get();
		}
		return sourcePath;
	}


	getSourcePathFromParent() {
		AbstractAtom<?> parent = this.getParentAtom();
		if (parent == null) {
			return "";
		}

		boolean parentIsPathProvider = FilePathProvider.class.isAssignableFrom(parent.getClass());
		if (parentIsPathProvider) {
			FilePathProvider pathProvider = (FilePathProvider) parent;
			String path = pathProvider.provideFilePath();
			return path;
		} else {
			String message = "The parent atom '" + parent.getName()
					+ "' does not implement the interface FilePathPrivider. "
					+ "Therefore the soruce file path could not be inherited. Please deactivate the inheritance.";
			throw new IllegalStateException(message);
		}
	}

	linkTargetTableToSource(targetModelPath, tableSource) {
		Table table = getChildFromRoot(targetModelPath);
		table.removeChildrenByInterface(TableSource.class);
		org.treez.data.tableSource.TableSource newTableSource = new org.treez.data.tableSource.TableSource(tableSource);
		table.addChild(newTableSource);
		table.refresh();
		return table;
	}


	writeDataToTargetTable(tableData, tableModelPath, appendData) {

		//get result table
		Table treezTable = getChildFromRoot(tableModelPath);

		//check if columns already exist and create them if not
		checkAndPrepareColumnsIfRequired(tableData, treezTable);

		//delete old table content if data should not be appended
		if (!appendData) {
			treezTable.deleteAllRows();
		}

		//write data rows to table
		for (List<Object> rowEntries : tableData.getRowData()) {
			treezTable.addRow(rowEntries);
		}

		return treezTable;

	}

	static checkAndPrepareColumnsIfRequired(tableData, treezTable) {
		List<String> headers = tableData.getHeaderData();
		boolean columnsExist = treezTable.hasColumns();
		if (columnsExist) {
			//check if existing columns fit to required columns1
			boolean columnNamesAreOk = treezTable.checkHeaders(headers);
			if (!columnNamesAreOk) {
				String message = "The result table already has columns but the column names are wrong.";
				throw new IllegalStateException(message);
			}
		} else {
			//create columns
			Columns columns;
			try {
				columns = treezTable.getColumns();
			} catch (IllegalStateException exception) {
				columns = treezTable.createColumns("columns");
			}

			for (String header : headers) {
				columns.createColumn(header, ColumnType.STRING);
			}
		}
	}


	extendContextMenuActions(actions, treeViewer) {
		// no actions available right now
		return actions;
	}

	 createCodeAdaption() {
		return new ComponentAtomCodeAdaption(this);
	}


	 set jobId(jobId) {
		super.setJobId(jobId);
		customJobIdField = jobId;

		Wrap<String> wrap = (Wrap<String>) customJobId;
		Attribute<String> attribute = wrap.getAttribute();

		if (attribute != null) {
			attribute.set(jobId);
		}

	}

	*/

}
