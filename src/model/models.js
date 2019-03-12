import Model from "./model.js";
import AddChildAtomTreeViewAction from './../core/treeview/addChildAtomTreeViewAction.js';
import GenericInput from './genericInput/genericInput.js';
import Executable from './executable/executable.js';
import JavaExecutable from './executable/javaExecutable.js';

export default class Models extends Model {

	constructor(name) {
		if(!name){
			name='models';
		}
		super(name);
		this.isRunnable=true;
		this.image = "models.png";
	}

	copy() {
		//TODO
	}

	createComponentControl(tabFolder){    
	     
		const page = tabFolder.append('treez-tab')
            .label('Data');		

		const section = page.append('treez-section')
        	.label('Models');   

	    const sectionContent = section.append('div'); 	     

	    sectionContent.append('span')
			.text('This atom represents models.');
    }	

	extendContextMenuActions(actions, parentSelection, treeView) {

		
		actions.push(new AddChildAtomTreeViewAction(
				GenericInput,
				"genericInput",
				"genericInput.png",
				parentSelection,
				this,
				treeView));

       
		actions.push(new AddChildAtomTreeViewAction(
				Executable,
				"executable",
				"run.png",
				parentSelection,
				this,
				treeView));
       
		actions.push(new AddChildAtomTreeViewAction(
				JavaExecutable,
				"javaExecutable",
				"java.png",
				parentSelection,
				this,
				treeView));

		return actions;
	}

	createCodeAdaption() {
		return new RegionsAtomCodeAdaption(this);
	}

	createGenericInput(name) {
		return this.createChild(GenericInput, name);		
	}

	createExecutable(name) {
		return this.createChild(Executable, name);
	}

	createJavaExecutable(name) {
		return this.createChild(JavaExecutable, name);
	}

}
