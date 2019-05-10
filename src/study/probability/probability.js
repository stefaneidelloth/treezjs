import Study from './../study.js';
import NormalAssumption from './normalAssumption.js';
import EqualAssumption from './equalAssumption.js';

export default class Probability extends Study {

	constructor(name) {
		super(name);
		this.image = 'probablity.png';
	}	

	createComponentControl(tabFolder){  
		super.createComponentControl(tabFolder);		
	}

	extendContextMenuActions(actions, parentSelection, treeView) {
		
		actions = super.extendContextMenuActions(actions, parentSelection, treeView);
			
		actions.push(
			new AddChildAtomTreeViewAction(
				NormalAssumption,
				'normal',
				'normalAssumption.png',
				parentSelection,
				this,
				treeView
			)
		);	
		
		actions.push(
				new AddChildAtomTreeViewAction(
					EqualAssumption,
					'equal',
					'equalAssumption.png',
					parentSelection,
					this,
					treeView
				)
			);		

		return actions;
	}

	async runStudy(treeView, monitor) {
		//not yet implemented

		executeExecutableChildren(refreshable);
	}

	createNormalAssumption(name) {
		return this.createChild(NormalAssumption, name);
	}
	
	createEqualAssumption(name) {
		return this.createChild(EqualAssumption, name);
	}

}