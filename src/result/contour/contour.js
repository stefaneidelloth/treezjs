import PagedGraphicsAtom from './../graphics/pagedGraphicsAtom.js';
import Data from './Data.js';
import Fill from './fill.js';
import Lines from './lines.js';


export default class Contour extends PagedGraphicsAtom {

	constructor(name){
		super(name);
		this.image = 'contour.png';
		
		this.__graphSelection = undefined;	
		this.__plotly = undefined;	
	}

	createPageFactories() {
		
		var factories = [];

		this.data =  Data.create();
		factories.push(this.data);

		this.fill =  Fill.create();
		factories.push(this.fill);

		this.lines =  Lines.create();
		factories.push(this.lines);
		

		//label = Label.create();
		
		return factories;

	}

	plot(dTreez, graphSelection, graphRectSelection, treeView) {
		
		this.treeView = treeView;
		this.__graphSelection = graphSelection;
		
		//this.__plotly = new Plotly(engine);

		this.__updatePlot(dTreez);

		return graphSelection;
	}

	__updatePlot(dTreez) {

		var contourSelection = this.__recreateContourGroup();
		var plotlyLayout = this.__createPlotlyLayout();
		var plotlyData = this.__createPlotlyData();
		var plotlyConfiguration = this.__plotly.createConfiguration();
		
		this.__plotly.newPlot('dummyDiv', plotlyData, plotlyLayout, plotlyConfiguration);
		this.__movePlotlyContourFromDummyDivToContourGroup(contourSelection);
		this.__createClipPath(contourSelection);

		var fillSelection = this.__getFillSelection(contourSelection);
		this.__bindAdditionalFillAttributes(fillSelection);

		var lineSelection = this.__getLineSelection(contourSelection);
		this.__bindAdditionalLineAttributes(lineSelection);

		if (!colorbar.isHidden) {
			var colorBarSelection = ColorBar.getColorBarSelection(contourSelection);
			colorbar.bindAdditionalColorBarAttributes(colorBarSelection, dTreez, graph);
		}

	}

	__getFillSelection(contourSelection) {
		return contourSelection.select('.contour') //
				.selectAll('.contourfill, .contourbg') //
				.selectAll('path');
	}

	__bindAdditionalFillAttributes(fillSelection) {
		//TODO this.__bindTransparency(fillSelection, fill.transparency);
		
		this.fill.bindBooleanToNegatingDisplay(()=>fill.isHidden, fillSelection);
	}

	__getLineSelection(contourSelection) {
		return contourSelection.select('.contour') //
				.selectAll('.contourlevel') //
				.selectAll('path');
	}

	__bindAdditionalLineAttributes(lineSelection) {
		//TODO bindLineStyle(lineSelection, lines.style);
		//TODO bindLineTransparency(lineSelection, lines.transparency);
		
		this.lines.bindBooleanToNegatingDisplay(()=>lines.isHidden, lineSelection);
	}

	createPlotlyLayout() {
		var width = Length.toPx(graph.data.width);
		var height = Length.toPx(graph.data.height);

		var layout = this.__plotly.createLayout();
		layout.setWidth(width);
		layout.setHeight(height);
		this.__createPlotlyAxis(layout);

		var margin = this.__plotly.createZeroMargin();
		layout.setMargin(margin);

		var updateConsumer = ()=>this.updatePlot();
		
		//TODO this.addListener(()=>this.graph.data.width, updateConsumer);
		//TODO this.addListener(()=>this.graph.data.height, updateConsumer);
		
		

		return layout;
	}

	createPlotlyAxis(layout) {
		var xAxis = this.xAxis;
		var xMin = xAxis.data.min; //TODO: consider 'auto' for auto scale
		var xMax = xAxis.data.max;
		
		var yAxis = this.yAxis;
		var yMin = yAxis.data.min;
		var yMax = yAxis.data.max;

		var xAxisPlotly = this.__plotly.createAxis();
		xAxisPlotly.setRange(xMin, xMax);
		xAxisPlotly.setShowTickLabels(false);
		xAxisPlotly.setTicks('');
		layout.setXAxis(xAxisPlotly);

		var yAxisPlotly = this.__plotly.createAxis();
		yAxisPlotly.setRange(yMin, yMax);
		yAxisPlotly.setShowTickLabels(false);
		yAxisPlotly.setTicks('');
		layout.setYAxis(yAxisPlotly);
		
		var updateConsumer = ()=>this.updatePlot();

		//TODO
		//xAxisAtom.data.min.addModificationConsumer('min', updateConsumer);
		//xAxisAtom.data.max.addModificationConsumer('max', updateConsumer);

		//yAxisAtom.data.min.addModificationConsumer('min', updateConsumer);
		//yAxisAtom.data.max.addModificationConsumer('max', updateConsumer);

	}

	__createPlotlyData() {

		var singleData = this.__plotly.createSingleData();
		singleData.setType(PlotlyType.CONTOUR);
		singleData.setVisible(true);
		singleData.setOpacity(1);

		singleData.setShowScale(!colorbar.hide.get());

		var colorBar = this.colorbar.createColorBar(plotly, updateConsumer);
		singleData.setColorBar(colorBar);

		
		singleData.setX(this.xData);
		singleData.setY(this.yData);		
		singleData.setZ(this.zData);

		
		singleData.setZAuto(this.data.automaticZLimits);
		
		if (!this.data.automaticZLimits) {
			singleData.setZMin(this.data.zMin);
			singleData.setZMax(this.data.zMax);
		}
		
		singleData.setAutoContour(this.data.automaticContours);
		if (this.data.automaticContours) {
			singleData.setNContours(this.data.numberOfContours);
		} else {
			var contours = this.__createPlotlyContours();
			singleData.setContours(contours);
		}

		singleData.setConnectGaps(this.data.connectGaps);

		singleData.setColorScale(this.fill.colorScale);
		singleData.setReverseScale(this.fill.reverseScale);

		var line = this.__createPlotlyLine();
		singleData.setLine(line);

		singleData.setText(['a', 'b', 'c', 'd']);
		
		//TODO
		
		/*

		colorbar.hide.addModificationConsumer('hide', updateConsumer);

		data.xData.addModificationConsumer('xData', updateConsumer);
		data.yData.addModificationConsumer('yData', updateConsumer);
		data.zData.addModificationConsumer('zData', updateConsumer);

		data.automaticZLimits.addModificationConsumer('autoZLimits', updateConsumer);
		data.zMin.addModificationConsumer('zMin', updateConsumer);
		data.zMax.addModificationConsumer('zMax', updateConsumer);

		data.automaticContours.addModificationConsumer('autoNumberOfContours', updateConsumer);
		data.numberOfContours.addModificationConsumer('numberOfContours', updateConsumer);
		data.connectGaps.addModificationConsumer('connectGaps', updateConsumer);
		fill.colorScale.addModificationConsumer('colorScale', updateConsumer);
		fill.reverseScale.addModificationConsumer('reverseScale', updateConsumer);
		
		*/

		return singleData;
	}

	__createPlotlyContours() {
		var contours = this.__plotly.createContourOptions();
		contours.setShowLines(true);
		contours.setStart(this.data.startLevel);
		contours.setEnd(this.data.endLevel);
		contours.setSize(this.data.levelSize);
		contours.setColoring(this.data.coloring);
		
		
		//TODO
		/*

		data.startLevel.addModificationConsumer('startLevel', updateConsumer);
		data.endLevel.addModificationConsumer('endLevel', updateConsumer);
		data.levelSize.addModificationConsumer('levelSize', updateConsumer);
		data.coloring.addModificationConsumer('coloring', updateConsumer);
		*/

		return contours;
	}

	__createPlotlyLine() {
		var line = this.__plotly.createLine();
		line.setSmoothing(this.lines.smoothing);
		line.setWidth(this.lines.width);
		line.setColor(this.lines.color);

		//TODO
		/*
		
		lines.smoothing.addModificationConsumer('smoothing', updateConsumer);
		lines.width.addModificationConsumer('width', updateConsumer);
		lines.color.addModificationConsumer('color', updateConsumer);
		
		*/

		return line;
	}

	__movePlotlyContourFromDummyDivToContourGroup(contourSelection) {
		var contourId = contourSelection.attr('id');
		var copyContourCommand = '$(".main-svg").find(".contour").appendTo($("#root").find("#' + contourId + '"));';
		this.__plotly.eval(copyContourCommand);

		var copyColorbarCommand = '$(".main-svg").find(".infolayer").children("g:last-child").appendTo($("#root").find("#'
				+ contourId + '")).attr("class","colorbar");';
		this.__plotly.eval(copyColorbarCommand);

		var clearCommand = '$("#dummyDiv").empty().removeAttr("class")';
		this.__plotly.eval(clearCommand);

		var deleteExtraSvgCommand = '$("#js-plotly-tester").remove()';
		this.__plotly.eval(deleteExtraSvgCommand);

	}

	__createClipPath(contourSelection) {

		var width = Length.toPx(graph.data.width);
		var height = Length.toPx(graph.data.height);

		var contourId = contourSelection.attr('id');
		var clipId = 'clippath-' + contourId;
		contourSelection //
				.append('clipPath')
				.attr('id', clipId)
				.append('rect') //
				.attr('width', width)
				.attr('height', height);

		contourSelection //
				.select('.contour') //
				.attr('clip-path', 'url(#' + clipId + ')');
	}

	__recreateContourGroup() {
		graphSelection //
				.select('#' + name) //
				.remove();

		var contourSelection = graphSelection //
				.insert('g', '.axis') //
				.attr('class', 'contour-group') //
				.onClick(() => this.handleMouseClick());
		
		this.bindString(()=>this.name, contourSelection, 'id');		
		
		return contourSelection;
	}

	get xData() {		
		if (!this.data.xData) {
			return [];
		}
		var xDataColumn = this.childFromRoot(this.data.xData);
		return xDataColumn.numericValues;	
	}

	get yData() {
		if (!this.data.yData) {
			return [];
		}
		var yDataColumn = this.childFromRoot(this.data.yData);
		return yDataColumn.numericValues;
	}

	get zData() {
		if (!this.data.zData) {
			return [];
		}
		var zDataColumn = this.childFromRoot(this.data.zData);
		return zDataColumn.numericValues;
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
		if (!this.data.xAxis) {
			return null;
		}
		return this.childFromRoot(this.data.xAxis);		
	}
	
	get yAxis() {		
		if (!this.data.yAxis) {
			return null;
		}
		return this.childFromRoot(this.data.yAxis);		
	}	

}
