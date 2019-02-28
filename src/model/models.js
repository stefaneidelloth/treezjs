import Model from "./model.js";
import AddChildAtomTreeViewerAction from './../core/treeview/addChildAtomTreeViewerAction.js';
import GenericInput from './genericInput/genericInput.js';
import Executable from './executable/executable.js';
import JarExecutable from './executable/jarExecutable.js';

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

	createComponentControl(tabFolder, treeView){    
	     
		const page = tabFolder.append('treez-tab')
            .label('Data');		

		const section = page.append('treez-section')
        	.label('Models');   

	    const sectionContent = section.append('div'); 	     

	    sectionContent.append('span')
			.text('This atom represents models.');
    }

	extendContextMenuActions(actions, parentSelection, treeView) {

		const addGenericInput = new AddChildAtomTreeViewerAction(
				GenericInput,
				"genericInput",
				"genericInput.png",
				parentSelection,
				this,
				treeView);
		actions.push(addGenericInput);

        const addExecutable = new AddChildAtomTreeViewerAction(
				Executable,
				"executable",
				"run.png",
				parentSelection,
				this,
				treeView);
		actions.push(addExecutable);

        const addJarExecutable = new AddChildAtomTreeViewerAction(
				JarExecutable,
				"jarExecutable",
				"java.png",
				parentSelection,
				this,
				treeView);
		actions.push(addJarExecutable);

		return actions;
	}

	createCodeAdaption() {
		return new RegionsAtomCodeAdaption(this);
	}

	createGenericInput(name) {
		const child = new GenericInput(name);
		this.addChild(child);
		return child;
	}

	createExecutable(name) {
		const child = new Executable(name);
		this.addChild(child);
		return child;
	}

	createJarExecutable(name) {
		const child = new JarExecutable(name);
		this.addChild(child);
		return child;
	}

}
