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
		this.image = 'pickingProbe.png';		
		
		this.domainLabel = 'domain'; 
		this.domainType = DomainType.sampleIndex;		
		
		this.domainColumnPath = ''; //The model path to a column that is used to retrieve domain values 		
		
		this.studyPath = 'root.studies.picking';		

		this.outputPath = 'root.results.data.pickingOutput';
		this.firstProbeTablePath = 'root.results.data.pikcingOutput.output_1.tableImportOutput';
		
		this.__domainLabelSelection = undefined;
		this.__domainColumnPathSelection = undefined;
		this.__studyPathSelection = undefined;		
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
			.nodeAttr('enum', DomainType)
			.onChange(() => this.__showOrHideComponents())
			.bindValue(this, ()=>this.domainType);
		
		this.__domainLabelSelection = sectionContent.append('treez-text-field')
			.label('Label')
			.bindValue(this, ()=>this.domainLabel);		
		
		this.__studyPathSelection = sectionContent.append('treez-model-path')
			.label('Picking')
			.nodeAttr('atomClasses', [Picking])	
			.bindValue(this, ()=>this.studyPath);
		
		this.__domainColumnPathSelection = sectionContent.append('treez-model-path')
			.label('Column')
			.nodeAttr('atomClasses', [Column])	
			.bindValue(this, ()=>this.domainColumnPath);	

		this.__showOrHideComponents();
	}
	
	__showOrHideComponents(){		
		
		if(this.__domainColumnPathSelection){
			this.__domainColumnPathSelection.hide();
		}
		
		if(this.__studyPathSelection){
			this.__studyPathSelection.hide();
		}
		
	
		if (this.__isTimeSeries) {			
			
			if (this.__isTimeSeriesFromPicking) {
				this.__studyPathSelection.show();
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
			.bindValue(this, ()=>this.outputPath);
		
		this.__firstProbeTableSelection = sectionContent.append('treez-model-path')
			.label('First probe table')
			.nodeAttr('atomClasses', [Table])			
			.bindValue(this, () => this.firstProbeTablePath);			
	
		sectionContent.append('treez-text-field')
			.label('One based column index')
			.bindValue(this, ()=>this.oneBasedColumnIndex);
	
		sectionContent.append('treez-text-field')
			.label('One based row index')
			.bindValue(this, ()=>this.oneBasedRowIndex);
	}		
	
	
	
	collectProbeDataAndFillTable(table, monitor) {

		monitor.info('Filling probe table...');		
		
		if (this.study.isTimeDependent) {
			if(!this.__isTimeSeries){
				throw new Error('Type of picking probe does not fit time dependent picking.')
			}	
			var columnNames = this.__createColumnNames();
			this.__fillProbeTableForTimeSeries(table, columnNames, this.relativeProbeTablePath, this.probeTablePrefix, this.__domainTimeSeriesRange);
		} else {			
			var columnNames = this.__createColumnNames();
			this.__fillProbeTable(table, columnNames, this.relativeProbeTablePath, this.probeTablePrefix);
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
			
			var tablePath = this.outputPath + '.' + prefix + oneBasedSampleIndex + '.' + relativeProbeTablePath;
			var probeValue = this.probeValue(tablePath);
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
			
			var tablePath = this.outputPath + '.' + prefix + (rowIndex+1) + '.' + relativeProbeTablePath;
			var probeValue = this.probeValue(tablePath);
			var rangeLabel = columnNames[columnNames.length-1];			
			row.setEntry(rangeLabel, probeValue);
			
			table.addRow(row);			
		}		
	}	
	
	createColumnBlueprints() {
		var columnBlueprints = [];			
		columnBlueprints.push(new ColumnBlueprint(this.domainLabel, this.domainLabel, this.__domainColumnType, null));
		this.addVariableColumnBlueprints(columnBlueprints);		
		this.addProbeColumnBlueprint(columnBlueprints);
		return columnBlueprints;
	}
	
	__createColumnNames() {
		var columnNames = [];
		
		columnNames.push(this.domainLabel);
		
		var variables = this.study.selectedVariables;
		for(var variable of variables){
			columnNames.push(variable.name);
		}
		
		columnNames.push(this.probeLabel);
		
		return columnNames;
	}	
	
	get __enabledSamples() {		
		if (this.studyPath) {
			var picking = this.childFromRoot(this.studyPath);
			return picking.enabledSamples;
		} else {
			return [];
		}		
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
		
		if(!this.studyPath){
			return null;
		}		
		
		var picking = this.childFromRoot(this.studyPath);
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

				if(this.studyPath){
					var picking =  this.childFromRoot(this.studyPath);
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
			if (this.studyPath) {
				var picking =  this.childFromRoot(this.studyPath);
				return picking.range;				
			} else {
				return [];
			}
			
		}

		throw new Error('Unknown time series type');
	}

	

}
