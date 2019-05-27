import GraphicsAtom from './../graphics/graphicsAtom.js';

export default class Fill extends GraphicsAtom {
	
	constructor(){
		super();

		this.__graphicsToBarRatioForSingleBar = 3;
		
		this.leftColor = Color.grey;	
		this.leftTransparency = '0';	
		this.isLeftHidden = false;
	
		this.rightColor = Color.green;	
		this.rightTransparency = '0';	
		this.isRightHidden = false;
	
		this.__rectsLeftSelection = undefined;	
		this.__rectsRightSelection = undefined;	
	}

	createPage(root) {
		var page = root.append('treez-tab')
			.label('Fill');
		
		this.__createLeftSection(page);
		this.__createRightSection(page);		
	}
	
	__createLeftSection(page){
		var section = page.append('treez-section')
			.label('Left');	
	
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-color')
			.label('Color mode')	
			.bindValue(this, ()=>this.leftColor);	
			
		sectionContent.append('treez-text-field')
			.label('Transparency')	
			.bindValue(this, ()=>this.leftTransparency);
		
		sectionContent.append('treez-check-box')
			.label('IsHidden')	
			.bindValue(this, ()=>this.leftIsHidden);
	}
	
	__createRightSection(page){
		var section = page.append('treez-section')
			.label('Right');	
	
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-color')
			.label('Color mode')	
			.bindValue(this, ()=>this.rightColor);	
			
		sectionContent.append('treez-text-field')
			.label('Transparency')	
			.bindValue(this, ()=>this.rightTransparency);
		
		sectionContent.append('treez-check-box')
			.label('IsHidden')	
			.bindValue(this, ()=>this.rightIsHidden);
	}


	plot(dTreez, tornadoSelection, rectSelection, tornado) {		

		var clipPathId = 'bar-rects-' + tornado.name + '-clip-path';

		//remove old groups and clip path if they already exist
		tornadoSelection //
				.select('.bar-rects-left') //
				.remove();

		tornadoSelection //
				.select('.bar-rects-right') //
				.remove();

		tornadoSelection //
				.select(clipPathId) //
				.remove();

		//create new groups
		this.__rectsLeftSelection = tornadoSelection //
				.append('g') //
				.attr('id', 'bar-rects-left') //
				.className('bar-rects-left') //
				.attr('clip-path', 'url(#' + clipPathId);

		this.__rectsRightSelection = tornadoSelection //
				.append('g') //
				.attr('id', 'bar-rects-right') //
				.className('bar-rects-right') //
				.attr('clip-path', 'url(#' + clipPathId);

		//create clipping path that ensures that the bars are only
		//shown within the bounds of the graph
		var graph = tornado.graph;

		var width = Length.toPx(graph.data.width);
		var height = Length.toPx(graph.data.width);
		tornadoSelection.append('clipPath') //
				.attr('id', clipPathId) //
				.append('rect') //
				.attr('x', 0) //
				.attr('y', 0) //
				.attr('width', width) //
				.attr('height', height);

		//bind attributes
		this.bindBooleanToNegatingDisplay(()=>this.isLeftHidden, this.__rectsLeftSelection);
		this.bindBooleanToNegatingDisplay(()=>this.isRightHidden, this.__rectsRightSelection);
				
		this.__replotRects(tornado, dTreez);

		return tornadoSelection;
	}

	

	__rePlotRects(tornado, dTreez) {
		this.__removeOldRects();
		this.__plotNewRects(tornado, dTreez);

	}

	__removeOldRects() {
		this.__rectsLeftSelection.selectAll('rect') //
				.remove();
		
		this.__rectsRightSelection.selectAll('rect') //
				.remove();
	}

	__plotNewRects(tornado, dTreez) {
		
		var graph = tornado.graph;
		var graphHeight = Length.toPx(graph.data.height);
		var graphWidth = Length.toPx(graph.data.width);

		var inputAxis = tornado.data.inputAxis;		
		var inputScale = tornado.data.inputScale;

		var outputAxis = tornado.data.outputAxis;		
		var outputScale = tornado.data.outputScale;

		var barFillRatio = tornado.data.barFillRatio;

		var leftDataString = tornado.data.leftBarDataString;
		var rightDataString = tornado.data.rghtBarDataString;
		var numberOfBars = tornado.data.dataSize;

		var inputScaleChanged = false;
		if (inputAxisIsOrdinal) {
			var labelData = tornado.data.inputLabelData;

			var labels = labelData.map((labelObj) => '' + labelObj); //
					
			var oldNumberOfValues = inputAxis.numberOfValues;
			inputAxis.includeOrdinalValuesForAutoScale(labels);
			var numberOfValues = inputAxis.numberOfValues;
			inputScaleChanged = numberOfValues !== oldNumberOfValues;

		} else {
			//TODO
			//inputAxis.includeDataForAutoScale(inputData);
		}

		var allOutputData = tornado.data.allBarData;
		var oldOutputLimits = outputAxis.quantitativeLimits;
		outputAxis.includeDataForAutoScale(allOutputData);
		var outputLimits = outputAxis.quantitativeLimits;
		
		var outputScaleChanged = ('' + outputLimits) !== ('' + oldOutputLimits);

		if (inputScaleChanged || outputScaleChanged) {
			graph.updatePlotForChangedScales(dTreez);
		}		

		if (outputAxis.isHorizontal) {

			var barHeight = this.__determineBarHeight(graphHeight, inputScale, numberOfBars, barFillRatio, inputAxis.isOrdinal);

			this.__rectsLeftSelection.selectAll('rect') //
					.data(leftDataString) //
					.enter() //
					.append('rect')
					.attr('x', new AxisScaleValueDataFunction(engine, outputScale))
					.attr('y', new AxisScaleKeyDataFunction(engine, inputScale))
					.attr('height', barHeight)
					.attr('transform', 'translate(0,-' + barHeight / 2 + ')')
					.attr('width', new AxisScaleSizeDataFunction(engine, outputScale));

			this.__rectsLeftSelection.selectAll('text') //
					.data(leftDataString) //
					.enter() //
					.append('text')
					.attr('x', new AxisScaleValueDataFunction(engine, outputScale))
					.attr('y', new AxisScaleKeyDataFunction(engine, inputScale))
					.style('fill', 'black')
					.text(new AttributeStringDataFunction(engine, 'input'));

			this.__rectsRightSelection.selectAll('rect') //
					.data(rightDataString) //
					.enter() //
					.append('rect')
					.attr('x', new AxisScaleValueDataFunction(engine, outputScale))
					.attr('y', new AxisScaleKeyDataFunction(engine, inputScale))
					.attr('height', barHeight)
					.attr('transform', 'translate(0,-' + barHeight / 2 + ')')
					.attr('width', new AxisScaleSizeDataFunction(engine, outputScale));
		} else {

			var barWidth = this.__determineBarWidth(graphWidth, inputScale, numberOfBars, barFillRatio, inputAxis.isOrdinal);

			this.__rectsLeftSelection.selectAll('rect') //
					.data(leftDataString) //
					.enter() //
					.append('rect')
					.attr('x', new AxisScaleKeyDataFunction(engine, inputScale))
					.attr('y', new AxisScaleInversedValueDataFunction(engine, outputScale, graphHeight))
					.attr('width', barWidth)
					.attr('transform', 'translate(-' + barWidth / 2 + ',0)')
					.attr('height', new AxisScaleInversedSizeDataFunction(engine, outputScale));

			this.__rectsRightSelection.selectAll('rect') //
					.data(rightDataString) //
					.enter() //
					.append('rect')
					.attr('x', new AxisScaleKeyDataFunction(engine, inputScale))
					.attr('y', new AxisScaleInversedValueDataFunction(engine, outputScale, graphHeight))
					.attr('width', barWidth)
					.attr('transform', 'translate(-' + barWidth / 2 + ',0)')
					.attr('height', new AxisScaleInversedSizeDataFunction(engine, outputScale));

		}

		//bind attributes
		this.bindString(()=>this.leftColor, this.__rectsLeftSelection, 'fill');
		this.bindTransparency(()=>this.leftTransparency, this.__rectsLeftSelection);
		this.bindBooleanToTransparency(()=>this.leftIsHidden, ()=>this.leftTransparency, this.__rectsLeftSelection);

		this.bindString(()=>this.rightColor, this.__rectsRightSelection, 'fill');
		this.bindTransparency(()=>this.rightTransparency, this.__rectsRightSelection);
		this.bindBooleanToTransparency(()=>this.rightIsHidden, ()=>this.rightTransparency, this.__rectsRightSelection);

	}

	__determineBarWidth(graphWidth, xScale, dataSize, barFillRatio, axisIsOrdinal) {

		var defaultBarWidth;
		if (dataSize > 1) {
			if (axisIsOrdinal) {
				defaultBarWidth = graphWidth / dataSize;
			} else {
				defaultBarWidth = xScale(1);
			}
		} else {
			defaultBarWidth = graphWidth / this.__graphicsToBarRatioForSingleBar;
		}
		var barWidth = defaultBarWidth * barFillRatio;
		return barWidth;
	}

	__determineBarHeight(graphHeight, yScale, dataSize, barFillRatio, axisIsOrdinal) {

		var defaultBarHeight;
		if (dataSize > 1) {
			if (axisIsOrdinal) {
				defaultBarHeight = graphHeight / dataSize;
			} else {
				defaultBarHeight = graphHeight - yScale(1);
			}
		} else {
			defaultBarHeight = graphHeight / this.__graphicsToBarRatioForSingleBar;
		}
		var barHeight = defaultBarHeight * barFillRatio;
		return barHeight;
	}

	formatLegendSymbol(symbolSelection, symbolSize) {

		symbolSelection.attr('width', symbolSize);
		symbolSelection.attr('height', '10');
		
		this.bindString(()=>this.leftColor, symbolSelection, 'fill');
		this.bindTransparency(()=>this.leftTransparency, symbolSelection);
		this.bindBooleanToTransparency(()=>this.leftIsHidden, ()=>this.leftTransparency, symbolSelection);

		return symbolSelection;

	}


}
