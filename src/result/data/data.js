import ComponentAtom from './../../core/component/componentAtom.js';
import AddChildAtomTreeViewAction from './../../core/treeview/addChildAtomTreeViewAction.js';


export default class Data extends ComponentAtom {
   
	constructor(name) {
		if(!name){
			name='data';
		}
		super(name);
		this.image = 'data.png';
		this.isRunnable=true;		
	}

	
	createComponentControl(tabFolder, treeView){    
	     
		const page = tabFolder.append('treez-tab'); 
		
		const section = page.append('treez-section')
    	.label('Data');
	
		section.append('treez-text-label')
		.value('This atom represents data.');		
	}	


	extendContextMenuActions(actions, treeView) {
		
		/*

		actions.add( new AddChildAtomTreeViewAction(
				Table,
				'table',
				'table.png',
				this,
				treeView)
		);
		
		actions.add( new AddChildAtomTreeViewAction(
				PickingProbe,
				'pickingProbe',
				'picking.png',
				this,
				treeView,
				'probe.png')
		);
		
		actions.add( new AddChildAtomTreeViewAction(
				SweepProbe,
				'sweepProbe',
				'sweep.png',
				this,
				treeView,
				'probe.png')
		);
		
		actions.add( new AddChildAtomTreeViewAction(
				SensitivityProbe,
				'sensitvityProbe',
				'sensitivity.png',
				this,
				treeView,
				'probe.png')
		);
		
		actions.add( new AddChildAtomTreeViewAction(
				ProbabilityProbe,
				'probabilityProbe',
				'probability.png',
				this,
				treeView,
				'probe.png')
		);		
		
		*/
		
		return actions;
		

	}
	
	execute(treeView) {
		this.__treeView = treeView;
		this.executeChildren(Probe, treeView);
	}

	createTable(name) {
		return this.createChild(Table, name);		
	}
	
	createOutputAtom(name) {
		return this.createChild(OutputAtom, name);		
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
