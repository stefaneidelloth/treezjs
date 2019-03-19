import ComponentAtom from './../core/component/componentAtom.js';
import Models from './../model/models.js';
import Studies from './../study/studies.js';
import Results from './../result/results.js';
import AddChildAtomTreeViewAction from './../core/treeview/addChildAtomTreeViewAction.js';

export default class Root extends ComponentAtom {	
   

	constructor(name) {		
		super(name);
		this.image = 'root.png';
	}

		
	createComponentControl(tabFolder){    
	     
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

		const addModels = new AddChildAtomTreeViewAction(
				Models,
				"models",
				"models.png",
				parentSelection,
				this,
				treeView);
		actions.push(addModels);
		
		
		
		const addStudies = new AddChildAtomTreeViewAction(
				Studies,
				"studies",
				"studies.png",
				parentSelection,
				this,
				treeView);
		actions.push(addStudies);
		
				
		const addResults = new AddChildAtomTreeViewAction(
				Results,
				"results",
				"results.png",
				parentSelection,
				this,
				treeView);
		actions.push(addResults);
		
		
		
		return actions;
	}
	
	createModels(name){
		return this.createChild(Models, name);		
	}
	
	createStudies(name){
		return this.createChild(Studies, name);		
	}
	
	createResults(name){
		return this.createChild(Results, name);		
	}
	
	

	
}
