import ComponentAtom from './../core/component/componentAtom.js';
import Models from './../model/models.js';
import AddChildAtomTreeViewerAction from './../core/treeview/addChildAtomTreeViewerAction.js';

export default class Root extends ComponentAtom {	
   

	constructor(name) {
		if(!name){
			name='root';
		}
		super(name);
		this.image = 'root.png';
	}

	copy(atomToCopy){ //TODO

    }
	
	createComponentControl(tabFolder, dTreez){    
	     
		const page = tabFolder.append('treez-tab')
        .label('Data');		

		const section = page.append('treez-section')
		.label('Root');   

		const sectionContent = section.append('div'); 	     

		sectionContent.append('span')
			.text('This is the root atom.');
	}
	
	extendContextMenuActions(actions, parentSelection, treeView) {
		
		this.treeView=treeView;

		const addModels = new AddChildAtomTreeViewerAction(
				Models,
				"models",
				"models.png",
				parentSelection,
				this,
				treeView);
		actions.push(addModels);
		
		/*
		
		const addStudies = new AddChildAtomTreeViewerAction(
				Studies,
				"studies",
				"studies.png",
				parentSelection,
				this,
				treeView);
		actions.push(addStudies);
		
		const addResults = new AddChildAtomTreeViewerAction(
				Results,
				"results",
				"results.png",
				parentSelection,
				this,
				treeView);
		actions.push(addResults);
		
		*/
		
		return actions;
	}
	
	createModels(name){
		const models = new Models(name);
		this.addChild(models);
		return models;
	}

	
}
