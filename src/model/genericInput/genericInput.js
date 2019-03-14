/**
 * Represents a generic input model that typically consists of several variable fields. The control for this 
 * configurable atom is created from its children (=the variables) that can be dynamically added by the user. 
 * The variables of this generic input atom can be used as dependency/input for other atoms, e.g.
 * for the InputFileGenerator.
 */
import Model from './../model.js';
import AddChildAtomTreeViewAction from './../../core/treeview/addChildAtomTreeViewAction.js';
import DoubleVariable from './../variable/field/doubleVariable.js';
import StringVariable from './../variable/field/stringVariable.js';

export default class GenericInput extends Model {

	constructor(name) {		
		super(name);
		this.image = 'genericInput.png';
		
		this.__section = undefined;
	}

	copy() {
		//TODO
	}
	
	createComponentControl(tabFolder){    
	     
		const page = tabFolder.append('treez-tab')
            .label('Data');

		this.__section = page.append('treez-section')
        .label('Variables');  		
		
		this.__recreateVariableControls();   
	     
	}
	
	__recreateVariableControls(){

		if(!this.__treeView){
			return;
		}

		var dTreez = this.__treeView.dTreez;
		
		this.__section.selectAll('div').remove();
		
		var sectionContent = this.__section.append('div'); 
		
		 this.children.forEach(
		    		(child)=>child.createVariableControl(sectionContent, dTreez)
		    );	
	}

	

	extendContextMenuActions(actions, parentSelection, treeView) {
		
		var self=this;

		//disable children
		const hasChildren = this.children && !this.children.length === 0;
		if (hasChildren) {
			actions.push(new TreeViewAction(
					"Disable all variable fields",
					"disable.png",
					treeView,
					() => self.disableAllVariableFields())
            );

			//enable children
			actions.push(new TreeViewAction(
					"Enable all variable fields",
					"enable.png",
					treeViewer,
					() => self.enableAllVariableFields())
            );
		}

		/*
		const addQuantityVariable = new AddChildAtomTreeViewAction(
				QuantityVariable,
				"quantityVariable",
				"quantityVariable.png",
				this,
				treeViewer);
		actions.push(addQuantityVariable);
     	 */
		
        const addDoubleVariable = new AddChildAtomTreeViewAction(
				DoubleVariable,
				"doubleVariable",
				"doubleVariable.png",
				parentSelection,
				this,
				treeView);
		actions.push(addDoubleVariable);
		
		/*

        const addIntegerVariableField = new AddColoredChildAtomTreeViewAction(
				IntegerVariableField.class,
				"integerVariable",
				"integerVariable.png",
				this,
				treeViewer);
		actions.push(addIntegerVariableField);

        const addBooleanVariableField = new AddColoredChildAtomTreeViewAction(
				BooleanVariableField.class,
				"booleanVariable",
				"booleanVariable.png",
				this,
				treeViewer);
		actions.push(addBooleanVariableField);
		
		*/

        const addStringVariable = new AddChildAtomTreeViewAction(
				StringVariable,
				"stringVariable",
				"stringVariable.png",
				parentSelection,
				this,
				treeView);
		actions.push(addStringVariable);
		
		/*

        const addStringItemVariableField = new AddColoredChildAtomTreeViewAction(
				StringItemVariableField.class,
				"stringItemVariable",
				"stringItemVariable.png",
				this,
				treeViewer);
		actions.push(addStringItemVariableField);

        const addFilePathVariableField = new AddColoredChildAtomTreeViewAction(
				FilePathVariableField.class,
				"filePathVariable",
				"filePathVariable.png",
				this,
				treeViewer);
		actions.push(addFilePathVariableField);

        const addDirectoryPathVariableField = new AddColoredChildAtomTreeViewAction(
				DirectoryPathVariableField.class,
				"directoryPathVariable",
				"directoryPathVariable.png",
				this,
				treeViewer);
		actions.push(addDirectoryPathVariableField);
		
		*/

		return actions;
	}


	enableAllVariables() {
		this.children.forEach(
				(child)=>{
					if (child instanceof Variable) {
						child.isEnabled = true;
					}
				}
		);		
	}

	disableAllVariables() {
		(child)=>{
			if (child instanceof Variable) {
				child.isEnabled = false;
			}
		}
	}

	getEnabledVariables(){
		var enabledVariables = [];
		this.children.forEach((child)=>{
			if(child.isEnabled){
				enabledVariables.push(child);
			}
		});
		return enabledVariables;
	}

	createCodeAdaption() {
		return new GenericInputCodeAdaption(this);
	}

	/**
	 * Overrides the method addChild to update the generic model after adding a variable child
	 */
	addChild(child) {
		super.addChild(child);
		this.__recreateVariableControls();
	}

	createDoubleVariable(name, value) {
		const child = new DoubleVariable(name);
		child.value = value;
        this.addChild(child);
		return child;
	}

	/*
	createIntegerVariabled(name) {
        const child = new IntegerVariable(name);
        this.addChild(child);
		return child;
	}

	createQuantityVariable(name) {
        const child = new QuantityVariable(name);
        this.addChild(child);
		return child;
	}
	
	*/

	createStringVariable(name, value) {
        const child = new StringVariable(name);
        child.value = value;
        this.addChild(child);
		return child;
	}

	/*
	createFilePathVariable(name) {
        const child = new FilePathVariable(name);
        this.addChild(child);
		return child;
	}

	createDirectoryPathVariable(name) {
        const child = new DirectoryPathVariable(name);
        this.addChild(child);
		return child;
	}

	createBooleanVariable(name) {
        const child = new BooleanVariable(name);
        this.addChild(child);
		return child;
	}

	createStringItemVariable(name) {
        const child = new StringItemVariable(name);
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
	
	*/

	
}
