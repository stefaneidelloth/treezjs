import Executable from "../executable/executable.js";
import ComponentAtom from "../../../core/component/componentAtom.js";

/**
 * The purpose of this atom is to generate an input text file that can be used as input for other atoms, e.g. the
 * Executable. It reads a template text file and replaces "tags"/"place holders" with Quantities. The filled template is
 * then saved as new input file at the wanted input file path.
 */
export default class InputFileGenerator extends ComponentAtom  {

	static get LOG(){
	    return new Log4js.getLogger(Executable.constructor.name);
    }

    static get NAME_TAG() {
        return '<name>';
    }

    static get LABEL_TAG() {
        return '<label>';
    }

    static get VALUE_TAG() {
        return '<value>';
    }

    static get UNIT_TAG() {
        return '<unit>';
    }

	constructor(name) {
		super(name);
		this.image = 'inputFile.png';
        this.inputFilePath = undefined;
        this.inputPathInfo = undefined;
        this.isDeletingUnassignedRows = undefined;
        this.isIncludingDateInInputFile = undefined;
        this.isIncludingDateInInputFolder = undefined;
        this.isIncludingDateInInputSubFolder = undefined;
        this.isIncludingjobIdInInputFile = undefined;
        this.isIncludingjobIdInInputFolder = undefined;
        this.isIncludingjobIdInInputSubFolder = undefined;
		this.isRunnable=true;
        this.nameExpression = undefined;
        this.sourceModel = undefined;
        this.templateFilePath = undefined;
        this.valueExpression = undefined;
	}

	 copy() {
		//TODO
	}

	/*

	createInputFileGeneratorModel() {

		AttributeRoot root = new AttributeRoot("root");
		Page dataPage = root.createPage("data", "   Data   ");

		String relativeHelpContextId = "inputFileGenerator";
		String helpContextId = Activator.getAbsoluteHelpContextIdStatic(relativeHelpContextId);

		Section data = dataPage.createSection("data", helpContextId);
		data.setLabel("");
		data.createSectionAction("action", "Generate input file", () -> execute(treeView));
		//template
		data.createFilePath(templateFilePath, this, "Template for input file (contains variable place holders)",
				"C:/template.txt");

		//variable source model
		String defaultValue = "root.models.genericModel";
		ModelPathSelectionType selectionType = ModelPathSelectionType.FLAT;
		ModelPath sourceModelPath = data.createModelPath(sourceModel, this, defaultValue, GenericInputModel.class,
				selectionType, this, false);
		sourceModelPath.setLabel("Variable source model (provides variables)");

		//label width
		final int prefferedLabelWidth = 180;

		//name expression
		TextField nameExpressionTextField = data.createTextField(nameExpression, this, "{$" + LABEL_TAG + "$}");
		nameExpressionTextField.setLabel("Style for variable place holder");
		nameExpressionTextField.setPrefferedLabelWidth(prefferedLabelWidth);

		//value & unit expression
		String defaultValueExpression = "" + VALUE_TAG + " [" + UNIT_TAG + "]";
		TextField valueExpressionTextField = data.createTextField(valueExpression, this, defaultValueExpression);
		valueExpressionTextField.setLabel("Style for value and unit injection");
		valueExpressionTextField.setPrefferedLabelWidth(prefferedLabelWidth);

		//path to input file (=the output of this atom)
		data.createFilePath(inputFilePath, this, "Input file to generate", "C:/generated_input_file.txt", false);

		//enable deletion of template rows with unassigned variable place holders
		checkBox deleteUnassigned = data.createCheckBox(deleteUnassignedRows, this, true);
		deleteUnassigned.setLabel("Delete template rows with unassigned variable place holders.");

		String inputModificationRelativeHelpContextId = "executableInputModification";
		String inputModificationHelpContextId = Activator
				.getAbsoluteHelpContextIdStatic(inputModificationRelativeHelpContextId);

		Consumer updateStatus = () -> refreshStatus();
		createInputModificationSection(dataPage, updateStatus, inputModificationHelpContextId);

		String statusRelativeHelpContextId = "statusLogging";
		String statusHelpContextId = Activator.getAbsoluteHelpContextIdStatic(statusRelativeHelpContextId);
		createStatusSection(dataPage, statusHelpContextId);

		refreshStatus();

		setModel(root);
	}

	createInputModificationSection(page) {

		Section inputModification = dataPage.createSection("inputModification", helpContextId);
		inputModification.setLabel("Input modification");
		inputModification.setExpanded(false);

		inputModification.createLabel("includeDate", "Include date in:");

		checkBox dateInFolderCheck = inputModification.createCheckBox(includeDateInInputFolder, this, false);
		dateInFolderCheck.setLabel("Folder name");
		dateInFolderCheck.addModificationConsumer("updateStatus", updateStatusListener);

		checkBox dateInSubFolderCheck = inputModification.createCheckBox(includeDateInInputSubFolder, this, false);
		dateInSubFolderCheck.setLabel("Extra folder");
		dateInSubFolderCheck.addModificationConsumer("updateStatus", updateStatusListener);

		checkBox dateInFileCheck = inputModification.createCheckBox(includeDateInInputFile, this, false);
		dateInFileCheck.setLabel("File name");
		dateInFileCheck.addModificationConsumer("updateStatus", updateStatusListener);

		@SuppressWarnings("unused")
		org.treez.core.atom.attribute.text.Label jobIdLabel = inputModification.createLabel("jobIdLabel",
				"Include job index in:");

		checkBox jobIdInFolderCheck = inputModification.createCheckBox(includejobIdInInputFolder, this, false);
		jobIdInFolderCheck.setLabel("Folder name");
		jobIdInFolderCheck.addModificationConsumer("updateStatus", updateStatusListener);

		checkBox jobIdInSubFolderCheck = inputModification.createCheckBox(includejobIdInInputSubFolder, this,
				false);
		jobIdInSubFolderCheck.setLabel("Extra folder");
		jobIdInSubFolderCheck.addModificationConsumer("updateStatus", updateStatusListener);

		checkBox jobIdInFileCheck = inputModification.createCheckBox(includejobIdInInputFile, this, false);
		jobIdInFileCheck.setLabel("File name");
		jobIdInFileCheck.addModificationConsumer("updateStatus", updateStatusListener);
	}

	createStatusSection(page) {
		Section status = dataPage.createSection("status", executableHelpContextId);
		status.setExpanded(false);

		//resulting command
		status.createInfoText(inputPathInfo, this, "Resulting input file path", "");

	}

	refreshStatus() {
		AbstractUiSynchronizingAtom.runUiTaskNonBlocking(() -> {

			String modifiedInputPath = getModifiedInputFilePath();
			inputPathInfo.set(modifiedInputPath);
		});
	}

	execute(refreshable) {

		LOG.info("Executing " + this.getClass().getSimpleName() + " '" + getName() + "'");

		String modifiedInputFilePath = getModifiedInputFilePath();

		//delete old input file (=the output of this atom) if it exists
		File inputFile = new File(modifiedInputFilePath);
		if (inputFile.exists()) {
			inputFile.delete();
		}

		//read template file
		String templateString = readTemplateFile(templateFilePath.get());

		//replace variable place holders with variable values
		GenericInputModel sourceModelAtom = getChildFromRoot(this.sourceModel.get());
		String inputFileString = applyTemplateToSourceModel(templateString, sourceModelAtom, nameExpression.get(),
				valueExpression.get(), deleteUnassignedRows.get());

		if (inputFileString.isEmpty()) {
			String message = "The input file '" + modifiedInputFilePath
					+ "' is empty. Please check the place holder and the source variables.";
			LOG.warn(message);
		}

		//save result as new input file
		saveResult(inputFileString, modifiedInputFilePath);

	}

	*/

	/**
	 * Applies the template to the variable model. This means that the variable place holders in the template string are
	 * replaced by the variable values for all variables that are provided by the variable source model.
	 */

    /*
	static applyTemplateToSourceModel(
			 templateString,
			 sourceModel,
			 nameExpression,
			 valueExpression,
			deleteUnassignedRows) {

		String resultString = templateString;

		List<VariableField<?, ?>> variableFields = sourceModel.getEnabledVariableFields();
		for (VariableField<?, ?> variableField : variableFields) {
			String variableName = variableField.getName();
			String variableLabel = variableField.getLabel();
			String valueString = variableField.getValueString(); //e.g. "1"

			String unitString = "";
			boolean isQuantityVariableField = variableField instanceof QuantityVariableField;
			if (isQuantityVariableField) {
				QuantityVariableField quantityField = (QuantityVariableField) variableField;
				unitString = quantityField.getUnitString(); //e.g. "m"
			}

			String placeholderExpression = createPlaceHolderExpression(nameExpression, variableName, variableLabel);

			String injectedExpression = createExpressionToInject(valueExpression, variableName, valueString,
					unitString);

			//inject expression into template
			LOG.info("Template placeholder to replace: '" + placeholderExpression + "'");
			LOG.info("Expression to inject: '" + injectedExpression + "'");
			resultString = resultString.replace(placeholderExpression, injectedExpression);

		}

		if (deleteUnassignedRows) {
			resultString = deleteRowsWithUnassignedPlaceHolders(nameExpression, resultString);
		}

		return resultString;
	}

	static createExpressionToInject(
			 valueExpression,
			 variableName,
			 valueString,
			 unitString) {

		String correctedValueString = valueString;
		if (valueString == null) {
			String message = "Value for variable '" + variableName + "' is null.";
			LOG.warn(message);
			correctedValueString = "null";
		}

		String injectedExpression;
		injectedExpression = valueExpression.replace(VALUE_TAG, correctedValueString);
		if (unitString != null) {
			injectedExpression = injectedExpression.replace(UNIT_TAG, unitString);
		} else {
			//remove unit tag
			injectedExpression = injectedExpression.replace(UNIT_TAG, "");
		}
		return injectedExpression;
	}

	 static createPlaceHolderExpression(nameExpression, variableName,  variableLabel) {
		String placeholderExpression;
		boolean containsName = nameExpression.contains(NAME_TAG);
		if (containsName) {
			placeholderExpression = nameExpression.replace(NAME_TAG, variableName);
		} else {
			boolean containsLabel = nameExpression.contains(LABEL_TAG);
			if (containsLabel) {
				placeholderExpression = nameExpression.replace(LABEL_TAG, variableLabel);
			} else {
				String message = "The placeholder must contain either a " + NAME_TAG + " or a " + LABEL_TAG + " tag.";
				throw new IllegalStateException(message);
			}
		}
		return placeholderExpression;
	}

	 static deleteRowsWithUnassignedPlaceHolders(nameExpression, resultString) {
		String generalPlaceHolderExpression = nameExpression.replace("{", "\\{");
		generalPlaceHolderExpression = generalPlaceHolderExpression.replace("}", "\\}");
		generalPlaceHolderExpression = generalPlaceHolderExpression.replace("$", "\\$");
		generalPlaceHolderExpression = generalPlaceHolderExpression.replace("<name>", ".*");
		generalPlaceHolderExpression = generalPlaceHolderExpression.replace("<label>", ".*");

		if (generalPlaceHolderExpression.equals(".*")) {
			String message = "The deletion of rows with unassigned place holders is not yet implemented for place holders"
					+ "of the type '" + nameExpression
					+ "'. Please adapt the name expression or disable the deletion of template rows"
					+ "with unassigned varaible place holders.";
			LOG.warn(message);
			return resultString;
		}

		String[] lines = resultString.split("\n");
		List<String> removedLines = new ArrayList<>();
		List<String> newLines = new ArrayList<>();

		Pattern pattern = Pattern.compile(generalPlaceHolderExpression);

		for (String line : lines) {
			Matcher matcher = pattern.matcher(line);
			boolean containsUnassignedPlaceHolder = matcher.find();
			if (containsUnassignedPlaceHolder) {
				removedLines.add(line);
			} else {
				newLines.add(line);
			}
		}
		String newResultString = String.join("\n", newLines);
		if (!removedLines.isEmpty()) {
			String message = "Some rows with unassigned variable place holders have been removed from the input file:\n"
					+ String.join("\n", removedLines);
			LOG.info(message);
		}
		return newResultString;
	}



	extendContextMenuActions(actions, treeViewer) {
		return actions;
	}

	createCodeAdaption() {
		return new ComponentAtomCodeAdaption(this);
	}


	static readTemplateFile(templatePath) {

		Path path = Paths.get(templatePath);
		Charset charSet = Charset.forName("UTF-8");
		byte[] encoded;
		try {
			encoded = Files.readAllBytes(path);
			String text = new String(encoded, charSet);
			return text;
		} catch (IOException exception) {
			String message = "Could not read file '" + templatePath + "'.";
			throw new IllegalStateException(message, exception);
		}
	}

	//Saves the given text as text file with the given file path

	static saveResult(text, filePath) {
		File file = new File(filePath);
		try {
			FileUtils.writeStringToFile(file, text);
		} catch (IOException exception) {
			String message = "Could not write text to file '" + filePath + "'.";
			throw new IllegalStateException(message, exception);
		}

	}

	getModifiedInputFilePath() {
		InputPathModifier inputPathModifier = new InputPathModifier(this);

		String modifiedInputPath = inputPathModifier.getModifiedInputPath(inputFilePath.get());
		return modifiedInputPath;
	}



	get jobId() {

		AbstractAtom<?> parent = this.getParentAtom();
		boolean parentIsExecutable = parent instanceof Executable;
		if (parentIsExecutable) {
			Executable executable = (Executable) parent;
			return executable.getJobId();
		}

		return "{unknownJobId}";
	}

	*/

}
