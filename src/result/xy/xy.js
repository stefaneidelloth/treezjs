import PagedGraphicsAtom from './../graphics/pagedGraphicsAtom.js';
import Data from './data.js';
import Area from './area.js';
import Line from './line.js';
import Symbol from './symbol.js';
import Graph from './../graph/graph.js';

export default class Xy extends PagedGraphicsAtom {

	constructor(name){
		super(name);
		this.image = 'xy.png';
		this.__xySelection = undefined;		
	}
	
	createPageFactories() {

		var factories = [];
		
		this.data = Data.create(this);
		factories.push(this.data);

		this.area = Area.create();
		factories.push(this.area);

		this.line = Line.create();
		factories.push(this.line);

		this.symbol = Symbol.create();
		factories.push(this.symbol);

		//errorBar = ErrorBar.create();
		//label = Label.create();
		
		return factories;
	}

	plot(dTreez, graphOrXySeriesSelection, graphRectSelection, treeView) {
		
		this.treeView = treeView;

		//remove old xy group if it already exists
		graphOrXySeriesSelection //
				.select('#' + this.name) //
				.remove();

		//create new axis group
		this.__xySelection = graphOrXySeriesSelection //
				.insert('g', '.axis') //
				.className('xy') //
				.onClick(()=>this.handleMouseClick());
		
		this.bindString(()=>this.name, this.__xySelection, 'id');
		
		this.__updatePlot(dTreez);

		return this.__xySelection;
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
		var axis = this.xAxis;			
		if (axis.isOrdinal) {
			var oldNumberOfXValues = axis.numberOfValues;			
			axis.includeOrdinalValuesForAutoScale(this.ordinalXValues);			
			xScaleChanged = this.numberOfXValues != oldNumberOfXValues;

		} else {
			var oldXLimits = axis.quantitativeLimits;
			axis.includeDataForAutoScale(this.quantitativeXValues);
			var xLimits = axis.quantitativeLimits;
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
		var axis = this.yAxis;			
		if (axis.isOrdinal) {
			var oldNumberOfYValues = axis.numberOfValues;			
			axis.includeOrdinalValuesForAutoScale(this.ordinalYValues);			
			yScaleChanged = this.numberOfYValues != oldNumberOfYValues;

		} else {
			var oldYLimits = axis.quantitativeLimits;
			axis.includeDataForAutoScale(this.quantitativeYValues);
			var yLimits = axis.quantitativeLimits;
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

	get xyData() {

		var xDataValues = this.xValues;
		var yDataValues = this.yValues;
		
		var xLength = xDataValues.length;
		var yLength = yDataValues.length;
		var lengthsAreOk = xLength == yLength;
		if (!lengthsAreOk) {
			var message = 'The x and y data has to be of equal size but size of x data is ' + xLength
					+ ' and size of y data is ' + yLength;
			throw new Error(message);
		}

		if (xLength == 0) {
			return [];
		}

		var firstXObject = xDataValues[0];
		var xIsOrdinal = (typeof firstXObject === 'string' || firstXObject instanceof String); 

		var xAxisIsOrdinal = this.xAxis.isOrdinal;

		var firstYObject = yDataValues[0];
		var yIsOrdinal = (typeof firstYObject === 'string' || firstYObject instanceof String); 

		var yAxisIsOrdinal = this.yAxis.isOrdinal;

		var rowList =[];
		for (var rowIndex = 0; rowIndex < xLength; rowIndex++) {
			
			var xObj = xDataValues[rowIndex];
			var x = xObj;
			if (xIsOrdinal) {
				if (!xAxisIsOrdinal) {					
					x = rowIndex + 1;
				}
			}

			var yObj = yDataValues[rowIndex];
			var y = yObj;
			if (yIsOrdinal) {
				if (!yAxisIsOrdinal) {
					try{
						y = parseFloat(yObj);
					} catch(error){
						y = rowIndex + 1;
					}				
					
				}
			}

			rowList.push([x,y]);
		}		
		return rowList;
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
		var xAxisPath = this.data.xAxis;
		if (!xAxisPath) {
			return null;
		}
		return this.childFromRoot(xAxisPath);		
	}

	get yAxis() {
		var yAxisPath = this.data.yAxis;
		if (!yAxisPath) {
			return null;
		}
		return this.childFromRoot(yAxisPath);		
	}

	get xValues() {
		var xDataPath = this.data.xData;
		if (!xDataPath) {
			return [];
		}
		var xDataColumn = this.childFromRoot(xDataPath);
		return xDataColumn.values;
	}
	
	get yValues() {
		var yDataPath = this.data.yData;
		if (!yDataPath) {
			return [];
		}
		var yDataColumn = this.childFromRoot(yDataPath);
		return yDataColumn.values;
	}	

	get quantitativeXValues() {
		var xDataPath = this.data.xData;
		if (!xDataPath) {
			return [];
		}
		var xDataColumn = this.childFromRoot(xDataPath);	
		if (xDataColumn.isNumeric) {
			return xDataColumn.numericValues;			
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
		var yDataPath = this.data.yData;
		if (!yDataPath) {
			return [];
		}
		var yDataColumn = this.childFromRoot(yDataPath);		
		if (yDataColumn.isNumeric) {
			return yDataColumn.numericValues;			
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
		var xDataPath = this.data.xData;
		if (!xDataPath) {
			return [];
		}
		var xDataColumn = this.childFromRoot(xDataPath);
		return xDataColumn.stringValues;
	}

	get ordinalYValues() {
		var yDataPath = this.data.yData;
		if (!yDataPath) {
			return [];
		}
		var yDataColumn = this.childFromRoot(yDataPath);
		return yDataColumn.stringValues;
	}

}
