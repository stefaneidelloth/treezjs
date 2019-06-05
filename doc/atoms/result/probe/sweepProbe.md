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

	static get columnNameSeparator(){
		return '_';
	}

	constructor(name) {
		super(name);		
		this.image = 'sweep.png';		
		
		this.domainLabel = 'x'; 
		this.domainRangePath = 'root.studies.sweep.firstRange'; 
						
		this.firstFamilyLegend = 'family1'; 
		this.firstFamilyRangePath = '';	
		
		this.secondFamilyLegend = 'family2'; 
		this.secondFamilyRangePath = '';	
		
		/**
		 * If there is only one result column, this equals the name of the result column. If there are several
		 * result columns, this will be used as name prefix. The family range indices will also be added to the result
		 * column names.
		 */
		this.probeLabel = 'y';	

		this.sweepOutputPath = '';
		this.firstProbeTablePath = '';
		this.columnIndex = 0;
		this.rowIndex = 0;

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
			.bindValue(this, ()=>this.sweepOutputPath)
			.onChange(()=>this.__sweepOutputPathChanged());
		
		this.__firstProbeTableSelection = sectionContent.append('treez-model-path')
			.label('First probe table')
			.nodeAttr('atomClasses', [Table])			
			.bindValue(this, ()=>this.firstProbeTablePath);

		this.__sweepOutputPathChanged();

		sectionContent.append('treez-text-field')
			.label('One based column index')
			.bindValue(this, ()=>this.columnIndex);

		sectionContent.append('treez-text-field')
			.label('One based row index')
			.bindValue(this, ()=>this.rowIndex);		
	}

	__sweepOutputPathChanged(){
		var relativeRoot = null;
		try{
			relativeRoot = this.childFromRoot(this.sweepOutputPath);
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
				var columnName = this.probeLabel + NAME_SEPARATOR + firstFamilyIndex;				
				var legendText = this.firstFamilyLabel + ': ' + firstFamilyRangeValue;
				if (secondFamilyIsSpecified) {
					var secondFamilyIndex = 1;
					for (var secondFamilyRangeValue of secondFamilyRangeValues) {
						var extendedColumnName = columnName + NAME_SEPARATOR + secondFamilyIndex;
						
						var extendedLegendText = legendText + ', ' + secondFamilyLabelString + ': ' + secondFamilyRangeValue;
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
				
		var columnNames = SweepProbe.__createColumnNames(this.domainLabel, this.probeLabel, this.firstFamilyRangeValues, this.secondFamilyRangeValues);
		this.__fillProbeTable(table, domainRangeValues, columnNames, this.sweepOutputPath, this.relativeProbeTablePath, this.probeTablePrefix);

		monitor.info('Filled probe table.');
	}
	
	__fillProbeTable(table, domainRangeValues, columnNames, sweepOutputPath, relativeProbeTablePath, prefix) {
		
		var firstFamilyRangeValues = this.__firstFamilyRangeValues;
		var firstFamilyIsSpecified = firstFamilyRangeValues !== null;

        var secondFamilyRangeValues = this.__secondFamilyRangeValues;
        var secondFamilyIsSpecified = secondFamilyRangeValues !== null;	
			
		var sweepIndex = 1;
		for (var rowIndex = 0; rowIndex < domainRangeValues.length; rowIndex++) {

			var row = new Row(table);

			var columnIndex = 0;
						
			var domainValue = domainRangeValues[rowIndex];
			var isQuantity = domainValue instanceof Quantity;
			if (isQuantity) {				
				domainValue = domainValue.value;
			}
			var columnName = columnNames[columnIndex];
			row.setEntry(columnName, domainValue);
			columnIndex++;

			//first family
			if(firstFamilyIsSpecified){
				var columnName = columnNames[columnIndex];
				var firstFamilyValue = null; //TODO
				row.setEntry(columnName, firstFamilyValue);
				columnIndex++;
			}

			//second family
			if(secondFamilyIsSpecified){
				var columnName = columnNames[columnIndex];
				var secondFamilyValue = null; //TODO
				row.setEntry(columnName, secondFamilyValue);
				columnIndex++;
			}

			//probe value			
			var tablePath = sweepOutputPath + '.' + prefix + sweepIndex + '.' + relativeProbeTablePath;
			var probeValue = this.probeValue(tablePath);

			var columnName = columnNames[columnIndex];
			row.setEntry(columnName, probeValue);				
			sweepIndex++;			
			
			table.addRow(row);

		}
	}	

	static __createColumnNames(xColumnName, yColumnName, firstFamilyRangeValues, secondFamilyRangeValues) {
		
		var columnNames = [];		
		columnNames.push(xColumnName);		
		if (firstFamilyRangeValues) {
			for (var firstFamilyIndex = 1; firstFamilyIndex <= firstFamilyRangeValues.length; firstFamilyIndex++) {
				var columnName = yColumnName + SweepProbe.columnNameSeparator + firstFamilyIndex;
				if (secondFamilyIsSpecified) {
					for (var secondFamilyIndex = 1; secondFamilyIndex <= secondFamilyRangeValues.length; secondFamilyIndex++) {
						var extendedColumnName = columnName + SweepProbe.columnNameSeparator + secondFamilyIndex;
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
			return null;
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
		if (this.firstFamilyRangePath) {
			var rangeAtom = this.childFromRoot(this.firstFamilyRangePath);
			return rangeAtom.values;
		} else {
			return null;
		}
	}
	

}