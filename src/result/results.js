import ComponentAtom from './../core/component/componentAtom.js';
import Monitor from './../core/monitor/monitor.js';
import AddChildAtomTreeViewAction from './../core/treeview/addChildAtomTreeViewAction.js';
import Data from './data/data.js';
import Page from './page/page.js'

export default class Results extends ComponentAtom {
   
	constructor(name) {		
		super(name);
		this.image = 'results.png';
		this.isRunnable=true;		
	}

	
	createComponentControl(tabFolder){    
	     
		const page = tabFolder.append('treez-tab'); 
		
		const section = page.append('treez-section')
    		.label('Results');

    	section.append('treez-section-action')
            .image('run.png')
            .label('Run results')
            .addAction(()=>this.execute(this.__treeView)
            				   .catch(error => {
            					   	console.error('Could not execute  ' + this.constructor.name + ' "' + this.name + '"!', error);            					   
            				   })
            );
	
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
		
	createData(name) {
		return this.createChild(Data, name);		
	}

	createPage(name) {
		return this.createChild(Page, name);		
	}	

}
