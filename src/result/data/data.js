import ComponentAtom from './../../core/component/componentAtom.js';
import AddChildAtomTreeViewAction from './../../core/treeView/addChildAtomTreeViewAction.js';
import Table from './../../data/table/table.js';
import SweepProbe from './../probe/sweepProbe.js';
import PickingProbe from './../probe/pickingProbe.js';
import SensitivityProbe from './../probe/sensitivityProbe.js';
import SweepOutput from './../../study/sweep/sweepOutput.js';

export default class Data extends ComponentAtom {
   
	constructor(name) {		
		super(name);
		this.image = 'data.png';
		this.isRunnable=true;		
	}
	
	createComponentControl(tabFolder){    
	     
		const page = tabFolder.append('treez-tab')
			.label('Data'); 
		
		const section = page.append('treez-section')
    		.label('Data');

    	section.append('treez-section-action')
            .image('run.png')
            .label('Run executable children')
            .addAction(()=>this.execute(this.__treeView)
            				   .catch(error => {
            					   	console.error('Could not execute  ' + this.constructor.name + ' "' + this.name + '"!', error);            					   
            				   })
        );
	
		section.append('treez-text-label')
			.value('This atom represents data.');		
	}	

	extendContextMenuActions(actions, parentSelection, treeView) {
		
		actions.push(
			new AddChildAtomTreeViewAction(
				Table,
				'table',
				'table.png',
				parentSelection,
				this,
				treeView
			)
		);
		
		actions.push(
			new AddChildAtomTreeViewAction(
				SweepProbe,
				'sweepProbe',
				'sweepProbe.png',
				parentSelection,
				this,				
				treeView
			)
		);		
		
		actions.push( 
			new AddChildAtomTreeViewAction(
				PickingProbe,
				'pickingProbe',
				'pickingProbe.png',
				parentSelection,
				this,				
				treeView
			)
		);
		
		actions.push( 
			new AddChildAtomTreeViewAction(
				SensitivityProbe,
				'sensitvityProbe',
				'sensitivityProbe.png',
				parentSelection,
				this,
				treeView
			)
		);
		
		/*
		
		actions.push( 
			new AddChildAtomTreeViewAction(
				ProbabilityProbe,
				'probabilityProbe',
				'probability.png',
				parentSelection,
				this,				
				treeView
			)
		);		
		
		*/
		
		return actions;
		

	}	

	createTable(name) {
		return this.createChild(Table, name);		
	}	

	createSweepOutput(name) {
		return this.createChild(SweepOutput, name);		
	}
	
	createSweepProbe(name) {
		return this.createChild(SweepProbe, name);		
	}
	
	createPickingProbe(name) {
		return this.createChild(PickingProbe, name);		
	}
	
	createSensitivityProbe(name) {
		return this.createChild(SensitivityProbe, name);		
	}
	
	createProbabilityProbe(name) {
		return this.createChild(ProbabilityProbe, name);		
	}

}
