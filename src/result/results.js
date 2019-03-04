import ComponentAtom from './../core/component/componentAtom.js';
import AddChildAtomTreeViewAction from './../core/treeview/addChildAtomTreeViewAction.js';
import Data from './data/data.js';
import Page from './page/page.js'


export default class Results extends ComponentAtom {
   
	constructor(name) {
		if(!name){
			name='results';
		}
		super(name);
		this.image = 'results.png';
		this.isRunnable=true;		
	}

	
	createComponentControl(tabFolder, treeView){    
	     
		const page = tabFolder.append('treez-tab'); 
		
		const section = page.append('treez-section')
    	.label('Results');
	
		section.append('treez-text-label')
		.value('This atom represents results.');		
	}	
	
	extendContextMenuActions(actions, parentSelection, treeView) {	

		actions.push(new AddChildAtomTreeViewAction(
				Data,
				'data',
				'data.png',
				parentSelection,
				this,
				treeView));		

		actions.push(new AddChildAtomTreeViewAction(
				Page,
				'page',
				'page.png',
				parentSelection,
				this,
				treeView));		

		return actions;
	}

	execute(treeView) {
		this.__treeView = treeView;
		this.executeChildren(Data, treeView);
		this.executeChildren(Page, treeView);
	}
	
		
	createData(name) {
		return this.createChild(Data, name);		
	}

	createPage(name) {
		return this.createChild(Page, name);		
	}	

}
