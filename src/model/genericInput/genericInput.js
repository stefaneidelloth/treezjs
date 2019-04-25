/**
 * Represents a generic input model that typically consists of several variable fields. The control for this 
 * configurable atom is created from its children (=the variables) that can be dynamically added by the user. 
 * The variables of this generic input atom can be used as dependency/input for other atoms, e.g.
 * for the InputFileGenerator.
 */
import Model from './../model.js';
import AddChildAtomTreeViewAction from './../../core/treeview/addChildAtomTreeViewAction.js';
import DoubleVariable from './../variable/field/doubleVariable.js';
import IntegerVariable from './../variable/field/integerVariable.js';
import FilePathVariable from './../variable/field/filePathVariable.js';
import DirectoryPathVariable from './../variable/field/directoryPathVariable.js';
import StringVariable from './../variable/field/stringVariable.js';
import GenericInputCodeAdaption from './genericInputCodeAdaption.js';

export default class GenericInput extends Model {

	constructor(name) {		
		super(name);
		this.image = 'genericInput.png';
		
		this.__section = undefined;
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
		
       
		actions.push(new AddChildAtomTreeViewAction(
				DoubleVariable,
				"doubleVariable",
				"doubleVariable.png",
				parentSelection,
				this,
				treeView));
		
		/*

        const addIntegerVariableField = new AddChildAtomTreeViewAction(
				IntegerVariable,
				"integerVariable",
				"integerVariable.png",
				this,
				treeViewer);
		actions.push(addIntegerVariableField);

        const addBooleanVariableField = new AddChildAtomTreeViewAction(
				BooleanVariable,
				"booleanVariable",
				"booleanVariable.png",
				this,
				treeViewer);
		actions.push(addBooleanVariableField);
		
		*/

       
		actions.push(new AddChildAtomTreeViewAction(
				StringVariable,
				"stringVariable",
				"stringVariable.png",
				parentSelection,
				this,
				treeView));
		
		
		actions.push(new AddChildAtomTreeViewAction(
				FilePathVariable,
				"filePathVariable",
				"filePathVariable.png",
				parentSelection,
				this,
				treeView));
		
		
		actions.push(new AddChildAtomTreeViewAction(
				DirectoryPathVariable,
				"directoryPathVariable",
				"directoryPathVariable.png",
				parentSelection,
				this,
				treeView));
		
		/*

        const addStringItemVariableField = new AddChildAtomTreeViewAction(
				StringItemVariable,
				"stringItemVariable",
				"stringItemVariable.png",
				this,
				treeViewer);
		actions.push(addStringItemVariableField);

       

       
		
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
		return this.createChild(DoubleVariable, name, value); 		
	}

	
	createIntegerVariable(name, value) {
		return this.createChild(IntegerVariable, name, value);	
	}

	createQuantityVariable(name, value) {
		return this.createChild(QuantityVariable, name, value);	
	}       

	createStringVariable(name, value) {		
        return this.createChild(StringVariable, name, value);       
	}

	
	createFilePathVariable(name, value) {
		return this.createChild(FilePathVariable, name, value); 
	}

	createDirectoryPathVariable(name, value) {
		return this.createChild(DirectoryPathVariable, name, value);        
	}

	createBooleanVariable(name, value) {
		return this.createChild(BooleanVariable, name, value);  
	}

	createStringItemVariable(name, value) {
		return this.createChild(StringItemVariable, name, value); 
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
