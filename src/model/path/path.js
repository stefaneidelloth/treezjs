
import Model from './../model.js';
import TreeViewAction from './../../core/treeview/treeViewAction.js';
import AddChildAtomTreeViewAction from './../../core/treeview/addChildAtomTreeViewAction.js';
import ActionSeparator from './../../core/actionSeparator.js';
import Variable from './../../variable/variable.js';
import FilePathVariable from './../../variable/field/filePathVariable.js';
import DirectoryPathVariable from './../../variable/field/directoryPathVariable.js';
import PathCodeAdaption from './pathCodeAdaption.js';


export default class Path extends Model {

	constructor(name) {		
		super(name);
		this.image = 'path.png';		
		
		this.__section = undefined;
	}	
	
	createComponentControl(tabFolder){    
	     
		const page = tabFolder.append('treez-tab')
            .label('Data');

		this.__section = page.append('treez-section')
        .label('Paths');  		
		
		this.__recreatePathControls();   
	     
	}
	
	__recreatePathControls(){

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

		
		const hasChildren = this.children && (this.children.length > 0);
		if (hasChildren) {
						
			actions.push(
				new TreeViewAction(
					'Disable all paths',
					'disable.png',
					treeView,
					() => self.__disableAllVariables()
				)
            );
			
			actions.push(
				new TreeViewAction(
					'Enable all paths',
					'enable.png',
					treeView,
					() => self.__enableAllVariables()
				)
            );
		}
		
		actions.push(new ActionSeparator());				      		
		
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
		return new PathCodeAdaption(this);
	}
	
	addChild(child) {
		super.addChild(child);
		this.__recreatePathControls();
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

	get variables() {
        const variableFields = [];
		for (const child of this.children) {
		    if(child instanceof VariableField){
                variableFields.push(child);
            }
		}
		return variableFields;
	}
	
	get providesPathMap() {
		return true;
	}
	
	get pathMap(){		
		return this.enabledVariables;
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
	
}
