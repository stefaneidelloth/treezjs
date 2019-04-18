import PagedGraphicsAtom from './../graphics/pagedGraphicsAtom.js';

export default class Xy extends PagedGraphicsAtom {

	constructor(name){
		super(name);
		this.image = 'bar.png'
		this.__barSelection=undefined;
	}

	createPageFactories() {

		var factories = [];
		
		this.data = Data.create();
		factories.push(this.data);

		this.fill = Fill.create();
		factories.push(this.fill);

		this.line = Line.create();
		factories.push(this.line);

		//label = Label.create();
		//errorBar = new ErrorBar();
		
		return factories;

	}

	plot(dTreez, graphOrBarSeriesSelection, graphRectSelection, treeView) {
		
		this.treeView = treeView;

		//remove old bar group if it already exists
		graphOrBarSeriesSelection //
				.select('#' + name) //
				.remove();

		//create new axis group
		barSelection = graphOrBarSeriesSelection //
				.insert('g', '.axis') //
				.className('bar') //
				.onClick(()=>this.handleMouseClick());
		
		
		this.bindString(()=>this.name, xySelection, 'id');

		this.__updatePlot(dTreez);

		return barSelection;
	}

	updatePlot(dTreez) {
		this.__contributeDataForAutoScale(dTreez);
		this.plotWithPages(dTreez);
	}

	__contributeDataForAutoScale(dTreez) {

		var horizontalScaleChanged = false;
		var verticalScaleChanged = false;

		var isVerticalBar = data.barDirection.isVertical;
		if (isVerticalBar) {
			horizontalScaleChanged = this.__contributePositionValuesToHorizontalAxis();
			verticalScaleChanged = this.__contributeLengthValuesToVerticalAxis();
		} else {
			horizontalScaleChanged = this.__contributeLengthValuesToHorizontalAxis();
			verticalScaleChanged = this.__contributePositionValuesToVerticalAxis();
		}

		if (horizontalScaleChanged || verticalScaleChanged) {			
			this.graph.updatePlotForChangedScales(dTreez);
		}

	}

	__contributePositionValuesToHorizontalAxis() {
		
		if (this.horizontalAxis.isQuantitative) {			

			var oldHorizontalLimits = horizontalAxis.quantitativeLimits;
			horizontalAxis.includeDataForAutoScale(this.quantitativePositions);			
			var horizontalLimits = horizontalAxis.quantitativeLimits;

			var horizontalScaleChanged = ('' + oldHorizontalLimits) !== ('' + horizontalLimits);
			return horizontalScaleChanged;

		} else {		

			var oldNumberOfValues = horizontalAxis.numberOfValues;
			horizontalAxis.includeOrdinalValuesForAutoScale(this.ordinalPositions);
			var numberOfValues = horizontalAxis.numberOfValues;

			var horizontalScaleChanged = numberOfValues != oldNumberOfValues;
			return horizontalScaleChanged;

		}

	}

	__contributeLengthValuesToVerticalAxis() {

		var verticalAxis = this.verticalAxis;		
		if (verticalAxis.isQuantitative) {
			var oldVerticalLimits = verticalAxis.quantitativeLimits;
			verticalAxis.includeDataForAutoScale(this.quantitativeLengths);
			var verticalLimits = verticalAxis.quantitativeLimits;

			var verticalScaleChanged = ('' + verticalLimits) !== ('' + oldVerticalLimits);
			return verticalScaleChanged;

		} else {
			var oldNumberOfValues = verticalAxis.numberOfValues;
			verticalAxis.includeOrdinalValuesForAutoScale(this.ordinalLengths);
			var numberOfValues = verticalAxis.numberOfValues;

			var verticalScaleChanged = numberOfValues !== oldNumberOfValues;
			return verticalScaleChanged;
		}
	}

	__contributePositionValuesToVerticalAxis() {

		var verticalAxis = this.verticalAxis;		
		if (verticalAxis.isQuantitative) {
			var oldVerticalLimits = verticalAxis.getQuantitativeLimits();
			verticalAxis.includeDataForAutoScale(this.quantitativePositions);
			var verticalLimits = verticalAxis.getQuantitativeLimits();

			var verticalScaleChanged = ('' + verticalLimits) !== ('' + oldVerticalLimits);
			return verticalScaleChanged;
		} else {
			var oldNumberOfValues = verticalAxis.numberOfValues;
			verticalAxis.includeOrdinalValuesForAutoScale(this.ordinalPositions);
			var numberOfValues = verticalAxis.numberOfValues;

			var verticalScaleChanged = numberOfValues != oldNumberOfValues;
			return verticalScaleChanged;
		}

	}

	__contributeLengthValuesToHorizontalAxis() {

		var horizontalAxis = this.horizontalAxis;		
		if (horizontalAxis.isQuantitative) {
			var oldHorizontalLimits = horizontalAxis.getQuantitativeLimits();
			horizontalAxis.includeDataForAutoScale(this.quantitativeLengths);
			var horizontalLimits = horizontalAxis.getQuantitativeLimits();

			var horizontalScaleChanged = ('' + horizontalLimits) !== ('' + oldHorizontalLimits);
			return horizontalScaleChanged;

		} else {			
			var oldNumberOfValues = horizontalAxis.numberOfValues;
			horizontalAxis.includeOrdinalValuesForAutoScale(this.ordinalLength);
			var numberOfValues = horizontalAxis.numberOfValues;

			var horizontalScaleChanged = numberOfValues != oldNumberOfValues;
			return horizontalScaleChanged;
		}
	}

	get graph() {
		
		var parentIsGraph = this.parent instanceof Graph;
		if (parentIsGraph) {
			return this.parent;
		} else {
			return this.parent.parent;			
		}
	}

	__plotWithPages(dTreez) {
		for (var pageFactory of this.pageFactories) {
			pageFactory.plot(dTreez, this.__barSelection, null, this);
		}
	}

	addLegendContributors(legendContributors) {
		if (this.providesLegendEntry) {
			legendContributors.add(this);
		}
	}

	get  providesLegendEntry() {
		return !this.lengendText.length > 0;
	}

	get legendText() {
		return this.data.legendText;
	}

	createLegendSymbolGroup(dTreez, parentSelection, symbolLengthInPx, treeView) {
		var symbolSelection = parentSelection //
				.append('rect') //
				.classed('bar-legend-entry-symbol', true);

		this.fill.formatLegendSymbol(symbolSelection, symbolLengthInPx);
		this.line.formatLegendSymbolLine(symbolSelection, refreshable);

		return symbolSelection;
	}

	getBarDataString(positionAxisIsOrdinal, lengthAxisIsOrdinal) {
		
		var lengthDataValues = this.lengthDataValues;
        var positionDataValues = this.positionDataValues;
        
		var lengthSize = lengthDataValues.length;
		var positionSize = positionDataValues.length;
		this.__assertEqualSizes(lengthSize, positionSize);

		if (lengthSize == 0) {
			return '[]';
		}

		var firstPosition = positionDataValues[0];
		var positionsAreOrdinal = firstPosition instanceof String;

		var firstLength = lengthDataValues[0];
		var lengthsAreOrdinal = firstLength instanceof String;

		var rowList = [];
		for (var rowIndex = 0; rowIndex < lengthSize; rowIndex++) {

			var positionDatum = positionDataValues[rowIndex];
			
			var position = '' + positionDatum;
			if (positionsAreOrdinal) {
				if (positionAxisIsOrdinal) {
					position = '"' + position + '"';
				} else {
					position = '' + (positionDataValues.indexOf(positionDatum) + 1);
				}

			}

			var lengthDatum = lengthDataValues[rowIndex];
			var length = '' + lengthDatum;
			if (lengthsAreOrdinal) {
				if (lengthAxisIsOrdinal) {
					length = '"' + length + '"';
				} else {
					length = '' + (lengthDataValues.indexOf(lengthDatum) + 1);
				}

			}

			var rowString = '[' + position + ',' + length + ']';
			rowList.push(rowString);
		}
		
		return '[' + rowList.join(',') + ']';
		
	}

	__assertEqualSizes(lengthSize, positionSize) {
		var sizesAreOk = lengthSize === positionSize;
		if (!sizesAreOk) {
			var message = 'The length and position data has to be of equal size but size of length data is '
					+ lengthSize + ' and size of position data is ' + positionSize;
			throw new Error(message);
		}
	}

	get numberOfPositionValues() {
		return this.positionData.length;		
	}

	get smallestPositionDistance() {

		var smallestDistance = Number.MAX_VALUE;

		var positionDataValues = this.positionData;
		var positionSize = positionDataValues.length;

		if (positionSize > 1) {

			var firstPosition = positionDataValues[0];
			var isOrdinal = firstPosition instanceof String;
			if (isOrdinal) {
				return 1;
			}

			for (var positionIndex = 1; positionIndex < positionSize; positionIndex++) {
				var leftPositionObj = positionDataValues[positionIndex - 1];
				var leftPosition = parseFloat('' +leftPositionObj);

				var rightPositionObj = positionDataValues[positionIndex];
				var rightPosition = parseFloat('' + rightPositionObj);

				var distance = Math.abs(rightPosition - leftPosition);
				if (distance < smallestDistance) {
					smallestDistance = distance;
				}
			}
			return smallestDistance;
		} else {
			return 0;
		}

	}

	get horizontalScale() {
		return this.horizontalAxis
			?this.horizontalAxis.scale
			:null;		
	}

	get verticalScale() {
		return this.verticalAxis
		?this.verticalAxis.scale
		:null;

	}

	get horizontalAxis() {	
		if (!this.data.horizontalAxis) {
			return null;
		}
		return this.childFromRoot(this.data.horizontalAxis);		
	}
	
	get verticalAxis() {	
		if (!this.data.verticalAxis) {
			return null;
		}
		return this.childFromRoot(this.data.verticalAxis);		
	}

	get lengthData() {		
		if (!this.data.barLength) {
			return [];
		}
		var lengthDataColumn = this.childFromRoot(this.data.barLength);
		return lengthDataColumn.values;		
	}

	get positionData() {
		if (!this.data.barPositions) {
			return [];
		}
		var positionDataColumn = this.childFromRoot(this.data.barPositions);
		return positionDataColumn.values;	
	}

	get quantitativePositions() {		
		if (!this.data.barPositions) {
			return[];
		}
		
		var positionColumn = this.childFromRoot(this.data.barPositions);		
		if (positionColumn.isNumeric) {
			return positionDataColumn.doubleValues;			
		} else {
			var ordinalPositionValues = positionColumn.stringValues;
			
			var positionValues = [];
			for (var position = 1.0; position <= ordinalPositionValues.length; position++) {
				positionValues.push(position);
			}
			return positionValues;
		}
	}

	get ordinalPositions() {		
		if (!this.data.barPositions) {
			return [];
		}
		var positionColumn = this.childFromRoot(this.data.barPositions);
		return positionColumn.stringValues;		
	}

	get quantitativeLengths() {		
		if (!this.data.barLengths) {
			return [];
		}

		var lengthColumn = this.childFromRoot(this.data.barLengths);		
		if (lengthColumn.isNumeric) {
			return lengthColumn.doubleValues;			
		} else {
			var ordinalLengthValues = lengthDataColumn.stringValues;
			
			var lengthValues = [];
			for (var position = 1.0; position <= ordinalLengthValues.length; position++) {
				lengthValues.push(position);
			}
			return lengthValues;
		}

	}

	get ordinalLengths() {		
		if (!this.data.barLengths) {
			return [];
		}
		var lengthColumn = this.childFromRoot(this.data.barLengths);
		return lengthColumn.stringValues;		r
	}	

}
