import Probe from './probe.js';
import SweepOutput from './../../study/sweep/sweepOutput.js';
import Table from './../../data/table/table.js';
import Quantity from './../../variable/quantity.js';
import VariableRange from './../../variable/range/variableRange.js';
import ColumnBlueprint from './../../data/column/columnBlueprint.js'; 
import Row from './../../data/row/row.js';


/**
 * Collects data from a sweep parameter variation and puts it in a single (probe-) table. That table can easier be used
 * to produce plots than the distributed sweep results.
 */
export default class SweepProbe extends Probe {

	

	constructor(name) {
		super(name);		
		this.image = 'sweep.png';		
		
		this.domainLabel = 'x'; 
		this.domainRangePath = 'root.studies.sweep.firstRange'; 
						
		this.firstFamilyLegend = 'family1'; 
		this.firstFamilyRangePath = '';	
		
		this.secondFamilyLegend = 'family2'; 
		this.secondFamilyRangePath = '';		

		this.__firstProbeTableSelection = undefined;
	}

	 createComponentControl(tabFolder){    
	     
		const page = tabFolder.append('treez-tab')
            .label('Data');
					
		this.__createDomainSection(page);
		this.__createFirstFamilySection(page);
		this.__createSecondFamilySection(page);
		this.__crateProbeSection(page);
	 }
	 
	__createDomainSection(page){
		
		var section = page.append('treez-section')
			.label('Domain');

		this.createHelpAction(section, 'result/probe/sweepProbe.md');				
		
		section.append('treez-section-action')
            .image('run.png')
            .label('Run probe')
            .addAction(()=>this.execute(this.__treeView));		
		
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-text-field')
			.label('Domain label')
			.bindValue(this, ()=>this.domainLabel);		
		
		sectionContent.append('treez-model-path')
			.label('Domain range')
			.nodeAttr('atomClasses', [VariableRange])	
			.bindValue(this, ()=>this.domainRangePath);			
	}
	
	__createFirstFamilySection(page){
		
		var section = page.append('treez-section')
			.label('First family')
			.attr('collapsed','collapsed');
	
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-text-field')
			.label('Legend for first family')
			.bindValue(this, ()=>this.firstFamilyLegend);	
		
		sectionContent.append('treez-model-path')
			.label('Range for first family')
			.nodeAttr('atomClasses', [VariableRange])	
			.bindValue(this, ()=>this.firstFamilyRangePath);		
	}
	
	__createSecondFamilySection(page){
		
		var section = page.append('treez-section')
			.label('Second family')
			.attr('collapsed','collapsed');
	
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-text-field')
			.label('Legend for second family')
			.bindValue(this, ()=>this.secondFamilyLegend);	
		
		sectionContent.append('treez-model-path')
			.label('Range for second family')
			.nodeAttr('atomClasses', [VariableRange])	
			.bindValue(this, ()=>this.secondFamilyRangePath);		
	}
	
	__crateProbeSection(page){
		var section = page.append('treez-section')
			.label('Probe');
	
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-text-field')
			.label('Probe label')
			.bindValue(this, ()=>this.probeLabel);

		sectionContent.append('treez-model-path')
			.label('Sweep output')
			.nodeAttr('atomClasses', [SweepOutput])	
			.bindValue(this, ()=>this.outputPath)
			.onChange(()=>this.__outputPathChanged());
		
		this.__firstProbeTableSelection = sectionContent.append('treez-model-path')
			.label('First probe table')
			.nodeAttr('atomClasses', [Table])			
			.bindValue(this, ()=>this.firstProbeTablePath);

		this.__outputPathChanged();

		sectionContent.append('treez-integer')
			.label('One based column index')
			.labelWidth('150px')
			.min('1')
			.bindValue(this, ()=>this.oneBasedColumnIndex);

		sectionContent.append('treez-integer')
			.label('One based row index')
			.labelWidth('150px')
			.min('1')
			.bindValue(this, ()=>this.oneBasedRowIndex);		
	}

	__outputPathChanged(){
		var relativeRoot = null;
		try{
			relativeRoot = this.childFromRoot(this.outputPath);
		} catch(error){

		}
		this.__firstProbeTableSelection.nodeAttr('relativeRootAtom', relativeRoot);
	}
	
	createColumnBlueprints() {
		var columnBlueprints = [];		

		//domain column----------------------------------------			
		columnBlueprints.push(new ColumnBlueprint(this.domainLabel, this.domainLabel, this.__domainColumnType));

		//probe columns---------------------------------------				
		var probeColumnType = this.probeColumnType;
		var firstFamilyRangeValues = this.__firstFamilyRangeValues;
        var secondFamilyRangeValues = this.__secondFamilyRangeValues;
		
		var firstFamilyIsSpecified = firstFamilyRangeValues !== null;
		if (firstFamilyIsSpecified) {
			var secondFamilyIsSpecified = secondFamilyRangeValues !== null;
			var firstFamilyIndex = 1;
			for (var firstFamilyRangeValue of firstFamilyRangeValues) {
				var columnName = this.probeLabel + Probe.columnNameSeparator + firstFamilyIndex;				
				var legendText = this.firstFamilyLegend + ': ' + firstFamilyRangeValue;
				if (secondFamilyIsSpecified) {
					var secondFamilyIndex = 1;
					for (var secondFamilyRangeValue of secondFamilyRangeValues) {
						var extendedColumnName = columnName + Probe.columnNameSeparator + secondFamilyIndex;
						
						var extendedLegendText = legendText + ', ' + this.secondFamilyLegend + ': ' + secondFamilyRangeValue;
						columnBlueprints.push(new ColumnBlueprint(extendedColumnName, extendedLegendText, probeColumnType));
						secondFamilyIndex++;
					}
				} else {
					columnBlueprints.push(new ColumnBlueprint(columnName, legendText, probeColumnType));
				}
				firstFamilyIndex++;
			}
		} else {			
			columnBlueprints.push(new ColumnBlueprint(this.probeLabel, '', probeColumnType));
		}
		return columnBlueprints;
	}	
	
	collectProbeDataAndFillTable(table, monitor) {

		monitor.info('Filling probe table...');

		var domainRangeValues = null;
		if (this.domainRangePath) {
			var rangeAtom = this.childFromRoot(this.domainRangePath);
			domainRangeValues = rangeAtom.values;
		}
				
		var columnNames = SweepProbe.__createColumnNames(this.domainLabel, this.probeLabel, this.__firstFamilyRangeValues, this.__secondFamilyRangeValues);
		this.__fillProbeTable(table, domainRangeValues, columnNames, this.outputPath, this.relativeProbeTablePath, this.probeTablePrefix);

		monitor.info('Filled probe table.');
	}
	
	__fillProbeTable(table, domainRangeValues, columnNames, outputPath, relativeProbeTablePath, prefix) {
		
		var firstFamilyRangeValues = this.__firstFamilyRangeValues;
		var firstFamilyIsSpecified = firstFamilyRangeValues !== null;

        var secondFamilyRangeValues = this.__secondFamilyRangeValues;
        var secondFamilyIsSpecified = secondFamilyRangeValues !== null;	
			
		var sweepIndex = 1;
		for (var rowIndex = 0; rowIndex < domainRangeValues.length; rowIndex++) {			

			var row = new Row(table);			
						
			var domainValue = domainRangeValues[rowIndex];
			var isQuantity = domainValue instanceof Quantity;
			if (isQuantity) {				
				domainValue = domainValue.value;
			}
			var domainColumnName = columnNames[0];
			row.setEntry(domainColumnName, domainValue);

			for(var columnIndex = 1; columnIndex < columnNames.length; columnIndex++){

				var columnName = columnNames[columnIndex];
				var tablePath = outputPath + '.' + prefix + sweepIndex + '.' + relativeProbeTablePath;	
				var probeValue = this.probeValue(tablePath);
				row.setEntry(columnName, probeValue);				
								
				sweepIndex++;			
				
			}

			table.addRow(row);			

		}


	}	

	static __createColumnNames(xColumnName, yColumnName, firstFamilyRangeValues, secondFamilyRangeValues) {
		
		var firstFamilyIsSpecified = firstFamilyRangeValues !== null;
		var secondFamilyIsSpecified = secondFamilyRangeValues !== null;	

		var columnNames = [];		
		columnNames.push(xColumnName);		
		if (firstFamilyIsSpecified) {
			for (var firstFamilyIndex = 1; firstFamilyIndex <= firstFamilyRangeValues.length; firstFamilyIndex++) {
				var columnName = yColumnName + Probe.columnNameSeparator + firstFamilyIndex;
				if (secondFamilyIsSpecified) {
					for (var secondFamilyIndex = 1; secondFamilyIndex <= secondFamilyRangeValues.length; secondFamilyIndex++) {
						var extendedColumnName = columnName + Probe.columnNameSeparator + secondFamilyIndex;
						columnNames.push(extendedColumnName);
					}
				} else {
					columnNames.push(columnName);
				}
			}
		} else {			
			columnNames.push(yColumnName);
		}
		return columnNames;
	}	
	
	get __domainColumnType() {		
		if (this.domainRangePath) {
			var rangeAtom = this.childFromRoot(this.domainRangePath);
			return rangeAtom.columnType;
		} else {
			throw new Error('Unknown domain range path.');
		}		
	}	

	get __firstFamilyRangeValues() {				
		if (this.firstFamilyRangePath) {
			var rangeAtom = this.childFromRoot(this.firstFamilyRangePath);
			return rangeAtom.values;
		} else {
			return null;
		}		
	}

	get __secondFamilyRangeValues() {
		if (this.secondFamilyRangePath) {
			var rangeAtom = this.childFromRoot(this.secondFamilyRangePath);
			return rangeAtom.values;
		} else {
			return null;
		}
	}
	

}