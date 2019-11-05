import Probe from './probe.js';
import Sensitivity from './../../study/sensitivity/sensitivity.js';
import SensitivityOutput from './../../study/sensitivity/sensitivityOutput.js';

import Column from './../../data/column/column.js';
import ColumnType from './../../data/column/columnType.js';
import ColumnBlueprint from './../../data/column/columnBlueprint.js';
import Table from './../../data/table/table.js';
import Row from './../../data/row/row.js';

export default class SensitivityProbe extends Probe {
	
	constructor(name) {
		super(name);		
		this.image = 'sensitivityProbe.png';		
						
		this.studyPath = 'root.studies.sensitivity';			
		
		this.outputPath = 'root.results.data.sensitivityOutput';
		this.firstProbeTablePath = 'root.results.data.sensitivityOutput.output_1.tableImportOutput';		

		this.__domainLabel = 'jobId'; 	
		this.__deltaLabel = 'difference_absolute';
		this.__relativeDeltaLabel = 'difference_percent';
		this.__studyPathSelection = undefined;		
	}

	createComponentControl(tabFolder){    
	     
		const page = tabFolder.append('treez-tab')
            .label('Data');
				
		this.__createProbeSection(page);
	}	
	
	__createProbeSection(page){
		
		var section = page.append('treez-section')
			.label('Probe');
	
		var sectionContent = section.append('div');
		
		this.__studyPathSelection = sectionContent.append('treez-model-path')
			.label('Sensitivity')
			.nodeAttr('atomClasses', [Sensitivity])	
			.bindValue(this, ()=>this.studyPath);
		
		sectionContent.append('treez-text-field')
			.label('Probe label')
			.bindValue(this, ()=>this.probeLabel);
	
		sectionContent.append('treez-model-path')
			.label('Sensitivity output')
			.nodeAttr('atomClasses', [SensitivityOutput])	
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
	
	createColumnBlueprints() {
		var columnBlueprints = [];			
		columnBlueprints.push(new ColumnBlueprint(this.__domainLabel, this.__domainLabel, ColumnType.integer, null));
		this.addVariableColumnBlueprints(columnBlueprints);		
		this.addProbeColumnBlueprint(columnBlueprints);

		columnBlueprints.push(new ColumnBlueprint(this.__deltaLabel, this.__deltaLabel, ColumnType.double, null));
		columnBlueprints.push(new ColumnBlueprint(this.__relativeDeltaLabel, this.__relativeDeltaLabel, ColumnType.double, null));

		return columnBlueprints;
	}
	
	__createColumnNames() {
		var columnNames = [];
		
		columnNames.push(this.__domainLabel);
		
		var variables = this.study.selectedVariables;
		for(var variable of variables){
			columnNames.push(variable.name);
		}
		
		columnNames.push(this.probeLabel);
		columnNames.push(this.__deltaLabel);
		columnNames.push(this.__relativeDeltaLabel);
		
		return columnNames;
	}	
	
	collectProbeDataAndFillTable(table, monitor) {

		monitor.info('Filling probe table...');			
				
		var columnNames = this.__createColumnNames();
		this.__fillProbeTable(table, columnNames, this.relativeProbeTablePath, this.probeTablePrefix);			

		monitor.info("Filled probe table.");
	}
	
	__fillProbeTable(
			table,			
			columnNames,			
			relativeProbeTablePath,
			prefix,
			timeRangeValues
	) {
				
		var inputGenerator = this.study.inputGenerator;
		var modelInputs = inputGenerator.modelInputs;	

		var workingPointValue = undefined;	
		
		var rowIndex = 0;
		for(var modelInput of modelInputs){		
						
			var row = new Row(table);			
			row.setEntry(columnNames[0], modelInput.jobId);
						
			var columnIndex = 1;			
			for(var variablePath of modelInput.all){
				var name = columnNames[columnIndex];
				var value = modelInput.get(variablePath);	
				row.setEntry(name, value);
				columnIndex++;
			}				
			
			var oneBasedOutputIndex = rowIndex+1;
			var tablePath = this.outputPath + '.' + prefix + oneBasedOutputIndex + '.' + relativeProbeTablePath;
			var probeValue = this.probeValue(tablePath);
			var probeLabel = columnNames[columnNames.length-3];			
			row.setEntry(probeLabel, probeValue);

			if(rowIndex === 0){
				workingPointValue = probeValue;
			}

			var delta = probeValue - workingPointValue;
			row.setEntry(this.__deltaLabel, delta);

			var deltaInPercent = workingPointValue !== 0
									?delta/workingPointValue*100
									:NaN;
			row.setEntry(this.__relativeDeltaLabel, deltaInPercent);
			
			table.addRow(row);
			
			rowIndex++;
		}
		
	}
		
	

}
