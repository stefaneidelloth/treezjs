import PagedGraphicsAtom from './../graphics/pagedGraphicsAtom.js';
import Data from './data.js';
import Fill from './fill.js';
import Line from './line.js';
import Graph from './../graph/graph.js';

export default class Bar extends PagedGraphicsAtom {

	constructor(name){
		super(name);
		this.image = 'bar.png'
		this.__barSelection=undefined;
	}

	createPageFactories() {

		var factories = [];
		
		this.data = Data.create(this);
		factories.push(this.data);

		this.fill = Fill.create(this);
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
				.select('#' + this.name) //
				.remove();

		//create new axis group
		this.__barSelection = graphOrBarSeriesSelection //
				.insert('g', '.axis') //
				.className('bar') //
				.onClick(()=>this.handleMouseClick());
		
		
		this.bindString(()=>this.name, this.__barSelection, 'id');

		this.__updatePlot(dTreez);

		return this.__barSelection;
	}

	__updatePlot(dTreez) {
		this.__contributeDataForAutoScale(dTreez);
		this.__plotWithPages(dTreez);
	}

	__plotWithPages(dTreez) {
		for (var pageFactory of this.__pageFactories) {
			pageFactory.plot(dTreez, this.__barSelection, null, this);
		}
	}

	__contributeDataForAutoScale(dTreez) {

		var horizontalScaleChanged = false;
		var verticalScaleChanged = false;

		var isVerticalBar = this.data.barDirection.isVertical;
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

		var axis = this.horizontalAxis;
		
		if (axis.isQuantitative) {			

			var oldHorizontalLimits = axis.quantitativeLimits;
			axis.includeDataForAutoScale(this.quantitativePositions);			
			var horizontalLimits = axis.quantitativeLimits;

			var horizontalScaleChanged = ('' + oldHorizontalLimits) !== ('' + horizontalLimits);
			return horizontalScaleChanged;

		} else {		

			var oldNumberOfValues = axis.numberOfValues;
			axis.includeOrdinalValuesForAutoScale(this.ordinalPositions);
			var numberOfValues = axis.numberOfValues;

			var horizontalScaleChanged = numberOfValues != oldNumberOfValues;
			return horizontalScaleChanged;

		}

	}

	__contributeLengthValuesToVerticalAxis() {

		var axis = this.verticalAxis;		
		if (axis.isQuantitative) {
			var oldVerticalLimits = axis.quantitativeLimits;
			axis.includeDataForAutoScale(this.quantitativeLengths);
			var verticalLimits = axis.quantitativeLimits;

			var verticalScaleChanged = ('' + verticalLimits) !== ('' + oldVerticalLimits);
			return verticalScaleChanged;

		} else {
			var oldNumberOfValues = axis.numberOfValues;
			axis.includeOrdinalValuesForAutoScale(this.ordinalLengths);
			var numberOfValues = axis.numberOfValues;

			var verticalScaleChanged = numberOfValues !== oldNumberOfValues;
			return verticalScaleChanged;
		}
	}

	__contributePositionValuesToVerticalAxis() {

		var axis = this.verticalAxis;		
		if (axis.isQuantitative) {
			var oldVerticalLimits = axis.quantitativeLimits;
			axis.includeDataForAutoScale(this.quantitativePositions);
			var verticalLimits = axis.quantitativeLimits;

			var verticalScaleChanged = ('' + verticalLimits) !== ('' + oldVerticalLimits);
			return verticalScaleChanged;
		} else {
			var oldNumberOfValues = axis.numberOfValues;
			axis.includeOrdinalValuesForAutoScale(this.ordinalPositions);
			var numberOfValues = axis.numberOfValues;

			var verticalScaleChanged = numberOfValues != oldNumberOfValues;
			return verticalScaleChanged;
		}

	}

	__contributeLengthValuesToHorizontalAxis() {

		var axis = this.horizontalAxis;		
		if (axis.isQuantitative) {
			var oldHorizontalLimits = axis.quantitativeLimits;
			axis.includeDataForAutoScale(this.quantitativeLengths);
			var horizontalLimits = axis.quantitativeLimits;

			var horizontalScaleChanged = ('' + horizontalLimits) !== ('' + oldHorizontalLimits);
			return horizontalScaleChanged;

		} else {			
			var oldNumberOfValues = axis.numberOfValues;
			axis.includeOrdinalValuesForAutoScale(this.ordinalLength);
			var numberOfValues = axis.numberOfValues;

			var horizontalScaleChanged = numberOfValues != oldNumberOfValues;
			return horizontalScaleChanged;
		}
	}

	

	

	addLegendContributors(legendContributors) {
		if (this.providesLegendEntry) {
			legendContributors.add(this);
		}
	}



	createLegendSymbolGroup(dTreez, parentSelection, symbolLengthInPx, treeView) {
		var symbolSelection = parentSelection //
				.append('rect') //
				.classed('bar-legend-entry-symbol', true);

		this.fill.formatLegendSymbol(symbolSelection, symbolLengthInPx);
		this.line.formatLegendSymbolLine(symbolSelection, refreshable);

		return symbolSelection;
	}

	barDataString(positionAxisIsOrdinal, lengthAxisIsOrdinal) {
		
		var lengthData = this.lengthData;
        var positionData = this.positionData;
        
		var lengthSize = lengthData.length;
		var positionSize = positionData.length;
		this.__assertEqualSizes(lengthSize, positionSize);

		if (lengthSize == 0) {
			return '[]';
		}

		var firstPosition = positionData[0];
		var positionsAreOrdinal = firstPosition instanceof String;

		var firstLength = lengthData[0];
		var lengthsAreOrdinal = firstLength instanceof String;

		var rowList = [];
		for (var rowIndex = 0; rowIndex < lengthSize; rowIndex++) {

			var positionDatum = positionData[rowIndex];
			
			var position = '' + positionDatum;
			if (positionsAreOrdinal) {
				if (positionAxisIsOrdinal) {
					position = '"' + position + '"';
				} else {
					position = '' + (positionData.indexOf(positionDatum) + 1);
				}

			}

			var lengthDatum = lengthData[rowIndex];
			var length = '' + lengthDatum;
			if (lengthsAreOrdinal) {
				if (lengthAxisIsOrdinal) {
					length = '"' + length + '"';
				} else {
					length = '' + (lengthData.indexOf(lengthDatum) + 1);
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

	get graph() {
		
		var parentIsGraph = this.parent instanceof Graph;
		if (parentIsGraph) {
			return this.parent;
		} else {
			return this.parent.parent;			
		}
	}

	get  providesLegendEntry() {
		return !this.lengendText.length > 0;
	}

	get legendText() {
		return this.data.legendText;
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
		if (!this.data.barLengths) {
			return [];
		}
		var lengthDataColumn = this.childFromRoot(this.data.barLengths);
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
			return [];
		}
		
		var positionColumn = this.childFromRoot(this.data.barPositions);		
		if (positionColumn.isNumeric) {
			return positionColumn.numericValues;			
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
			return lengthColumn.numericValues;			
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
