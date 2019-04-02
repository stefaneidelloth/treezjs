import Probe from './probe.js';
import SweepOutput from './../../study/sweep/sweepOutput.js';
import Table from './../../data/table/table.js';
import VariableRange from './../../study/range/variableRange.js';
import ColumnBlueprint from './../../data/column/columnBlueprint.js'; 
import Row from './../../data/row/row.js';
import Quantity from './../../data/variable/quantity.js';

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
			.label('Column index')
			.bindValue(this, ()=>this.columnIndex);

		sectionContent.append('treez-text-field')
			.label('Row index')
			.bindValue(this, ()=>this.rowIndex);		
	}

	__sweepOutputPathChanged(){
		var relativeRoot = null;
		try{
			relativeRoot = this.getChildFromRoot(this.sweepOutputPath);
		} catch(error){

		}
		this.__firstProbeTableSelection.nodeAttr('relativeRootAtom', relativeRoot);
	}

	createTableColumns(table, monitor) {

		monitor.info('Creating table columns...');

		//create column blueprints
		var columnBlueprints = [];		

		//domain column----------------------------------------			
		columnBlueprints.push(new ColumnBlueprint(this.domainLabel, this.domainLabel, this.__domainColumnType));

		//probe columns---------------------------------------				
		var probeColumnType = this.__probeColumnType;
		var firstFamilyRangeValues = this.__firstFamilyRangeValues;
        var secondFamilyRangeValues = this.__secondFamilyRangeValues;

		//create y column names, types and legends
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

		//create columns
		table.createColumns(columnBlueprints);

		monitor.info('Created table columns.');

	}
	
	get __domainColumnType() {		
		if (this.domainRangePath) {
			var rangeAtom = this.getChildFromRoot(this.domainRangePath);
			return rangeAtom.columnType;
		} else {
			return null;
		}		
	}

	get __probeColumnType() {
		var probeTable = this.getChildFromRoot(this.firstProbeTablePath);
		var columnIndex = parseInt(this.columnIndex);
		var probeColumn = probeTable.columns[columnIndex];
		return probeColumn.type;
	}

	get __firstFamilyRangeValues() {				
		if (this.firstFamilyRangePath) {
			var rangeAtom = this.getChildFromRoot(this.firstFamilyRangePath);
			return rangeAtom.values;
		} else {
			return null;
		}		
	}

	get __secondFamilyRangeValues() {
		if (this.firstFamilyRangePath) {
			var rangeAtom = this.getChildFromRoot(this.firstFamilyRangePath);
			return rangeAtom.values;
		} else {
			return null;
		}
	}

	

	collectProbeDataAndFillTable(table, monitor) {

		monitor.info('Filling probe table...');

		

		var domainRangeValues = null;
		if (this.domainRangePath) {
			var rangeAtom = this.getChildFromRoot(this.domainRangePath);
			domainRangeValues = rangeAtom.values;
		}
				
		var columnNames = SweepProbe.__createColumnNames(this.domainLabel, this.probeLabel, this.firstFamilyRangeValues, this.secondFamilyRangeValues);

		
		//get probe table relative path
		var firstProbeTableRelativePath = this.firstProbeTablePath.substring(this.sweepOutputPath.length+1);
		var pathItems = firstProbeTableRelativePath.split('.');
		var firstPrefix = pathItems[0];
		var firstIndex = firstPrefix.length + 1;
		var relativeProbeTablePath = firstProbeTableRelativePath.substring(firstIndex);

		//get probe table prefix
		var prefix = this.getProbeTablePrefix(firstPrefix);

		this.__fillProbeTable(table, domainRangeValues, columnNames, this.sweepOutputPath, relativeProbeTablePath, prefix);

		monitor.info('Filled probe table.');

	}

	__fillProbeTable(table, domainRangeValues, columnNames, sweepOutputPath, relativeProbeTablePath, prefix) {
		
		var probeRowIndex = parseInt(this.rowIndex);		
		var columnIndex = parseInt(this.columnIndex);

		var sweepIndex = 1;
		for (var rowIndex = 0; rowIndex < domainRangeValues.length; rowIndex++) {

			var row = new Row(table);
			
			var domainValue = domainRangeValues[rowIndex];
			var isQuantity = domainValue instanceof Quantity;
			if (isQuantity) {				
				domainValue = domainValue.value;
			}
			row.setEntry(columnNames[0], domainValue);
			
			for (var columnIndex = 1; columnIndex < columnNames.length; columnIndex++) {
				var columnName = columnNames[columnIndex];
				var tablePath = sweepOutputPath + '.' + prefix + sweepIndex + '.' + relativeProbeTablePath;
				var value = this.getProbeValue(tablePath, probeRowIndex, columnIndex);
				row.setEntry(columnName, value);				
				sweepIndex++;
			}
			
			table.addRow(row);

		}
	}

	getProbeTablePrefix(firstPrefix) {
		var idSeparator = '#';
		var prefixItems = firstPrefix.split(idSeparator);
		var prefix = prefixItems[0] + idSeparator;
		return prefix;
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

	getProbeValue(probeTablePath, rowIndex, columnIndex) {		
		var table = this.getChildFromRoot(probeTablePath);		
		var columnHeader = table.headers[columnIndex];
		var row = table.row(rowIndex);
		if(!row){
			var maxIndex = table.rows.length-1;
			var message = 'Could not get probe row with zero based index '+ rowIndex +' from table "' 
							+ probeTablePath + '" (max index: ' + maxIndex + ' rows).'; 
			throw new Error(message)
		}
		return row.entry(columnHeader);		
	}	

}