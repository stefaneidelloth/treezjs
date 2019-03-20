import ComponentAtom from './../../core/component/componentAtom.js';
import Monitor from './../../core/monitor/Monitor.js';
import Table from './../../data/table/table.js';


export default class Probe extends ComponentAtom {

	constructor(name) {
		super(name);
		this.overlayImage = 'probe.png';
		this.isRunnable=true;
	}

	async execute(treeView, monitor) {
		if(!monitor){
			var monitorTitle = this.constructor.name + ' "' + this.name + '"';
			monitor = new Monitor(monitorTitle, treeView);
			monitor.showInMonitorView();
		}	
		
		this.afterCreateControlAdaptionHook();
			
		await this.runProbe(treeView, monitor);
	}
	

	async runProbe(treeView, monitor) {				
		
		var continueProbe = false;
	
		var table = null;
		try {
			table = this.reCreateTable(monitor);
			continueProbe = true;
		} catch (error) {
			var message = 'Could not create the probe table. The probe has been canceled.\n' + error;
			alert(message);
		}

		if (continueProbe) {			
			await this.collectProbeDataAndFillTable(table, monitor);
			if(treeView){
				treeView.refresh();
			}				
		}
	}

	reCreateTable(monitor) {
		
		if (this.hasChildByClass(Table)) {
			this.removeChildrenByClass(Table);			
		}
		
		var probeTableName = this.name + 'Table';
		var table = this.createChild(Table, probeTableName);		
		this.createTableColumns(table, monitor);

		return table;
	}

	//should be overridden by inheriting class
	createTableColumns(table, monitor){
		 table.createColumnFolder();
	}

	//should be overridden by inheriting class
	async collectProbeDataAndFillTable(table, monitor){
		throw new Error('Not yet implemented');
	}	

}
