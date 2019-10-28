import GraphicsAtom from './../graphics/graphicsAtom.js';

import Length from './../graphics/length.js';


export default class Fill extends GraphicsAtom {
	
	constructor(){
		super();

		this.__graphicsToBarRatioForSingleBar = 3;
		
		this.leftColor = Color.grey;	
		this.leftTransparency = 0;	
		this.leftIsHidden = false;
	
		this.rightColor = Color.green;	
		this.rightTransparency = 0;	
		this.rightIsHidden = false;
	
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
			.labelWidth('90px')
			.bindValue(this, ()=>this.leftColor);	
			
		sectionContent.append('treez-double')
			.label('Transparency')	
			.labelWidth('90px')
			.min('0')
			.max('1')
			.bindValue(this, ()=>this.leftTransparency);
		
		sectionContent.append('treez-check-box')
			.label('IsHidden')	
			.contentWidth('90px')
			.bindValue(this, ()=>this.leftIsHidden);
	}
	
	__createRightSection(page){
		var section = page.append('treez-section')
			.label('Right');	
	
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-color')
			.label('Color mode')
			.labelWidth('90px')	
			.bindValue(this, ()=>this.rightColor);	
			
		sectionContent.append('treez-double')
			.label('Transparency')			
			.labelWidth('90px')	
			.min('0')
			.max('1')
			.bindValue(this, ()=>this.rightTransparency);
		
		sectionContent.append('treez-check-box')
			.label('IsHidden')	
			.contentWidth('90px')
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
		this.bindBooleanToNegatingDisplay(()=>this.leftIsHidden, this.__rectsLeftSelection);
		this.bindBooleanToNegatingDisplay(()=>this.rightIsHidden, this.__rectsRightSelection);
				
		this.__replotRects(tornado, dTreez);

		return tornadoSelection;
	}	

	__replotRects(tornado, dTreez) {
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

		var labelAxis = tornado.data.labelAxisAtom;		
		var inputScale = tornado.data.inputScale;

		var outputAxis = tornado.data.outputAxisAtom;		
		var outputScale = tornado.data.outputScale;

		var barFillRatio = tornado.data.barFillRatio;

		var leftData = eval(tornado.data.leftBarDataString);
		var rightData = eval(tornado.data.rightBarDataString);
		var numberOfBars = tornado.data.dataSize;

		var inputScaleChanged = false;
		if (labelAxis.isOrdinal) {
			var labelData = tornado.data.inputLabelData;

			var labels = labelData.map((labelObj) => '' + labelObj); //
					
			var oldNumberOfValues = labelAxis.numberOfValues;
			labelAxis.includeOrdinalValuesForAutoScale(labels);
			var numberOfValues = labelAxis.numberOfValues;
			inputScaleChanged = numberOfValues !== oldNumberOfValues;

		} else {
			var numberOfEntries = leftData.length;
			labelAxis.includeDataForAutoScale([0, numberOfEntries+1]);
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

			var barHeight = this.__determineBarHeight(graphHeight, inputScale, numberOfBars, barFillRatio, labelAxis.isOrdinal);

			this.__rectsLeftSelection.selectAll('rect') //
					.data(leftData) //
					.enter() //
					.append('rect')
					.attr('x', entry => outputScale(entry.value))
					.attr('y', entry => inputScale(entry.key))
					.attr('height', barHeight)
					.attr('transform', 'translate(0,-' + barHeight / 2 + ')')
					.attr('width', entry => this.__scaleSize(entry, outputScale));

			this.__rectsLeftSelection.selectAll('text') //
					.data(leftData) //
					.enter() //
					.append('text')
					.attr('x', entry => outputScale(entry.value)+10)
					.attr('y', entry => inputScale(entry.key))
					.style('fill', 'black')
					.text(entry => entry.input);

			this.__rectsRightSelection.selectAll('rect') //
					.data(rightData) //
					.enter() //
					.append('rect')
					.attr('x', entry => outputScale(entry.value))
					.attr('y', entry => inputScale(entry.key))
					.attr('height', barHeight)
					.attr('transform', 'translate(0,-' + barHeight / 2 + ')')
					.attr('width', entry => this.__scaleSize(entry, outputScale));


			this.__rectsRightSelection.selectAll('text') //
					.data(rightData) //
					.enter() //
					.append('text')
					.attr('x', entry => outputScale(entry.value+entry.size)+10)
					.attr('y', entry => inputScale(entry.key))
					.style('fill', 'black')
					.text(entry => entry.input);
					
		} else {

			var barWidth = this.__determineBarWidth(graphWidth, inputScale, numberOfBars, barFillRatio, labelAxis.isOrdinal);

			this.__rectsLeftSelection.selectAll('rect') //
					.data(leftData) //
					.enter() //
					.append('rect')
					.attr('x', entry => inputScale(entry.key))
					.attr('y', entry => graphHeight - outputScale(entry.value))
					.attr('width', barWidth)
					.attr('transform', 'translate(-' + barWidth / 2 + ',0)')
					.attr('height', entry => this.__scaleSize(entry, outputScale));

			this.__rectsRightSelection.selectAll('rect') //
					.data(rightData) //
					.enter() //
					.append('rect')
					.attr('x', entry => inputScale(entry.key))
					.attr('y', entry => graphHeight - outputScale(entry.value))
					.attr('width', barWidth)
					.attr('transform', 'translate(-' + barWidth / 2 + ',0)')
					.attr('height', entry => this.__scaleSize(entry, outputScale));

		}

		//bind attributes
		this.bindString(()=>this.leftColor, this.__rectsLeftSelection, 'fill');
		this.bindTransparency(()=>this.leftTransparency, this.__rectsLeftSelection);
		this.bindBooleanToTransparency(()=>this.leftIsHidden, ()=>this.leftTransparency, this.__rectsLeftSelection);

		this.bindString(()=>this.rightColor, this.__rectsRightSelection, 'fill');
		this.bindTransparency(()=>this.rightTransparency, this.__rectsRightSelection);
		this.bindBooleanToTransparency(()=>this.rightIsHidden, ()=>this.rightTransparency, this.__rectsRightSelection);

	}

	

	__scaleSize(entry, scale){
		var value = entry.value;
		var size = entry.size;

		var scaledRightValue = scale(value+size);
		var scaledLeftValue = scale(value);
		return scaledRightValue - scaledLeftValue;
	}

	__inverselyScaleSize(entry, scale){
		var value = entry.value;
		var size = entry.size;

		var scaledRightValue = scale(value+size);
		var scaledLeftValue = scale(value);
		return -(scaledRightValue - scaledLeftValue);
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
