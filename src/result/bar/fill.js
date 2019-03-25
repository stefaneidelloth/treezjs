import GraphicsAtom from './../graphics/graphicsAtom.js';

export default class Fill extends GraphicsAtom {
	
	constructor(){

		this.__graphicsToBarRationForSingleBar = 3;
		this.color = Color.black;
	
		//this.fillStyle = new Wrap<>();
	
		this.transparency = '0';
		this.isHidden = false;
		this.__rectsSelection = undefined;
	}

	createPage(root) {

		var page = root.append('treez-tab')
			.label('Fill');
	
		var section = page.append('treez-section')
			.label('Fill');	
		
		var sectionContent = section.append('div');

		sectionContent.append('treez-color')
			.label('Color mode')	
			.bindValue(this, ()=>this.color);	

		//fill.createFillStyle(fillStyle, 'style', 'Style');

		sectionContent.append('treez-text-field')
			.label('Transparency')	
			.bindValue(this, ()=>this.transparency);
		
		sectionContent.append('treez-check-box')
			.label('IsHidden')	
			.bindValue(this, ()=>this.isHideen);

		
	}

	plot(dTreez, barSelection, rectSelection, bar) {		

		var clipPathId = 'bar-rects-' + this.parent.name + '-clip-path';

		//remove old group if it already exists
		barSelection //
				.select('.bar-rects') //
				.remove();

		//create new group
		rectsSelection = barSelection //
				.append('g') //
				.attr('id', 'bar-rects') //
				.attr('class', 'bar-rects') //
				.attr('clip-path', 'url(#' + clipPathId);

		//create clipping path that ensures that the bars are only
		//shown within the bounds of the graph
		var graph = bar.graph;

		var width = Length.toPx(graph.data.width);
		var height = Length.toPx(graph.data.height);
		rectsSelection.append('clipPath') //
				.attr('id', clipPathId) //
				.append('rect') //
				.attr('x', 0) //
				.attr('y', 0) //
				.attr('width', width) //
				.attr('height', height);

		
		this.bindBooleanToNegatingDisplay(()=>this.isHidden, rectsSelection);		

		var replotRects = () =>  this.replotRects(bar);		
		replotRects();

		return barSelection;
	}

	replotRects(bar) {
		this.__removeOldRects();
		this.__plotNewRects(bar);

	}

	__removeOldRects() {
		this.__rectsSelection.selectAll('rect') //
				.remove();
	}

	__plotNewRects(bar) {

		
		var graph = bar.graph;
		var graphHeight = Length.toPx(graph.data.height);
		var graphWidth = Length.toPx(graph.data.width);

		var horizontalAxis = bar.getHorizontalAxis();
		var horizontalAxisIsOrdinal = horizontalAxis.isOrdinal();
		var horizontalScale = bar.getHorizontalScale();

		var verticalAxis = bar.getVerticalAxis();
		var verticalAxisIsOrdinal = verticalAxis.isOrdinal();
		var verticalScale = bar.getVerticalScale();

		var direction = bar.data.barDirection;
		var isVertical = direction.isVertical;

		var barFillRatio = bar.data.barFillRatio;
		if (barFillRatio === null) {
			barFillRatio = '1.0';
		}

		var numberOfPositionValues = bar.numberOfPositionValues;

		if (isVertical) {

			var barWidth = this.__determineBarWidth(bar, graphWidth, horizontalAxis, numberOfPositionValues, barFillRatio);

			var dataString = bar.barDataString(horizontalAxisIsOrdinal, verticalAxisIsOrdinal);

			rectsSelection.selectAll('rect') //
					.data(dataString) //
					.enter() //
					.append('rect')
					.attr('x', new AxisScaleFirstDataFunction(engine, horizontalScale))
					.attr('y', new AxisScaleSecondDataFunction(engine, verticalScale))
					.attr('width', barWidth)
					.attr('transform', 'translate(-' + barWidth / 2 + ',0)')
					.attr('height', new AxisScaleInversedSecondDataFunction(engine, verticalScale, graphHeight));
		} else {
			var barHeight = this.__determineBarHeight(bar, graphHeight, verticalAxis, numberOfPositionValues, barFillRatio);

			var dataString = bar.barDataString(verticalAxisIsOrdinal, horizontalAxisIsOrdinal);

			rectsSelection.selectAll('rect') //
					.data(dataString) //
					.enter() //
					.append('rect')
					.attr('x', 0)
					.attr('y', new AxisScaleFirstDataFunction(engine, verticalScale))
					.attr('height', barHeight)
					.attr('transform', 'translate(0,-' + barHeight / 2 + ')')
					.attr('width', new AxisScaleSecondDataFunction(engine, horizontalScale));
		}

		//bind attributes
		this.bindString(()=>this.color, rectsSelection, 'fill');
		
		this.bindTransparency(()=>this.transparency, rectsSelection);
		this.bindBooleanToTransparency(()=>this.hide, ()=>this.transparency, rectsSelection);

	}

	__determineBarWidth(bar, graphWidth, horizontalAxis, numberOfPositionValues, barFillRatio) {

		var defaultBarWidth;
		if (numberOfPositionValues > 1) {
			
			if (horizontalAxis.isOrdinal) {
				defaultBarWidth = graphWidth / numberOfPositionValues;
			} else {
				var smallestPositionDistance = bar.smallestPositionDistance;
				var horizontalScale = horizontalAxis.scale;
				var limits = horizontalAxis.quantitativeLimits;
				var minValue = limits[0];
				var offset = horizontalScale.apply(minValue).asDouble();
				var scaledWidth = horizontalScale.apply(minValue + smallestPositionDistance).asDouble();
				defaultBarWidth = scaledWidth - offset;
			}

		} else {
			defaultBarWidth = graphWidth / this.__graphicsToBarRationForSingleBar;
		}
		var barWidth = defaultBarWidth * barFillRatio;
		return barWidth;
	}

	__determineBarHeight(bar, graphHeight, verticalAxis, numberOfPositionValues, barFillRatio) {

		var defaultBarHeight;
		if (numberOfPositionValues > 1) {
		
			if (verticalAxis.isOrdinal) {
				defaultBarHeight = graphHeight / numberOfPositionValues;
			} else {
				var smallestPositionDistance = bar.smallestPositionDistance;
				var verticalScale = verticalAxis.scale;
				var minValue = verticalAxis.quantitativeLimits[0];
				var offset = graphHeight - verticalScale.apply(minValue).asDouble();
				var scaledHeight = graphHeight - verticalScale.apply(minValue + smallestPositionDistance).asDouble();
				defaultBarHeight = scaledHeight - offset;
			}

		} else {
			defaultBarHeight = graphHeight / this.__graphicsToBarRationForSingleBar;
		}
		var barHeight = defaultBarHeight * barFillRatio;
		return barHeight;
	}

	formatLegendSymbol(symbolSelection, symbolSize) {

		symbolSelection.attr('width', symbolSize);
		symbolSelection.attr('height', '10');

		this.bindString(()=>this.color, symbolSelection, 'fill');
		this.bindTransparency(()=>this.transparency, symbolSelection);
		this.bindBooleanToTransparency(()=>this.hide, ()=>this.transparency, symbolSelection);		

		return symbolSelection;

	}	

}
