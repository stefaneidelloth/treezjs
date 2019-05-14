import Probe from './probe.js';
import Picking from './../../study/picking/picking.js';
import PickingOutput from './../../study/picking/pickingOutput.js';
import DomainType from './domainType.js';
import Column from './../../data/column/column.js';
import ColumnType from './../../data/column/columnType.js';
import ColumnBlueprint from './../../data/column/columnBlueprint.js';
import Table from './../../data/table/table.js';
import Row from './../../data/row/row.js';

export default class PickingProbe extends Probe {
	
	constructor(name) {
		super(name);		
		this.image = 'picking.png';		
		
		this.domainLabel = 'domain'; 
		this.domainType = DomainType.sampleIndex;
		
		//The model path to a column that is used to retrieve domain values
		this.domainColumnPath = ''; 
		
		//The model path to Picking that is used to retrieve time values
		this.pickingPath = '';			
	
		this.probeLabel = 'y';	

		this.pickingOutputPath = 'root.results.data.pickingOutput';
		this.firstProbeTablePath = 'root.results.data.pikcingOutput.output_1.tableImportOutput';
		this.columnIndex = 0;
		this.rowIndex = 0;

		this.__domainLabelSelection = undefined;
		this.__domainColumnPathSelection = undefined;
		this.__pickingPathSelection = undefined;		
	}

	createComponentControl(tabFolder){    
	     
		const page = tabFolder.append('treez-tab')
            .label('Data');
		
		this.__createDomainSection(page);
		this.__createProbeSection(page);
	}
	
	__createDomainSection(page){
		
		var section = page.append('treez-section')
			.label('Domain');		
	
		section.append('treez-section-action')
	        .image('run.png')
	        .label('Run probe')
	        .addAction(()=>this.execute(this.__treeView));		
		
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-enum-combo-box')
			.label('Type')
			.nodeAttr('options', DomainType)
			.onChange(() => this.__showOrHideComponents())
			.bindValue(this, ()=>this.domainType);
		
		this.__domainLabelSelection = sectionContent.append('treez-text-field')
			.label('Label')
			.bindValue(this, ()=>this.domainLabel);		
		
		this.__pickingPathSelection = sectionContent.append('treez-model-path')
			.label('Picking')
			.nodeAttr('atomClasses', [Picking])	
			.bindValue(this, ()=>this.pickingPath);
		
		this.__domainColumnPathSelection = sectionContent.append('treez-model-path')
			.label('Column')
			.nodeAttr('atomClasses', [Column])	
			.bindValue(this, ()=>this.domainColumnPath);	

		this.__showOrHideComponents();
	}
	
	__showOrHideComponents(){		
		
		this.__domainColumnPathSelection.hide();
		this.__pickingPathSelection.hide();
	
		if (this.__isTimeSeries) {			
			
			if (this.__isTimeSeriesFromPicking) {
				this.__pickingPathSelection.show();
			}
			
			if (this.__isTimeSeriesFromColumn) {
				this.__domainColumnPathSelection.show();
			}
		} 	
	}
	
	__createProbeSection(page){
		
		var section = page.append('treez-section')
			.label('Probe');
	
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-text-field')
			.label('Probe label')
			.bindValue(this, ()=>this.probeLabel);
	
		sectionContent.append('treez-model-path')
			.label('Picking output')
			.nodeAttr('atomClasses', [PickingOutput])	
			.bindValue(this, ()=>this.pickingOutputPath);
		
		this.__firstProbeTableSelection = sectionContent.append('treez-model-path')
			.label('First probe table')
			.nodeAttr('atomClasses', [Table])			
			.bindValue(this, () => this.firstProbeTablePath);			
	
		sectionContent.append('treez-text-field')
			.label('One based column index')
			.bindValue(this, ()=>this.columnIndex);
	
		sectionContent.append('treez-text-field')
			.label('One based row index')
			.bindValue(this, ()=>this.rowIndex);
	}	

	afterCreateControlAdaptionHook() {
		this.__updateRelativePathRoots();
	}

	__updateRelativePathRoots() {
		//this.__firstProbeTableSelection.updateRelativeRootAtom();		
	}
	
	createTableColumns(table, monitor) {
		monitor.info('Creating table columns...');		
		var columnBlueprints = this.__createColumnBlueprints();
		table.createColumns(columnBlueprints);
		monitor.info('Created table columns.');
	}

	__createColumnBlueprints() {
		var columnBlueprints = [];			
		columnBlueprints.push(new ColumnBlueprint(this.domainLabel, this.domainLabel, this.__domainColumnType, null));
		this.__addVariableColumnBlueprints(columnBlueprints);		
		this.__addProbeColumnBlueprint(columnBlueprints);
		return columnBlueprints;
	}
	
	__addVariableColumnBlueprints(columnBlueprints){
		var variables = this.__picking.selectedVariables;
		for(var variable of variables){
			columnBlueprints.push(new ColumnBlueprint(variable.name, variable.name, variable.columnType));
		}
	}
	
	__addProbeColumnBlueprint(columnBlueprints){
		columnBlueprints.push(new ColumnBlueprint(this.probeLabel, this.probeLabel, this.__pickingProbeColumnType));
	}
	
	collectProbeDataAndFillTable(table, monitor) {

		monitor.info('Filling probe table...');
		
		//get probe table relative path		
		var pathItems = this.__firstProbeTableRelativePath.split('.');
		var firstPrefix = pathItems[0];
		var firstIndex = firstPrefix.length + 1;
		var relativeProbeTablePath = this.__firstProbeTableRelativePath.substring(firstIndex);
		var prefix = this.probeTablePrefix(firstPrefix);
		
		if (this.__picking.isTimeDependent) {
			if(!this.__isTimeSeries){
				throw new Error('Type of picking probe does not fit time dependent picking.')
			}	
			var columnNames = this.__createColumnNames();
			this.__fillProbeTableForTimeSeries(table, columnNames, relativeProbeTablePath, prefix, this.__domainTimeSeriesRange);
		} else {			
			var columnNames = this.__createColumnNames();
			this.__fillProbeTable(table, columnNames, relativeProbeTablePath, prefix);
		}		

		monitor.info("Filled probe table.");
	}
	
	__fillProbeTable(
			table,			
			columnNames,			
			relativeProbeTablePath,
			prefix,
			timeRangeValues
	) {
				
		var rowIndex = 0;
		for(var sample of this.__enabledSamples){
			
			var oneBasedSampleIndex = rowIndex+1;
			
			var row = new Row(table);			
								
			row.setEntry(columnNames[0], oneBasedSampleIndex);
			
			var variableMap = sample.variableMap;
			
			for(var columnIndex = 1; columnIndex < columnNames.length-1; columnIndex++){				
				var variableName = columnNames[columnIndex];				
				var variable = variableMap[variableName];

				row.setEntry(variableName, variable.value);
			}			
			
			var tablePath = this.pickingOutputPath + '.' + prefix + oneBasedSampleIndex + '.' + relativeProbeTablePath;
			var probeValue = this.__probeValue(tablePath);
			var rangeLabel = columnNames[columnNames.length-1];			
			row.setEntry(rangeLabel, probeValue);
			
			table.addRow(row);
			
			rowIndex++;
		}
		
	}

	__fillProbeTableForTimeSeries(
			table,			
			columnNames,			
			relativeProbeTablePath,
			prefix,
			timeRangeValues
	) {
				
		var sample = this.__enabledSamples[0];
		

		for(var rowIndex = 0; rowIndex < timeRangeValues.length; rowIndex++){
									
			var row = new Row(table);
			
			var domainValue = timeRangeValues[rowIndex];								
								
			row.setEntry(columnNames[0], domainValue);
			
			var variableMap = sample.variableMap;
			
			for(var columnIndex = 1; columnIndex < columnNames.length-1; columnIndex++){				
				var variableName = columnNames[columnIndex];				
				var rangeVariable = variableMap[variableName];
				var value = rangeVariable.values[rowIndex];				
				row.setEntry(variableName, value);
			}			
			
			var tablePath = this.pickingOutputPath + '.' + prefix + (rowIndex+1) + '.' + relativeProbeTablePath;
			var probeValue = this.__probeValue(tablePath);
			var rangeLabel = columnNames[columnNames.length-1];			
			row.setEntry(rangeLabel, probeValue);
			
			table.addRow(row);			
		}		
	}	
	
	__createColumnNames(domainColumnName) {
		var columnNames = [];
		
		columnNames.push(this.domainLabel);
		
		var variables = this.__picking.selectedVariables;
		for(var variable of variables){
			columnNames.push(variable.name);
		}
		
		columnNames.push(this.probeLabel);
		
		return columnNames;
	}
	

	__probeValue(probeTablePath) {	
		var probeTable = this.childFromRoot(probeTablePath);	
		var columnHeader = probeTable.headers[this.columnIndex];
		var row = probeTable.rows[this.rowIndex];
		return row.entry(columnHeader);
	}

	get __firstProbeTableRelativePath(){
		return this.firstProbeTablePath.substring(this.pickingOutputPath.length+1);
	}	
	
	get __isTimeSeriesFromColumn() {
		return this.domainType === DomainType.timeSeriesFromColumn;		
	}

	get __isTimeSeriesFromPicking() {
		return this.domainType === DomainType.timeSeriesFromPicking;
	}

	get __isTimeSeries() {
		return this.__isTimeSeriesFromColumn || this.__isTimeSeriesFromPicking;		
	}

	get __numberOfPickingOutputs() {		
		if (this.pickingOutputPath) {
			var pickingOutputAtom = this.childFromRoot(this.pickingOutputPath);
			return pickingOutputAtom.children.length;			
		} else {
			return 0;
		}		
	}

	get __enabledSamples() {		
		if (this.pickingPath) {
			var picking = this.childFromRoot(this.pickingPath);
			return picking.enabledSamples;
		} else {
			return [];
		}		
	}
	
	get __picking(){
		if(!this.pickingPath){
			return null;
		}
		return this.childFromRoot(this.pickingPath);
	}

	get __pickingProbeColumnType() {		
		if (this.firstProbeTablePath) {
			var table = this.childFromRoot(this.firstProbeTablePath);				
			var probeColumn = table.columnFolder.columnByIndex(this.columnIndex);
			return probeColumn.type;			
		} else {
			var message = 'Could not determine the probe column type. Please make sure that a probe table is specified.';
			throw new Error(message);
		}
	}

	get __domainColumnType() {
		if (this.__isTimeSeriesFromColumn) {
			return this.__domainColumnTypeFromColumn;
		} else if (this.__isTimeSeriesFromPicking) {
			return this.__domainColumnTypeFromPicking;
		}
		return ColumnType.integer;
		
	}

	get __domainColumnTypeFromColumn() {	
		if (this.domainColumnPath) {
			var column = this.childFromRoot(this.domainColumnPath);
			return column.type;			
		} else {
			return null;
		}
	}

	get __domainColumnTypeFromPicking() {
		
		if(!this.pickingPath){
			return null;
		}		
		
		var picking = this.childFromRoot(this.pickingPath);
		var domainColumnType = picking.rangeType;
		
		if (!domainColumnType) {
			var message = 'The picking "' + pickingModelPath + '" that is used for the picking probe "'
					+ this.name + '" does not provide a time series.';
			throw new Error(message);
		}
		
		return domainColumnType;
		
	}
	
	get __domainTimeSeriesRange() {
		if (this.__isTimeSeriesFromColumn) {			
			if (this.domainColumnPath) {
				var column = this.childFromRoot(this.domainColumnPath);
				var range = column.values;

				if(this.pickingPath){
					var picking =  this.childFromRoot(this.pickingPath);
					var pickingRange = picking.range;
					if(range.length < pickingRange.length){
						throw new Error('The selected column for the domain values does contain less values than the time range.');
					}

					if(range.length > pickingRange.length){
						return range.slice(0,pickingRange.length);						
					} else {
						return range;
					}
				}
								
			} else {
				return [];
			}
		
		} else if (this.__isTimeSeriesFromPicking) {			
			if (this.pickingPath) {
				var picking =  this.childFromRoot(this.pickingPath);
				return picking.range;				
			} else {
				return [];
			}
			
		}

		throw new Error('Unknown time series type');
	}

	get __firstProbeRelativePath() {
		return this.__firstProbeTableSelection.relativePath;		
	}

}
