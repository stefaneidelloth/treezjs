import PagedGraphicsAtom from './../graphics/pagedGraphicsAtom.js';

export default class Xy extends PagedGraphicsAtom {

	constructor(name){
		super(name);
		this.image = 'xy.png';
		this.__xySelection = undefined;		
	}
	
	createPageFactories() {

		var factories = [];
		
		this.data = new Data();
		factories.push(this.data);

		this.area = new Area();
		factories.push(this.area);

		this.line = new Line();
		factories.push(this.line);

		this.symbol = new Symbol();
		factories.push(this.symbol);

		//errorBar = new ErrorBar();
		//label = new Label();
		
		return factories;
	}

	plot(dTreez, graphOrXySeriesSelection, graphRectSelection, treeView) {
		
		this.__treeView = treeView;

		//remove old xy group if it already exists
		graphOrXySeriesSelection //
				.select('#' + name) //
				.remove();

		//create new axis group
		this.__xySelection = graphOrXySeriesSelection //
				.insert('g', '.axis') //
				.className('xy') //
				.onClick(this);
		
		this.bindString(()=>this.name, this.__xySelection, 'id');
		
		this.__updatePlot(dTreez);

		return xySelection;
	}

	__updatePlot(dTreez) {
		this.__contributeDataForAutoScale(dTreez);
		this.__plotWithPages(dTreez);
	}

	__plotWithPages(dTreez) {
		for (var pageFactory of this.__pageFactories) {
			pageFactory.plot(dTreez, this.__xySelection, null, this);
		}
	}

	__contributeDataForAutoScale(dTreez) {

		var xScaleChanged = this.__contributeDataForXAxis();
		var yScaleChanged = this.__contributeDataForYAxis();
		if (xScaleChanged || yScaleChanged) {
			this.graph.updatePlotForChangedScales(dTreez);
		}
	}

	__contributeDataForXAxis() {
		var xScaleChanged = false;		
		var xAxisIsOrdinal = this.xAxis.isOrdinal();
		if (xAxisIsOrdinal) {
			var oldNumberOfXValues = xAxis.numberOfValues;			
			xAxis.includeOrdinalValuesForAutoScale(this.ordinalXValues);			
			xScaleChanged = this.numberOfXValues != oldNumberOfXValues;

		} else {
			var oldXLimits = xAxis.quantitativeLimits;
			xAxis.includeDataForAutoScale(this.quantitativeXValues);
			var xLimits = xAxis.quantitativeLimits;
			if(xLimits[0] !== oldXLimits[0]){
				xScaleChanged = true;
			}
			if(xLimits[1] !== oldXLimits[1]){
				xScaleChanged = true;
			}			
		}
		return xScaleChanged;
	}
	
	__contributeDataForYAxis() {
		var yScaleChanged = false;		
		var yAxisIsOrdinal = this.yAxis.isOrdinal();
		if (yAxisIsOrdinal) {
			var oldNumberOfYValues = yAxis.numberOfValues;			
			yAxis.includeOrdinalValuesForAutoScale(this.ordinalYValues);			
			yScaleChanged = this.numberOfYValues != oldNumberOfYValues;

		} else {
			var oldYLimits = yAxis.quantitativeLimits;
			yAxis.includeDataForAutoScale(this.quantitativeYValues);
			var yLimits = yAxis.quantitativeLimits;
			if(yLimits[0] !== oldYLimits[0]){
				yScaleChanged = true;
			}
			if(yLimits[1] !== oldYLimits[1]){
				yScaleChanged = true;
			}			
		}
		return yScaleChanged;
	}

	get graph() {		
		if (this.parent instanceof Graph) {
			return this.parent;
		} else {
			var grandParent = this.parent.parent;
			return grandParent;
		}
	}

	addLegendContributors(legendContributors) {
		if (this.providesLegendEntry) {
			legendContributors.add(this);
		}
	}

	get providesLegendEntry() {
		return this.legendText.length > 0;
	}

	get legendText() {
		return data.legendText;
	}

	createLegendSymbolGroup(dTreez , parentSelection, symbolLengthInPx, treeView) {
		var symbolSelection = parentSelection //
				.append('g') //
				.classed('xy-legend-entry-symbol', true);

		this.line.plotLegendLine(dTreez, symbolSelection, symbolLengthInPx);
		this.symbol.plotLegendSymbol(dTreez, symbolSelection, symbolLengthInPx / 2, treeView);

		return symbolSelection;
	}

	createXyDataString(xDataValues, yDataValues) {

		var xLength = xDataValues.length;
		var yLength = yDataValues.length;
		var lengthsAreOk = xLength == yLength;
		if (!lengthsAreOk) {
			var message = 'The x and y data has to be of equal size but size of x data is ' + xLength
					+ ' and size of y data is ' + yLength;
			throw new Error(message);
		}

		if (xLength == 0) {
			return '[]';
		}

		var firstXObject = xDataValues[0];
		var xIsOrdinal = firstXObject instanceof String;

		var xAxisIsOrdinal = this.xAxis.isOrdinal;

		var firstYObject = yDataValues[0];
		var yIsOrdinal = firstYObject instanceof String;

		var yAxisIsOrdinal = this.yAxis.isOrdinal;

		var rowList =[];
		for (var rowIndex = 0; rowIndex < xLength; rowIndex++) {

			var xObj = xDataValues[rowIndex];
			var x = xObj.toString();
			if (xIsOrdinal) {
				if (xAxisIsOrdinal) {
					x = '"' + x + '"';
				} else {
					x = '' + (xDataValues.indexOf(xObj) + 1);
				}

			}

			var yObj = yDataValues[rowIndex];
			var y = yObj.toString();
			if (yIsOrdinal) {
				if (yAxisIsOrdinal) {
					y = '"' + y + '"';
				} else {
					y = '' + (yDataValues.indexOf(xObj) + 1);
				}
			}

			var rowString = '[' + x + ',' + y + ']';
			rowList.add(rowString);
		}
		var xyDataString = '[' + rowList.join(',') + ']';
		return xyDataString;
	}

	get xScale() {	
		return this.xAxis
			?this.xAxis.scale
			:null;
	}

	get yScale() {		
		return this.yAxis
				?this.yAxis.scale
				:null;
	}

	get xAxis() {
		var xAxisPath = data.xAxis;
		if (!xAxisPath) {
			return null;
		}
		return this.getChildFromRoot(xAxisPath);		
	}

	get yAxis() {
		var yAxisPath = data.yAxis;
		if (!yAxisPath) {
			return null;
		}
		return this.getChildFromRoot(yAxisPath);		
	}

	get xValues() {
		var xDataPath = data.xData;
		if (!xDataPath) {
			return [];
		}
		var xDataColumn = this.getChildFromRoot(xDataPath);
		return xDataColumn.values;
	}
	
	get yValues() {
		var yDataPath = data.yData;
		if (!yDataPath) {
			return [];
		}
		var yDataColumn = this.getChildFromRoot(yDataPath);
		return yDataColumn.values;
	}	

	get quantitativeXValues() {
		var xDataPath = data.xData;
		if (!xDataPath) {
			return [];
		}
		var xDataColumn = this.getChildFromRoot(xDataPath);
		var isQuantitative = xDataColumn.isNumeric();
		if (isQuantitative) {
			return xDataColumn.doubleValues;			
		} else {
			var ordinalValues = xDataColumn.stringValues;
			var xValues = [];
			for (var x = 1.0; x <= ordinalValues.length; x++) {
				xValues.push(x);
			}
			return xValues;
		}
	}

	get quantitativeYValues() {
		var yDataPath = data.yData;
		if (!yDataPath) {
			return [];
		}
		var yDataColumn = this.getChildFromRoot(yDataPath);
		var isQuantitative = yDataColumn.isNumeric();
		if (isQuantitative) {
			return yDataColumn.doubleValues;			
		} else {
			var ordinalValues = yDataColumn.stringValues;
			var yValues = [];
			for (var y = 1.0; y <= ordinalValues.length; y++) {
				yValues.push(y);
			}
			return yValues;
		}
	}

	get ordinalXValues() {
		var xDataPath = data.xData;
		if (!xDataPath) {
			return [];
		}
		var xDataColumn = this.getChildFromRoot(xDataPath);
		return xDataColumn.stringValues;
	}

	get ordinalYValues() {
		var yDataPath = data.yData;
		if (!yDataPath) {
			return [];
		}
		var yDataColumn = this.getChildFromRoot(yDataPath);
		return yDataColumn.stringValues;
	}

}
