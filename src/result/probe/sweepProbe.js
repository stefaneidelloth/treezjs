import Probe from './probe.js';
import SweepOutput from './../../study/sweep/sweepOutput.js';
import Table from './../../data/table/table.js';
import VariableRange from './../../study/range/variableRange.js';
import ColumnBlueprint from './../../data/column/columnBlueprint.js'; 

/**
 * Collects data from a sweep parameter variation and puts it in a single (probe-) table. That table can easier be used
 * to produce plots than the distributed sweep results.
 */
export default class SweepProbe extends Probe {

	constructor(name) {
		super(name);		
		this.image = 'sweep.png';
		
		this.columnNameSeparator = '_'; 
		
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
		this.probeColumnIndex = 0;
		this.probeRowIndex = 0;

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
			.bindValue(this, ()=>this.probeColumnIndex);

		sectionContent.append('treez-text-field')
			.label('Row index')
			.bindValue(this, ()=>this.probeRowIndex);		
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
						columnBlueprints.push(new ColumnBlueprint(extendedColumnName, probeColumnType, extendedLegendText));
						secondFamilyIndex++;
					}
				} else {
					columnBlueprints.push(new ColumnBlueprint(columnName, probeColumnType, legendText));
				}
				firstFamilyIndex++;
			}
		} else {			
			columnBlueprints.push(new ColumnBlueprint(this.probeLabel, probeColumnType, ''));
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
		var columnIndex = parseInt(this.probeColumnIndex);
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
		
		var firstFamilyRangeValues = getFirstFamilyRangeValues();
		var secondFamilyRangeValues = getSecondFamilyRangeValues();

		var columnNames = this.createColumnNames(this.domainLabel, this.probeLabel, firstFamilyRangeValues, secondFamilyRangeValues);

		
		//get probe table relative path
		var firstProbeTableRelativePath = this.firstProbeTablePath;
		var pathItems = firstProbeTableRelativePath.split('\\.');
		var firstPrefix = pathItems[0];
		var firstIndex = firstPrefix.length + 1;
		var relativeProbeTablePath = firstProbeTableRelativePath.substring(firstIndex);

		//get probe table prefix
		var prefix = this.getProbeTablePrefix(firstPrefix);

		fillProbeTable(table, xRangeValues, columnNames, sweepOutputPath, this.relativeProbeTablePath, prefix);

		LOG.info('Filled probe table.');

	}

	fillProbeTable(table, domainRangeValues, columnNames, sweepOutputPath, relativeProbeTablePath, prefix) {
		
		var probeRowIndex = parseInt(this.probeRowIndex);		
		var probeColumnIndex = parseInt(this.probeColumnIndex);

		var sweepIndex = 1;
		for (var rowIndex = 0; rowIndex < xRangeValues.length; rowIndex++) {

			var row = new Row(table);
			
			var domainValue = domainRangeValues[rowIndex];
			var isQuantity = xValue instanceof Quantity;
			if (isQuantity) {
				//only take numeric value (='remove' unit)
				xValue = xValue.value;
			}
			row.setEntry(columnNames[0], xValue);
			
			for (var columnIndex = 1; columnIndex < columnNames.length; columnIndex++) {
				var columnName = columnNames[columnIndex];
				var tablePath = sweepOutputPath + '.' + prefix + sweepIndex + '.' + relativeProbeTablePath;
				var value = this.getProbeValue(tablePath, probeRowId, probeColumnId);
				row.setEntry(clumnName, value);				
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

	static createColumnNames(xColumnName, yColumnName, firstFamilyRangeValues, secondFamilyRangeValues) {
		
		var columnNames = [];		
		columnNames.add(xColumnName);		
		if (firstFamilyRangeValues) {
			for (var firstFamilyIndex = 1; firstFamilyIndex <= firstFamilyRangeValues.length; firstFamilyIndex++) {
				var columnName = yColumnName + this.columnNameSeparator + firstFamilyIndex;
				if (secondFamilyIsSpecified) {
					for (var secondFamilyIndex = 1; secondFamilyIndex <= secondFamilyRangeValues.length; secondFamilyIndex++) {
						var extendedColumnName = columnName + this.columnNameSeparator + secondFamilyIndex;
						columnNames.add(extendedColumnName);
					}
				} else {
					columnNames.add(columnName);
				}
			}
		} else {			
			columnNames.add(yColumnName);
		}
		return columnNames;
	}

	getProbeValue(probeTablePath, rowIndex, columnIndex) {		
		var table = this.getChildFromRoot(probeTablePath);		
		var columnHeader = table.headers[columnIndex];
		var row = table.getRow(rowIndex);
		return row.getEntry(columnHeader);		
	}	

}