/**
 * Represents a generic model that typically consists of several variable fields. The control for this adjustable atom is
 * created from its children (=the variable fields) that can be dynamically added by the user. This model can not perform
 * actions by itself. The variable fields of this generic model can be used as dependency/input for other atoms, e.g.
 * the InputFileGenerator.
 */
import Model from "../model";


export default class GenericInputModel extends Model {

	constructor(name) {
		super(name);
		this.image = 'genericModel.png';
		this.isManualModel=true;
		this.parent = undefined;
	}

	copy() {
		//TODO
	}

	refresh() {
		super.refresh();
		if (this.parent) {
		    super.createControlAdaption(parent, this.treeView);
		}
	}

	createVueControl(parent) {
	    this.parent=parent;

		const page = parent.append('page')
			.attr('title','Data');

		const section = page.append('section')
			.attr('title','Data');

		// build variable fields from children
		for (var child of this.children) {
			child.createControlAdaption(section, this.treeView);
		}
	}

	extendContextMenuActions(actions, treeViewer) {

		//disable children
		const hasChildren = this.children && !this.children.isEmpty();
		if (hasChildren) {
			actions.push(new TreeViewerAction(
					"Disable all variable fields",
					"disable.png",
					treeViewer,
					() => disableAllVariableFields())
            );

			//enable children
			actions.push(new TreeViewerAction(
					"Enable all variable fields",
					"enable.png",
					treeViewer,
					() => enableAllVariableFields())
            );
		}

		const addQuantityVariableField = new AddColoredChildAtomTreeViewerAction(
				QuantityVariableField.class,
				"quantityVariable",
				"quantityVariable.png",
				this,
				treeViewer);
		actions.push(addQuantityVariableField);

        const addDoubleVariableField = new AddColoredChildAtomTreeViewerAction(
				DoubleVariableField.class,
				"doubleVariable",
				"doubleVariable.png",
				this,
				treeViewer);
		actions.push(addDoubleVariableField);

        const addIntegerVariableField = new AddColoredChildAtomTreeViewerAction(
				IntegerVariableField.class,
				"integerVariable",
				"integerVariable.png",
				this,
				treeViewer);
		actions.push(addIntegerVariableField);

        const addBooleanVariableField = new AddColoredChildAtomTreeViewerAction(
				BooleanVariableField.class,
				"booleanVariable",
				"booleanVariable.png",
				this,
				treeViewer);
		actions.push(addBooleanVariableField);

        const addStringVariableField = new AddColoredChildAtomTreeViewerAction(
				StringVariableField.class,
				"stringVariable",
				"stringVariable.png",
				this,
				treeViewer);
		actions.push(addStringVariableField);

        const addStringItemVariableField = new AddColoredChildAtomTreeViewerAction(
				StringItemVariableField.class,
				"stringItemVariable",
				"stringItemVariable.png",
				this,
				treeViewer);
		actions.push(addStringItemVariableField);

        const addFilePathVariableField = new AddColoredChildAtomTreeViewerAction(
				FilePathVariableField.class,
				"filePathVariable",
				"filePathVariable.png",
				this,
				treeViewer);
		actions.push(addFilePathVariableField);

        const addDirectoryPathVariableField = new AddColoredChildAtomTreeViewerAction(
				DirectoryPathVariableField.class,
				"directoryPathVariable",
				"directoryPathVariable.png",
				this,
				treeViewer);
		actions.push(addDirectoryPathVariableField);

		return actions;
	}


	enableAllVariableFields() {
		for (const child of children) {
			if (child instanceof VariableField) {
				child.setEnabled(true);
			}
		}
	}

	disableAllVariableFields() {
        for (const child of children) {
            if (child instanceof VariableField) {
                child.setEnabled(false);
            }
        }
	}

	createCodeAdaption() {
		return new GenericInputModelCodeAdaption(this);
	}

	/**
	 * Overrides the method addChild to update the generic model after adding the child
	 */
	addChild(child) {
		super.addChild(child);
		this.refresh();
	}

	createDoubleVariableField(name) {
		const child = new DoubleVariableField(name);
        this.addChild(child);
		return child;
	}

	createIntegerVariableField(name) {
        const child = new IntegerVariableField(name);
        this.addChild(child);
		return child;
	}

	createQuantityVariableField(name) {
        const child = new QuantityVariableField(name);
        this.addChild(child);
		return child;
	}

	createStringVariableField(name) {
        const child = new StringVariableField(name);
        this.addChild(child);
		return child;
	}

	createFilePathVariableField(name) {
        const child = new FilePathVariableField(name);
        this.addChild(child);
		return child;
	}

	createDirectoryPathVariableField(name) {
        const child = new DirectoryPathVariableField(name);
        this.addChild(child);
		return child;
	}

	createBooleanVariableField(name) {
        const child = new BooleanVariableField(name);
        this.addChild(child);
		return child;
	}

	createStringItemVariableField(name) {
        const child = new StringItemVariableField(name);
		this.addChild(child);
		return child;
	}



	getVariable(variableName) {
		return this.getAttribute("root.data.data." + variableName);
	}

	setVariable(variableName, valueString) {
		this.setAttribute("root.data.data." + variableName, valueString);
	}

	getVariableFields() {
        const variableFields = [];
		for (const child of this.children) {
		    if(child instanceof VariableField){
                variableFields.push(child);
            }
		}
		return variableFields;
	}

	getEnabledVariableFields() {
        const variableFields = [];
        for (const child of this.children) {
            if(child instanceof VariableField && child.isEnabled()){
                variableFields.push(child);
            }
        }
        return variableFields;
	}
}
