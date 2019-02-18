import AttributeContainerAtom from "../attributeContainerAtom.js";
import controlProvider from "../../attributeAtom.js";

export default class Section extends AttributeContainerAtom {

	constructor(name) {
		super(name);

		this.title = name[0].toUpperCase() + name.slice(1); 
		this.description="";
		this.isExpanded=true;
		this.isEnabled = true;
		this.isVisible = true;
	}

	copy() {
        const newAtom = new Section(this.name);
        newAtom.title = this.title;
		newAtom.description = this.description;
		newAtom.isExpanded = this.isExpanded;
		newAtom.isEnabled = this.isEnabled;
		newAtom.isVisible = this.isVisible;
	}

	provideImage() {
		return "Section.png";
	}

	createContextMenuActions(treeViewer) {
		return [];
	}
		
	createAtomControl(parent, treeViewerRefreshable) {

        const expander = parent //
            .append("details") //
            .style("margin-bottom", "10px");

        expander.append("style") //
                .text("summary::-webkit-details-marker { " //
                    + "   color: #194c7f "//
                    + "}");

        const expanderHeader = expander //
            .append("summary") //
            .style("background", "linear-gradient(#e0e8f1, white)")
            .style("outline", "none")
            .style("border-top-left-radius", "2px")
            .style("border-top-right-radius", "2px")
            .style("padding-left", "5px")
            .style("color", "#194c7f")
            .style("margin-bottom", "5px")
            .text(section.getTitle());

        const expanderBody = expander //
            .append("div");

        const isExpanded = section.isExpanded();
        if (isExpanded) {
                expander.attr("open", "open");
            } else {
                expander.attr("open", "false");
            }

            /*
             * sectionComposite.setDescription(section.getDescription());

            String absoluteHelpId = section.getAbsoluteHelpId();
            AbstractActivator.registerAbsoluteHelpId(absoluteHelpId, sectionComposite);

            createSectionToolbar(toolkit); //TODO
             */

            //setEnabled(section.isEnabled()); //TODO

            this.createSectionContent(expanderBody);

	}

    createSectionContent(sectionBody) {

        this.children.forEach((child)=>{

            const isAttributeAtom = child instanceof controlProvider;
            if (isAttributeAtom) {
                child.createAttributeAtomControl(sectionBody, this.treeViewerRefreshable);
                return;
            }

            const isAttributeContainerAtom = child instanceof AttributeContainerAtom;
            if (isAttributeContainerAtom) {
                child.createAtomControl(sectionBody, this.treeViewerRefreshable);
            } else {
                const message = "Could not create attribute atom. Type '" + child.prototype.name() + "' is not yet implemented.";
                throw new Error(message);
            }
        });
	}

	

	//#region SECTION

	/*

	addSection(treeViewer) {
        const name = Atom.createChildNameStartingWith(this, "mySection");
        this.createSection(name);
		this.expand(treeViewer);
	}

	createSection(name) {
        const section = new Section(name);
        this.addChild(section);
		return section;
	}

	//#end region

	//#region SECTION ACTION

	addSectionAction(treeViewer, description, runnable) {
        const name = Atom.createChildNameStartingWith(this, "mySectionAction");
        this.createSectionAction(name, description, runnable);
		this.expand(treeViewer);
	}
	
	createSectionAction(name, description, runnable, image) {
        const action = new SectionAction(name, description, runnable, image);
        this.addChild(action);
		return action;
	}

	//#end region

	//#region TEXT FIELD

	addTextField(treeViewer) {
        const name = Atom.createChildNameStartingWith(this, "myTextField");
        this.createTextField(name);
		this.expand(treeViewer);
	}

	createTextField(name) {
        const textField = new TextField(name);
        this.addChild(textField);
		return textField;
	}

	createTextFieldAndWrap(wrap, attributeParent, defaultValue) {
        const attributeName = this.getFieldName(wrap, attributeParent);
        const textField = new TextField(attributeName);
        textField.setDefaultValue(defaultValue);
		textField.set(defaultValue);
		this.addChild(textField);
		textField.wrap(wrap);
		return textField;
	}

	//#end region

	//#region LABEL

	createLabel(name, labelText) {
        const label = new Label(name);
        label.setLabel(labelText);
		this.addChild(label);
		return label;
	}

	//#end region

	//#region INFO TEXT

	createInfoText(name, defaultValue) {
        const infoText = new InfoText(name);
        infoText.setDefaultValue(defaultValue);
		infoText.set(defaultValue);
		addChild(infoText);
		return infoText;
	}

	createInfoTextAndWrap(wrap, attributeParent, label, defaultValue) {
        const attributeName = getFieldName(wrap, attributeParent);
        const infoText = this.createInfoText(attributeName, defaultValue);
        infoText.setLabel(label);
		infoText.wrap(wrap);
		return infoText;
	}

	

	//#end region

	//#region TEXT AREA

	createTextAreaAndWrap(wrap, attributeParent) {
        const attributeName = getFieldName(wrap, attributeParent);
        const textArea = new TextArea(attributeName);
        this.addChild(textArea);
		textArea.wrap(wrap);
		return textArea;
	}

	//#end region

	//#region CHECK BOX

	addCheckBox(treeViewer) {
        const name = Atom.createChildNameStartingWith(this, "myCheckBox");
        this.createCheckBox(name);
		this.expand(treeViewer);
	}

	createCheckBox(name) {
        const checkBox = new CheckBox(name);
        this.addChild(checkBox);
		return checkBox;
	}

	createCheckBoxAndWrap(wrap, attributeParent, defaultValue) {
        const checkBox = this.createCheckBox(wrap, attributeParent);
        checkBox.setDefaultValue(defaultValue);
		checkBox.set(defaultValue);
		return checkBox;
	}

	//#end region

	//#region COMBO BOX

	addComboBox(treeViewer) {
        const name = Atom.createChildNameStartingWith(this, "myComboBox");
        this.createComboBox(name);
		this.expand(treeViewer);
	}

	createComboBox(name) {
        const comboBox = new ComboBox(name);
        this.addChild(comboBox);
		return comboBox;
	}	

	createComboBoxAndWrap(wrap, attributeParent, items, defaultValue) {
        const attributeName = this.getFieldName(wrap, attributeParent);
        const comboBox = new ComboBox(attributeName);
        comboBox.setItems(items);
		comboBox.setDefaultValue(defaultValue);
		comboBox.setValue(defaultValue);
		this.addChild(comboBox);
		comboBox.wrap(wrap);
		return comboBox;
	}

	//#end region

	//#region COMBO BOX ENABLE TARGET

	createComboBoxEnableTarget(name, enableValues, targetPath) {
        const comboBoxEnableTarget = new ComboBoxEnableTarget(name, enableValues, targetPath);
        this.addChild(comboBoxEnableTarget);
		return comboBoxEnableTarget;
	}

	//#end region

	//#region ENUM COMBO BOX

	createEnumComboBoxAndWrap(wrap, attributeParent, defaultEnumValue) {
        const attributeName = this.getFieldName(wrap, attributeParent);
        const comboBox = new EnumComboBox(defaultEnumValue, attributeName);
        this.addChild(comboBox);
		comboBox.wrap(wrap);
		return comboBox;
	}

	//#end region

	//#region COLOR CHOOSER

	addColorChooser(treeViewer) {
        const name = Atom.createChildNameStartingWith(this, "myColor");
        this.createColorChooser(name);
		this.expand(treeViewer);
	}

	createColorChooser(name) {
        const colorChooser = new ColorChooser(name);
        this.addChild(colorChooser);
		return colorChooser;
	}	

	createColorChooserAndWrap(wrap, attributeParent, defaultValue) {
        const attributeName = this.getFieldName(wrap, attributeParent);
        const colorChooser = new ColorChooser(attributeName);
        colorChooser.setDefaultValue(defaultValue);
		this.addChild(colorChooser);
		colorChooser.wrap(wrap);				
		return colorChooser;
	}

	//#end region

	//#region COLOR MAP

	createColorMapAndWrap(wrap, attributeParent) {
        const attributeName = this.getFieldName(wrap, attributeParent);
        const colorMap = new ColorMap(attributeName);
        this.addChild(colorMap);
		colorMap.wrap(wrap);
		return colorMap;
	}

	//#end region

	//#region LINE STYLE

	createLineStyleAndWrap(wrap, attributeParent, defaultValue) {
        const attributeName = this.getFieldName(wrap, attributeParent);
        const lineStyle = new LineStyle(attributeName, defaultValue);
        this.addChild(lineStyle);
		lineStyle.wrap(wrap);
		return lineStyle;
	}	

	//#end region

	//#region FILL STYLE

	createFillStyleAndWrap(wrap, attributeParent, label) {
        const attributeName = this.getFieldName(wrap, attributeParent);
        const fillStyle = new FillStyle(attributeName, label);
        this.addChild(fillStyle);
		fillStyle.wrap(wrap);
		return fillStyle;
	}

	//#end region

	//#region ERROR BAR STYLE

	createErrorBarStyle(wrap, attributeParent, label) {
        const attributeName = this.getFieldName(wrap, attributeParent);
        const errorBarStyle = new ErrorBarStyle(attributeName);
        errorBarStyle.setLabel(label);
		addChild(errorBarStyle);
		errorBarStyle.wrap(wrap);
		return errorBarStyle;
	}

	//#end region

	//#region FONT

	createFont(wrap, attributeParent) {
        const attributeName = this.getFieldName(wrap, attributeParent);
        const font = new Font(attributeName, "Arial");
        this.addChild(font);
		font.wrap(wrap);
		return font;
	}

	//#end region

	//#region MODEL_PATH

	createModelPathForAtomType(wrap, attributeParent, defaultPath, atomType) {
        const attributeName = this.getFieldName(wrap, attributeParent);
        const selectionType = ModelPathSelectionType.FLAT;
        const modelPath = new ModelPath(attributeName, defaultPath, atomType, selectionType, null, false);
        this.addChild(modelPath);
		modelPath.wrap(wrap);
		return modelPath;
	}

	createModelPathForAtomTypes(wrap, attributeParent, defaultPath, atomTypes) {
        const attributeName = this.getFieldName(wrap, attributeParent);
        const selectionType = ModelPathSelectionType.FLAT;
        const modelPath = new ModelPath(
            attributeName,
            defaultPath,
            atomTypes,
            selectionType,
            attributeParent,
            false
        );
        this.addChild(modelPath);
		modelPath.wrap(wrap);
		return modelPath;
	}

	createModelPathWithParentPath(wrap, attributeParent, parentModelPath, atomType) {
        const attributeName = this.getFieldName(wrap, attributeParent);
        const modelPath = new ModelPath(attributeName, parentModelPath, atomType);
        this.addChild(modelPath);
		modelPath.wrap(wrap);
		return modelPath;
	}

	

	createModelPath(wrap, attributeParent, defaultPath, atomType, selectionType) {
        const attributeName = this.getFieldName(wrap, attributeParent);
        const modelPath = new ModelPath(
            attributeName,
            defaultPath,
            atomType,
            selectionType,
            attributeParent,
            false);
        this.addChild(modelPath);
		modelPath.wrap(wrap);
		return modelPath;
	}

	createModelPath(wrap, attributeParent, defaultPath, atomType, modelEntryAtom) {

        const attributeName = this.getFieldName(wrap, attributeParent);
        const selectionType = ModelPathSelectionType.FLAT;

        const modelPath = new ModelPath(attributeName, defaultPath, atomType, selectionType, modelEntryAtom, false);

        this.addChild(modelPath);
		modelPath.wrap(wrap);
		return modelPath;
	}

	createModelPath(
			wrap,
			attributeParent,
			defaultPath,
			atomType,
			selectionType,
			modelEntryPoint,
			hasToBeEnabled
	) {
        const attributeName = this.getFieldName(wrap, attributeParent);
        const modelPath = new ModelPath(
            attributeName,
            defaultPath,
            atomType,
            selectionType,
            modelEntryPoint,
            hasToBeEnabled);
        this.addChild(modelPath);
		modelPath.wrap(wrap);
		return modelPath;
	}

	createModelPath(
			wrap,
			attributeParent,
			defaultPath,
			atomType,
			modelEntryPoint,
			filterDelegate
	) {

        const attributeName = this.getFieldName(wrap, attributeParent);

        const modelPath = new ModelPath(
            attributeName,
            defaultPath,
            atomType,
            ModelPathSelectionType.FLAT,
            modelEntryPoint,
            filterDelegate);

        this.addChild(modelPath);
		modelPath.wrap(wrap);
		return modelPath;
	}

	//#end region

	//#region QUANTITY VARIABLE

	createQuantityVariableField(name) {
        const variableField = new QuantityVariableField(name);
        this.addChild(variableField);
		return variableField;
	}

	createQuantityVariableListField(name, label) {
        const variableListField = new QuantityVariableListField(name);
        variableListField.setLabel(label);
		this.addChild(variableListField);
		return variableListField;
	}	

	//#end region

	//#region DOUBLE VARIABLE

	createDoubleVariableFieldAndWrap(wrap, attributeParent, defaultValue) {
        const attributeName = this.getFieldName(wrap, attributeParent);
        const variableField = new DoubleVariableField(attributeName);
        variableField.setDefaultValue(defaultValue);
		variableField.set(defaultValue);
		variableField.wrap(wrap);
		this.addChild(variableField);
		return variableField;
	}

	createDoubleVariableListFieldAndWrap(wrap, attributeParent, label) {

        const attributeName = getFieldName(wrap, attributeParent);
        const variableListField = new DoubleVariableListField(attributeName);
        variableListField.setLabel(label);

		this.addChild(variableListField);
		variableListField.wrap(wrap);
		return variableListField;

	}

	createDoubleVariableListField(name, label) {
        const variableListField = new DoubleVariableListField(name);
        variableListField.setLabel(label);
		this.addChild(variableListField);
		return variableListField;
	}	

	//#end region

	//#region INTEGER VARIABLE

	createIntegerVariableField(wrap, attributeParent, defaultValue) {
        const attributeName = this.getFieldName(wrap, attributeParent);
        const variableField = new IntegerVariableField(attributeName);
        variableField.setDefaultValue(defaultValue);
		variableField.set(defaultValue);
		variableField.wrap(wrap);
		this.addChild(variableField);
		return variableField;
	}

	createIntegerVariableField(name) {
        const variableField = new IntegerVariableField(name);
        this.addChild(variableField);
		return variableField;
	}

	createIntegerListField(name) {
        const variableListField = new IntegerVariableListField(name);
        this.addChild(variableListField);
		return variableListField;
	}

	createIntegerVariableListField(name, label) {
        const variableListField = new IntegerVariableListField(name);
        variableListField.setLabel(label);
		this.addChild(variableListField);
		return variableListField;
	}

	createIntegerVariableListField(wrap, attributeParent, label) {
        const attributeName = this.getFieldName(wrap, attributeParent);
        const variableListField = new IntegerVariableListField(attributeName);
        variableListField.setLabel(label);

		this.addChild(variableListField);
		variableListField.wrap(wrap);
		return variableListField;

	}

	//#end region

	//#region VARIABLE LIST

	createVariableList(wrap, attributeParent, label) {
        const attributeName = this.getFieldName(wrap, attributeParent);
        const variableList = new VariableList(attributeName, null);
        variableList.setLabel(label);
		this.addChild(variableList);
		variableList.wrap(wrap);
		return variableList;
	}

	createVariableListWithInfo(wrap, attributeParent, label) {
        const attributeName = getFieldName(wrap, attributeParent);
        const variableList = new VariableListWithInfo(attributeName, null);
        variableList.setLabel(label);
		this.addChild(variableList);
		variableList.wrap(wrap);
		return variableList;
	}

	//#end region

	//#region FILE PATH

	createFilePath(wrap, attributeParent, defaultPath) {
        const attributeName = this.getFieldName(wrap, attributeParent);
        const filePath = new FilePath(attributeName);
        filePath.setDefaultValue(defaultPath);
		this.addChild(filePath);
		filePath.wrap(wrap);
		return filePath;
	}

	createFilePath(wrap, attributeParent, label, defaultPath) {
        const filePath = this.createFilePath(wrap, attributeParent, defaultPath);
        filePath.setLabel(label);
		return filePath;
	}

	createFilePath(wrap, attributeParent, label, defaultPath, validatePath) {
        const filePath = this.createFilePath(wrap, attributeParent, defaultPath);
        filePath.setLabel(label);
		filePath.setValidatePath(validatePath);
		return filePath;
	}

	//#end region

	//#region FILE PATH LIST

	addFilePathList(treeViewer) {
        const name = Atom.createChildNameStartingWith(this, "myFilePathList");
        this.createFilePathList(name);
		this.expand(treeViewer);
	}

	createFilePathList(name) {
        const filePathList = new FilePathList(name);
        this.addChild(filePathList);
		return filePathList;
	}

	//#end region

	//#region DIRECTORY PATH

	createDirectoryPath(
			wrap,
			attributeParent,
			label,
			defaultPath
	) {
        const directoryPath = this.createDirectoryPath(wrap, attributeParent, defaultPath);
        directoryPath.setLabel(label);
		return directoryPath;
	}

	createDirectoryPath(wrap, attributeParent, defaultPath) {
        const attributeName = this.getFieldName(wrap, attributeParent);
        const directoryPath = this.createDirectoryPath(attributeName);
        directoryPath.setDefaultValue(defaultPath);
		directoryPath.wrap(wrap);
		return directoryPath;
	}

	addDirectoryPath(treeViewer) {
		const name = Atom.createChildNameStartingWith(this, "myDirectoryPath");
		this.createDirectoryPath(name);
		this.expand(treeViewer);
	}

	createDirectoryPath(name) {
        const directoryPath = new DirectoryPath(name);
        this.addChild(directoryPath);
		return directoryPath;
	}

	//#end region

	//#region FILE OR DIRECTORY PATH

	createFileOrDirectoryPath(wrap, attributeParent, defaultPath) {
        const attributeName = getFieldName(wrap, attributeParent);
        const fileOrDirectoryPath = new FileOrDirectoryPath(attributeName);
        fileOrDirectoryPath.setDefaultValue(defaultPath);
		this.addChild(fileOrDirectoryPath);
		fileOrDirectoryPath.wrap(wrap);
		return fileOrDirectoryPath;
	}

	createFileOrDirectoryPath(
			wrap,
			attributeParent,
			label,
			defaultPath
	) {
        const fileOrDirectoryPath = this.createFileOrDirectoryPath(wrap, attributeParent, defaultPath);
        fileOrDirectoryPath.setLabel(label);
		return fileOrDirectoryPath;
	}

	createFileOrDirectoryPath(
			wrap,
			attributeParent,
			label,
			defaultPath,
			validatePath
	) {
        const fileOrDirectoryPath = this.createFileOrDirectoryPath(wrap, attributeParent, defaultPath);
        fileOrDirectoryPath.setLabel(label);
		fileOrDirectoryPath.setValidatePath(validatePath);
		return fileOrDirectoryPath;
	}

	//#end region

	//#region DIRECTORY PATH LIST

	addDirectoryPathList(treeViewer) {
        const name = Atom.createChildNameStartingWith(this, "myDirectoryPathList");
        this.createDirectoryPathList(name);
		this.createTreeNodeAdaption().expand(treeViewer);
	}

	createDirectoryPathList(name) {
        const directoryPathList = new DirectoryPathList(name);
        this.addChild(directoryPathList);
		return directoryPathList;
	}

	//#end region

	//#region SPACER

	addSpacer(treeViewer) {
        const name = Atom.createChildNameStartingWith(this, "mySpacer");
        this.createSpacer(name);
		this.expand(treeViewer);
	}

	createSpacer(name) {
        const spacer = new Spacer(name);
        this.addChild(spacer);
		return spacer;
	}

	//#end region

	//#region SYMBOL TYPE

	createSymbolType(
			wrap,
			attributeParent,
			label,
			defaultValue
	) {
        const attributeName = this.getFieldName(wrap, attributeParent);
        const symbolType = new SymbolType(attributeName, label, defaultValue);
        this.addChild(symbolType);
		symbolType.wrap(wrap);
		return symbolType;
	}

	//#end region

	//#region SIZE

	createSize(wrap, attributeParent) {
        const attributeName = this.getFieldName(wrap, attributeParent);
        const size = new Size(attributeName);
        this.addChild(size);
		size.wrap(wrap);
		return size;
	}

	createSize(wrap, attributeParent, defaultValue) {
        const attributeName = this.getFieldName(wrap, attributeParent);
        const size = new Size(attributeName);
        size.setDefaultValue(defaultValue);
		this.addChild(size);
		size.wrap(wrap);
		return size;
	}

	createSize(wrap, attributeParent, label, defaultValue) {
        const attributeName = this.getFieldName(wrap, attributeParent);
        const size = new Size(attributeName);
        size.setDefaultValue(defaultValue);
		size.setLabel(label);
		this.addChild(size);
		size.wrap(wrap);
		return size;
	}

	//#end region

	//#region FUNCTION PLOTTER

	createFunctionPlotter(wrap, attributeParent) {
        const attributeName = this.getFieldName(wrap, attributeParent);
        const plotter = new FunctionPlotter(attributeName);
        this.addChild(plotter);
		plotter.wrap(wrap);
		return plotter;
	}

	//#end region

	*/

	//#end region

	//#region ACCESSORS	

	setEnabled(enable) {
		this.isEnabled = enable;
		if (controlProvider != null) {
			controlProvider.setEnabled(enable);
		}
		return getThis();
	}

	setVisible(visible) {
		this.isVisible = visible;
		if (controlProvider != null) {
			controlProvider.setVisible(visible);
		}
		return getThis();
	}

	//#end region

}
