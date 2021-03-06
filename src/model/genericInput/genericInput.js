/**
 * Represents a generic input model that typically consists of several variable fields. The control for this 
 * configurable atom is created from its children (=the variables) that can be dynamically added by the user. 
 * The variables of this generic input atom can be used as dependency/input for other atoms, e.g.
 * for the InputFileGenerator.
 */
import Model from './../model.js';
import TreeViewAction from './../../core/treeView/treeViewAction.js';
import AddChildAtomTreeViewAction from './../../core/treeView/addChildAtomTreeViewAction.js';
import ActionSeparator from './../../core/actionSeparator.js';
import Variable from './../../variable/variable.js';
import DoubleVariable from './../../variable/field/doubleVariable.js';
import IntegerVariable from './../../variable/field/integerVariable.js';
import QuantityVariable from './../../variable/field/quantityVariable.js';
import BooleanVariable from './../../variable/field/booleanVariable.js';
import FilePathVariable from './../../variable/field/filePathVariable.js';
import DirectoryPathVariable from './../../variable/field/directoryPathVariable.js';
import StringVariable from './../../variable/field/stringVariable.js';
import StringItemVariable from './../../variable/field/stringItemVariable.js';
import AbstractPathVariable from './../../variable/field/abstractPathVariable.js';
import GenericInputCodeAdaption from './genericInputCodeAdaption.js';
import Path from './../path/path.js';


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

        this.createHelpAction(this.__section, 'model/genericInput/genericInput.md');
        		
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
			 (child)=>{
				 if(child.isEnabled){
					 child.createVariableControl(sectionContent, dTreez);
				 }
			 }			    		
		);	
	}

	extendContextMenuActions(actions, parentSelection, treeView) {
		
		var self=this;

		//disable children
		const hasChildren = this.children && (this.children.length > 0);
		if (hasChildren) {
			actions.push(
				new TreeViewAction(
					'Disable all variables',
					'disable.png',
					this,
					treeView,
					() => self.__disableAllVariables()
				)
            );

			//enable children
			actions.push(
				new TreeViewAction(
					'Enable all variables',
					'enable.png',
					this,
					treeView,
					() => self.__enableAllVariables()
				)
            );
		}
		
		actions.push(new ActionSeparator());
				       
		actions.push(
			new AddChildAtomTreeViewAction(
				DoubleVariable,
				'doubleVariable',
				'doubleVariable.png',
				parentSelection,
				this,
				treeView
			)
		);
		       
		actions.push(
			new AddChildAtomTreeViewAction(
				IntegerVariable,
				'integerVariable',
				'integerVariable.png',
				parentSelection,
				this,
				treeView
			)
		);
		
		actions.push(
			new AddChildAtomTreeViewAction(
				QuantityVariable,
				'quantityVariable',
				'quantityVariable.png',
				parentSelection,
				this,
				treeView
			)
		);
       
		actions.push(
			new AddChildAtomTreeViewAction(
				BooleanVariable,
				'booleanVariable',
				'booleanVariable.png',
				parentSelection,
				this,
				treeView
			)
		);
       
		actions.push(
			new AddChildAtomTreeViewAction(
				StringVariable,
				'stringVariable',
				'stringVariable.png',
				parentSelection,
				this,
				treeView
			)
		);			
	      
		actions.push(
			new AddChildAtomTreeViewAction(
				StringItemVariable,
				'stringItemVariable',
				'stringItemVariable.png',
				parentSelection,
				this,
				treeView
			)
		); 		
		
		actions.push(
			new AddChildAtomTreeViewAction(
				FilePathVariable,
				'filePathVariable',
				'filePathVariable.png',
				parentSelection,
				this,
				treeView,
				(filePathVariable) => {
					filePathVariable.pathMapProvider=this;
				}
			)
		);		
		
		actions.push(
			new AddChildAtomTreeViewAction(
				DirectoryPathVariable,
				'directoryPathVariable',
				'directoryPathVariable.png',
				parentSelection,
				this,
				treeView,
				(directoryPathVariable) => {
					directoryPathVariable.pathMapProvider=this;
				}
			)
		);
		
		

		return actions;
	}

	__enableAllVariables() {
		this.children.forEach(
				(child)=>{
					if (child instanceof Variable) {
						child.enable();
					}
				}
		);		
	}

	__disableAllVariables() {
		this.children.forEach(
			(child)=>{
				if (child instanceof Variable) {
					child.disable();
				}
			}
		);
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
		var filePathVariable = this.createChild(FilePathVariable, name, value); 
		filePathVariable.pathMapProvider = this;
		return filePathVariable;
	}

	createDirectoryPathVariable(name, value) {
		var directoryPathVariable = this.createChild(DirectoryPathVariable, name, value); 
		directoryPathVariable.pathMapProvider = this;
		return directoryPathVariable;
	}	

	createBooleanVariable(name, value) {
		return this.createChild(BooleanVariable, name, value);  
	}

	createStringItemVariable(name, value) {
		return this.createChild(StringItemVariable, name, value); 
	}	

	get variables() {
        const variableFields = [];
		for (const child of this.children) {
		    if(child instanceof Variable){
                variableFields.push(child);
            }
		}
		return variableFields;
	}

	get enabledVariables(){
		var enabledVariables = [];
		this.children.forEach((child)=>{
			if(child instanceof Variable){
				if(child.isEnabled){
					enabledVariables.push(child);
				}
			}
		});
		return enabledVariables;
	}
	
	get providesPathMap() {
		return true;
	}
	
}
