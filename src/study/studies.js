import ComponentAtom from './../core/component/componentAtom.js';
import Monitor from './../core/monitor/monitor.js';
import AddChildAtomTreeViewAction from './../core/treeView/addChildAtomTreeViewAction.js';
import RegionsAtomCodeAdaption from './../core/code/regionsAtomCodeAdaption.js';
import Study from './study.js';
import Sweep from './sweep/sweep.js';
import Picking from './picking/picking.js';
import Sensitivity from './sensitivity/sensitivity.js';
//import Probability from './probability/probability.js';

export default class Studies extends ComponentAtom {

	constructor(name) {		
		super(name);
		this.isRunnable=true;
		this.image = 'studies.png';
	}


	createComponentControl(tabFolder){    
	     
		const page = tabFolder.append('treez-tab')
            .label('Data');		

		const section = page.append('treez-section')
        	.label('Studies'); 

		this.createHelpAction(section, 'study/studies.md');

        section.append('treez-section-action')
            .image('run.png')
            .label('Run studies')
            .addAction(()=>this.execute(this.__treeView)
            				   .catch(error => {
            					   	console.error('Could not execute  ' + this.constructor.name + ' "' + this.name + '"!', error);            					   
            				   })
            );  

	    const sectionContent = section.append('div'); 	     

	    sectionContent.append('span')
			.text('This atom represents studies.');
    }
	

	extendContextMenuActions(actions, parentSelection, treeView) {
		
		actions.push(
			new AddChildAtomTreeViewAction(
				Sweep,
				'sweep',
				'sweep.png',
				parentSelection,
				this,
				treeView
			)
		);
		
		
		actions.push(
			new AddChildAtomTreeViewAction(
        		Picking,
				'picking',
				'picking.png',
				parentSelection,
				this,
				treeView
			)
		);
       
		actions.push(
			new AddChildAtomTreeViewAction(
        		Sensitivity,
				'sensitivity',
				'sensitivity.png',
				parentSelection,
				this,
				treeView
			)
		);

		/*		
		
		actions.push(
			new AddChildAtomTreeViewAction(
				Probability,
				'probability',
				'probability.png',
				parentSelection,
				this,
				treeView
			)
		);
		
		*/

		return actions;
	}
	
	createCodeAdaption() {
		return new RegionsAtomCodeAdaption(this);
	}
	

	createSweep(name) {
		return this.createChild(Sweep, name);
	}
		
	createPicking(name) {
		return this.createChild(Picking, name);
	}
	
	createSensitivity(name) {
		return this.createChild(Sensitivity, name);
	}
	
	createPropability(name) {
		return this.createChild(Probability, name);
	}	

}
