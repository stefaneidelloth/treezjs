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

	createComponentControl(tabFolder, treeView){    
	     
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
			var monitorTitle = this.constructor.name + ' ' + this.name;
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

		const addSweep = new AddChildAtomTreeViewAction(
				Sweep,
				"sweep",
				"sweep.png",
				parentSelection,
				this,
				treeView);
		actions.push(addSweep);
		
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
		var child = new Sweep(name);
		this.addChild(child);
		return child;
	}
	
	/*
	
	createPicking(name) {
		var child = new Picking(name);
		thisaddChild(child);
		return child;
	}
	
	createSensitivity(name) {
		var child = new Sensitivity(name);
		thisaddChild(child);
		return child;
	}
	
	createPropability(name) {
		var child = new Probability(name);
		thisaddChild(child);
		return child;
	}
	
	*/

}
