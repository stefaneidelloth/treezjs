import ComponentAtom from './../../core/component/componentAtom.js';
import Monitor from './../../core/monitor/monitor.js';
import Table from './../../data/table/table.js';
import ColumnBlueprint from './../../data/column/columnBlueprint.js';

export default class Probe extends ComponentAtom {

	constructor(name) {
		super(name);
		this.overlayImage = 'probe.png';
		this.isRunnable=true;
		
		/**
		 * If there is only one result column, the probe label equals the name of the result column. If there are several
		 * result columns, the probe label will be used as name prefix. The family range indices will also be added to the result
		 * column names.
		 */
		this.probeLabel = 'probe';	

		this.studyPath = '';
		this.outputPath = '';
		this.firstProbeTablePath = '';

		this.oneBasedColumnIndex = 1;
		this.oneBasedRowIndex = 1;
	}

	static get columnNameSeparator(){
		return '_';
	}

	async execute(treeView, monitor) {

		var hasMainMonitor = false;
		if(!monitor){
			var monitorTitle = this.constructor.name + ' "' + this.name + '"';
			monitor = new Monitor(monitorTitle, treeView);
			monitor.showInMonitorView();
			monitor.clear();
			hasMainMonitor=true;
		}	
		
		this.afterCreateControlAdaptionHook();

		monitor.totalWork=1;
			
		await this.runProbe(treeView, monitor);

		if(hasMainMonitor){
			monitor.done();
		}
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
	
	createTable(name){
		return this.createChild(Table, name);
	}
	
	createTableColumns(table, monitor) {
		monitor.info('Creating table columns...');		
		var columnBlueprints = this.createColumnBlueprints();
		table.createColumns(columnBlueprints);
		monitor.info('Created table columns.');
	}

	createColumnBlueprints(){
		throw new Error('Must be implemented by inheriting class');
	}
	
	addVariableColumnBlueprints(columnBlueprints){
		var variables = this.study.selectedVariables;
		for(var variable of variables){
			columnBlueprints.push(new ColumnBlueprint(variable.name, variable.name, variable.columnType));
		}
	}
	
	addProbeColumnBlueprint(columnBlueprints){
		columnBlueprints.push(new ColumnBlueprint(this.probeLabel, this.probeLabel, this.probeColumnType));
	}

	reCreateTable(monitor) {
		
		if (this.hasChildByClass(Table)) {
			this.removeChildrenByClass(Table);			
		}
		
		var probeTableName = this.name + 'Table';
		var table = this.createTable(probeTableName);	
		this.addChild(table);
		
		table.createColumnFolder();	
		this.createTableColumns(table, monitor);

		return table;
	}	

	//should be overridden by inheriting class
	async collectProbeDataAndFillTable(table, monitor){
		throw new Error('Not yet implemented');
	}
	
	afterCreateControlAdaptionHook() {
		this.updateRelativePathRoots();
	}

	updateRelativePathRoots() {
		//this.__firstProbeTableSelection.updateRelativeRootAtom();		
	}
	
	probeValue(probeTablePath) {		
		var probeTable = this.childFromRoot(probeTablePath);	
		var columnHeader = probeTable.headers[this.zeroBasedColumnIndex];
		var row = probeTable.rows[this.zeroBasedRowIndex];
		if(!row){
			var message = 'Could not get probe row with one based index '+ this.oneBasedRowIndex +' from table "' 
							+ probeTablePath + '" (max index: ' + probeTable.rows.length + ' rows).'; 
			throw new Error(message)
		}
		return row.entry(columnHeader);
	}	

	get probeTablePrefix() {		
		var pathItems = this.firstProbeTableRelativePath.split('.');
		var firstPrefix = pathItems[0];		
		
		var idSeparator = '_';
		var prefixItems = firstPrefix.split(idSeparator);
		var prefix = prefixItems[0] + idSeparator;
		return prefix;
	}
	
	get firstProbeTableRelativePath(){
		return this.firstProbeTablePath.substring(this.outputPath.length+1);
	}	
	
	get firstProbeRelativePath() {
		return this.__firstProbeTableSelection.relativePath;		
	}
	
	get relativeProbeTablePath(){
		var pathItems = this.firstProbeTableRelativePath.split('.');
		var firstPrefix = pathItems[0];
		var firstIndex = firstPrefix.length + 1;
		return this.firstProbeTableRelativePath.substring(firstIndex);
	}	
	
	get numberOfOutputs() {		
		if (this.outputPath) {
			var outputAtom = this.childFromRoot(this.outputPath);
			return outputAtom.children.length;			
		} else {
			return 0;
		}		
	}	
	
	get probeColumnType() {		
		if (this.firstProbeTablePath) {
			var table = this.childFromRoot(this.firstProbeTablePath);				
			var probeColumn = table.columnFolder.columnByIndex(this.zeroBasedColumnIndex);
			if(probeColumn){
				return probeColumn.type;
			} else {
				throw new Error('Could not find a column with one based index ' + this.oneBasedColumnIndex + '.');
			}
						
		} else {
			var message = 'Could not determine the probe column type. Please make sure that the first probe table is specified.';
			throw new Error(message);
		}
	}
	
	get zeroBasedColumnIndex(){
		return parseInt(this.oneBasedColumnIndex) -1;
	}	
	
	get zeroBasedRowIndex(){
		return parseInt(this.oneBasedRowIndex) -1;
	}
	
	
	get study(){
		if(!this.studyPath){
			return null;
		}
		return this.childFromRoot(this.studyPath);
	}

}
