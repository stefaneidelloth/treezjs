import ComponentAtom from './../../core/component/componentAtom.js';
import AddChildAtomTreeViewAction from './../../core/treeView/addChildAtomTreeViewAction.js';
import Table from './../../data/table/table.js';
import SweepProbe from './../probe/sweepProbe.js';
import PickingProbe from './../probe/pickingProbe.js';
import SensitivityProbe from './../probe/sensitivityProbe.js';
import SweepOutput from './../../study/sweep/sweepOutput.js';
import PickingOutput from './../../study/picking/pickingOutput.js';
import SensitivityOutput from './../../study/sensitivity/sensitivityOutput.js';
import ProbabilityOutput from './../../study/probability/probabilityOutput.js';
import Utils from './../../core/utils/utils.js';

export default class Data extends ComponentAtom {
   
	constructor(name) {		
		super(name);
		this.image = 'data.png';
		this.isRunnable=true;		
	}
	
	createComponentControl(tabFolder){    
	     
		const tab = tabFolder.append('treez-tab')
		    .on('dragover', event => event.preventDefault())
		    .on('drop', event => this.handleDrop(event, this.treeView)) //allows to drop files
		    .on('dragenter', event => event.preventDefault())
			.label('Data'); 
		
		const section = tab.append('treez-section')
    		.label('Data');

    	this.createHelpAction(section, 'result/data/data.md');

    	section.append('treez-section-action')
            .image('run.png')
            .label('Run executable children')
            .addAction(()=>this.execute(this.treeView)
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

	async handleFileDrop(file, treeView){
		var name = 'table';
		if(file.name){
            name = Utils.removeFileExtension(file.name);
		}
		if(this.childByName(name)){
			name = this.createChildNameStartingWith(name);
		}		
		var table = this.createTable(name);
		await table.handleFileDrop(file, treeView);
	}

	createTable(name) {
		return this.createChild(Table, name);		
	}	

	createPickingOutput(name) {
		return this.createChild(PickingOutput, name);		
	}

	createProbabilityOutput(name) {
		return this.createChild(ProbabilityOutput, name);		
	}

	createSensitivityOutput(name) {
		return this.createChild(SensitivityOutput, name);		
	}

	createSweepOutput(name) {
		return this.createChild(SweepOutput, name);		
	}

	createPickingProbe(name) {
		return this.createChild(PickingProbe, name);		
	}
		
	createProbabilityProbe(name) {
		return this.createChild(ProbabilityProbe, name);		
	}

	createSensitivityProbe(name) {
		return this.createChild(SensitivityProbe, name);		
	}
	
	
	createSweepProbe(name) {
		return this.createChild(SweepProbe, name);		
	}	

}
