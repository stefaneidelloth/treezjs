import ComponentAtom from "./../core/component/componentAtom.js";
import AddChildAtomTreeViewAction from './../core/treeview/addChildAtomTreeViewAction.js';
import Study from './study.js';
import Sweep from './sweep/sweep.js';
//import Picking from './picking/picking.js';
//import Sensitivity from './sensitivity/sensitivity.js';
//import Probability from './probability/probability.js';

export default class Studies extends ComponentAtom {

	constructor(name) {
		if(!name){
			name='studies';
		}
		super(name);
		this.isRunnable=true;
		this.image = "studies.png";
	}

	copy() {
		//TODO
	}

	createComponentControl(tabFolder){    
	     
		const page = tabFolder.append('treez-tab')
            .label('Data');		

		const section = page.append('treez-section')
        	.label('Studies');   

	    const sectionContent = section.append('div'); 	     

	    sectionContent.append('span')
			.text('This atom represents studies.');
    }
	
	async execute(treeView, monitor){
		if(!monitor){
			var monitorTitle = this.constructor.name + ' "' + this.name + '"';
			monitor = new Monitor(monitorTitle, treeView);
			monitor.showInMonitorView();
		}
		
		for(const child of this.children){
			var isStudy = child instanceof Study;
			if (isStudy) {
				var subMonitor = monitor.createChild();
				await child.execute(treeView, subMonitor);				
			}
		}
		
		monitor.done();
	}

	extendContextMenuActions(actions, parentSelection, treeView) {
		
		actions.push(new AddChildAtomTreeViewAction(
				Sweep,
				"sweep",
				"sweep.png",
				parentSelection,
				this,
				treeView));
		
		/*

        const addPicking = new AddChildAtomTreeViewAction(
        		Picking,
				"picking",
				"picking.png",
				parentSelection,
				this,
				treeView);
		actions.push(addPicking);

        const addSensitivity = new AddChildAtomTreeViewAction(
        		Sensitivity,
				"sensitivity",
				"sensitivity.png",
				parentSelection,
				this,
				treeView);
		actions.push(addSensitivity);
		
		const addProbability = new AddChildAtomTreeViewAction(
				Probability,
				"probability",
				"probability.png",
				parentSelection,
				this,
				treeView);
		actions.push(addProbability);
		
		*/

		return actions;
	}
	

	createSweep(name) {
		return this.createChild(Sweep, name);
	}
	
	/*
	
	createPicking(name) {
		return this.createChild(Picking, name);
	}
	
	createSensitivity(name) {
		return this.createChild(Sensitivity, name);
	}
	
	createPropability(name) {
		return this.createChild(Probability, name);
	}
	
	*/

}
