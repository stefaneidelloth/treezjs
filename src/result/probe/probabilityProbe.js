

export default class ProbabilityProbe extends Probe {

	constructor(name) {
		super(name);
		this.image = 'probability.png';
		this.domainLabel = 'Time';
		this.domainRange = [];
		
		this.rangeLabel = 'y';
		
		this.tubleListLabel = 'tubleList';
		this.tupleList = [];
		
		this.probeName = 'probe';
		this.propabilityOutput = '';
		this.firstProbeTable = '';
		this.probeColumnIndex = 0;
		this.probeRowIndex = 0;
		
	}

	createComponentControl(tabFolder){    
	     
		const page = tabFolder.append('treez-tab')
            .label('Data');
					
		this.__createDomainSection(page);
		this.__createRangeSection(page);
		this.__createTupleListSection(page);		
		this.__crateProbeSection(page);
	 }
	
	__createDomainSection(page){
		Section timeSection = page.createSection("timeSection", "Time");
		timeSection.createSectionAction("action", "Run probe", () -> execute(treeView));

		TextField timeLabelField = timeSection.createTextField(timeLabel, this, "Year");
		timeLabelField.setLabel("Label for time axis");
		ModelPath timeRangePath = timeSection.createModelPath(timeRange, this, "", VariableRange.class, this);
		timeRangePath.setLabel("Range for time axis");
		timeRangePath.setSelectionType(ModelPathSelectionType.FLAT);
		//timeRangePath.set("root.studies.picker.time");
	}
	
	__createRangeSection(page){
		Section ySection = page.createSection("ySection", "Y");

		TextField yLabelField = ySection.createTextField(yLabel, this, "y");
		yLabelField.setLabel("Label for y-Axis");
	}
	
	__createTupleListSection(page){
		Section tupleListSection = page.createSection("tupleList", "Tuple list");
		tupleListSection.setExpanded(false);

		//tupleListSection.createTextField(tupleListLabel, "tupleListLabel", "Label for first family", "family1");
		//tupleListSection.createModelPath(tupleList, this, "Range for first family", "",
		//		VariableRange.class, this);
	}	
	
	__crateProbeSection(page){
		Section probeSection = page.createSection("probe", "Probe");

		TextField probeNameField = probeSection.createTextField(probeName, this, "MyProbe");
		probeNameField.setLabel("Name");
		ModelPath sweepOutputModelPath = probeSection.createModelPath(propabilityOutput, this, "", OutputAtom.class,
				this);
		sweepOutputModelPath.setLabel("Probability output");

		ModelPath firstProbeTablePath = probeSection.createModelPath(firstProbeTable, this, sweepOutputModelPath,
				Table.class);
		firstProbeTablePath.setLabel("First probe table");

		TextField columnIndex = probeSection.createTextField(probeColumnIndex, this, "0");
		columnIndex.setLabel("Column index");
		TextField rowIndex = probeSection.createTextField(probeRowIndex, this, "0");
		rowIndex.setLabel("Row index");
	}

	
	afterCreateControlAdaptionHook() {
		this.__updateRelativePathRoots();
	}

	__updateRelativePathRoots() {		
		this.__firstProbeTableSelection.updateRelativeRootAtom();
	}

	createTableColumns(table, monitor) {

		monitor.info('Creating table columns...');

		//create column blueprints
		var columnBlueprints = [];

		//domain column----------------------------------------
		var domainLabelString = this.domainLabel;
		var domainColumnName = domainLabelString;
		var domainType = this.__domainType;
		var timeColumnType = ColumnType.getType(domainType);
		var domainLegend = domainLabelString;
		columnBlueprints.add(new ColumnBlueprint(domainColumnName, domainColumnType, domainLegend));

		//range columns---------------------------------------

		//get range information
		var yLabelString = this.__yLabel;
		var yColumnType = ColumnType.string;

		//get tuple information
		var tupleListLabelString = this.tupleListLabel;
		var tupleList = this.__tupleList;

		//create y column names, types and legends
		var tupleIndex = 1;
		for (var tuple of tupleList) {
			var columnName = yLabelString + '#' + tupleIndex;
			var tupleResultValueString = '' + tuple;
			var legendText = tupleListLabelString + ': ' + tupleResultValueString;
			columnBlueprints.add(new ColumnBlueprint(columnName, yColumnType, legendText));

			tupleIndex++;
		}

		//create columns--------------------------------------------------------------------------
		createColumns(table, columnBlueprints);

		monitor.info('Created table columns.');

	}

	get __tupleList() {
		var firstFamilyPath = tupleList.get();
	
		var firstFamilyRangeValues = null;
		if (firstFamilyPath) {
			var firstFamilyRangeAtom = this.childFromRoot(firstFamilyPath);
			firstFamilyRangeValues = firstFamilyRangeAtom.getRange();
		} else {
			var message = 'At least the first family range needs to be specified.';
			throw new Error(message);
		}
		return firstFamilyRangeValues;
	}

	get __domainType() {
		var domainPath = this.domainRange;
		if(!domainPath){
			return null;
		}
		
		var domainRangeAtom = this.childFromRoot(domainPath);
		return domainRangeAtom.type;

	}

	collectProbeDataAndFillTable(table, monitor) {

		monitor.info('Filling probe table...');

		//get time information
		var timeLabelString = timeLabel.get();
		var timePath = timeRange.get();
		var timeIsSpecified = !"".equals(timePath);
		var timeRangeAtom = null;

		var timeRangeValues = null;
		if (timeIsSpecified) {
			timeRangeAtom = this.childFromRoot(timePath);
			timeRangeValues = timeRangeAtom.getRange();
		}

		//get y information
		var yLabelString = yLabel.get();

		//get tuple information
		var tupleyPath = tupleList.get();
		var tupleListValues = getTupleValues(tupleyPath);

		//column names
		var columnNames = createColumnNames(timeLabelString, yLabelString, tupleListValues);

		//get sweep output path
		var sweepOutputPath = propabilityOutput.get();

		//get probe table relative path
		var firstProbeTableRelativePath = getFirstProbeRelativePath();
		var pathItems = firstProbeTableRelativePath.split("\\.");
		var firstPrefix = pathItems[0];
		var firstIndex = firstPrefix.length() + 1;
		var relativeProbeTablePath = firstProbeTableRelativePath.substring(firstIndex);

		//get probe table prefix
		var prefix = getProbeTablePrefix(firstPrefix);

		fillProbeTable(table, timeRangeValues, columnNames, sweepOutputPath, relativeProbeTablePath, prefix);

		monitor.info("Filled probe table.");

	}

	__fillProbeTable(
			table,
			 xRangeValues,
			 columnNames,
			 sweepOutputPath,
			 relativeProbeTablePath,
			 prefix
	) {
		//get probe table row index
		var probeRowId = Integer.parseInt(probeRowIndex.get());

		//get probe table column index
		var probeColumnId = Integer.parseInt(probeColumnIndex.get());

		var sweepIndex = 1;
		for (var rowIndex = 0; rowIndex < xRangeValues.size(); rowIndex++) {

			//create new row
			var row = new Row(table);

			//fill x column entry
			var xValue = xRangeValues.get(rowIndex);
			var isQuantity = xValue instanceof Quantity;
			if (isQuantity) {
				//only take numeric value (="remove" unit)
				
				xValue = quantity.number;
			}
			row.setEntry(columnNames.get(0), xValue);

			//fill y column entries
			for (var columnIndex = 1; columnIndex < columnNames.size(); columnIndex++) {
				var yColumnName = columnNames.get(columnIndex);
				var tablePath = sweepOutputPath + "." + prefix + sweepIndex + "." + relativeProbeTablePath;
				var yValue = getProbeValue(tablePath, probeRowId, probeColumnId);
				row.setEntry(yColumnName, yValue);

				//increase sweep index
				sweepIndex++;
			}

			//add row
			table.addRow(row);

		}
	}

	probeTablePrefix(firstPrefix) {
		var idSeparator = 'Id';
		var prefixItems = firstPrefix.split(idSeparator);
		return prefixItems[0] + idSeparator;
		
	}

	get __firstProbeRelativePath() {
		return this.__firstProbleTableSelection.relativePath;		
	}

	createColumnNames(xLabelString, yLabelString, firstFamilyRangeValues) {
		
		var columnNames = [];

		//create first column info (=x column)
		var xColumnName = this.xLabelString;
		columnNames.add(xColumnName);

		//create remaining column info (=y columns)
		for (var firstFamilyIndex = 1; firstFamilyIndex <= firstFamilyRangeValues.length; firstFamilyIndex++) {
			var columnName = yLabelString + '#' + firstFamilyIndex;
			columnNames.push(columnName);
		}
		return columnNames;
	}

	tupleValues(firstFamilyPath) {
		
		var firstFamilyRangeValues = null;
		if (this.firstFamilyPath) {
			var firstFamilyRangeAtom = this.childFromRoot(this.firstFamilyPath);
			firstFamilyRangeValues = firstFamilyRangeAtom.range;
		} else {
			var message = 'At least the first family range needs to be specified.';
			throw new Error(message);
		}
		return firstFamilyRangeValues;
	}

	probeValue(probeTablePath, rowIndex, columnIndex) {
		
		var probeTable = this.childFromRoot(probeTablePath);
		
		var columnHeader = probeTable.headers[columnIndex];
		var row = probeTable.rows[rowIndex];
		return  row.entry(columnHeader);
	
	}


}
