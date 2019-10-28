import GraphicsAtom from './../graphics/graphicsAtom.js';
import Length from './../graphics/length.js';
import Color from './../../components/color/color.js';

export default class Fill extends GraphicsAtom {
	
	constructor(){
		super();

		this.__graphicsToBarRationForSingleBar = 3;
		this.color = Color.black;
	
		//this.fillStyle = new Wrap<>();
	
		this.transparency = 0;
		this.isHidden = false;
		this.__rectsGroupSelection = undefined;
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
			.labelWidth('90px')	
			.bindValue(this, () => this.color);	

		//fill.createFillStyle(fillStyle, 'style', 'Style');

		sectionContent.append('treez-double')
			.label('Transparency')
			.labelWidth('90px')	
			.min('0')
			.max('1')	
			.bindValue(this, ()=>this.transparency);
		
		sectionContent.append('treez-check-box')
			.contentWidth('90px')	
			.label('IsHidden')	
			.bindValue(this, ()=>this.isHidden);
		
	}

	plot(dTreez, barSelection, rectSelection, bar) {		

		var clipPathId = 'bar_rects_' + this.parent.name + '_clipping_path';

		//remove old group if it already exists
		barSelection //
				.select('.bar-rects') //
				.remove();

		//create new group
		this.__rectsGroupSelection = barSelection //
				.append('g') //
				.attr('id', 'bar-rects') //
				.attr('class', 'bar-rects'); //
				//.attr('clip-path', 'url(#' + clipPathId +')');

		//create clipping path that ensures that the bars are only
		//shown within the bounds of the graph
		var graph = bar.graph;
		
		/*
		var clipPath = this.__rectsGroupSelection.append('clipPath') //
			.attr('id', clipPathId); 
		
		var width = Length.toPx(graph.data.width);
		var height = Length.toPx(graph.data.height);
		
		
		clipPath.append('rect')			
				.attr('id','clipping-rect')
				.attr('x', 0) //
				.attr('y', 0) //
				.attr('width', width) //
				.attr('height', height);
		*/
				

		
		this.bindBooleanToNegatingDisplay(() => this.isHidden, this.__rectsGroupSelection);		

		var replotRects = () => this.replotRects(bar);		
		replotRects(bar);

		

		return barSelection;
	}

	replotRects(bar) {
		this.__removeOldRects();
		this.__plotNewRects(bar);

	}

	__removeOldRects() {
		if(this.____rectsSelection){
			this.__rectsSelection.selectAll('rect') //
				.remove();
		}
		
	}

	__plotNewRects(bar) {

		
		var graph = bar.graph;
		var graphHeight = Length.toPx(graph.data.height);
		var graphWidth = Length.toPx(graph.data.width);

		var horizontalAxis = bar.horizontalAxis;
		var horizontalAxisIsOrdinal = horizontalAxis.isOrdinal;
		var horizontalScale = bar.horizontalScale;

		var verticalAxis = bar.verticalAxis;
		var verticalAxisIsOrdinal = verticalAxis.isOrdinal;
		var verticalScale = bar.verticalScale;

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
			var data = eval(dataString);

			this.__rectsSelection = this.__rectsGroupSelection.selectAll('rect') //
					.data(data) //
					.enter() //
					.append('rect')
					.attr('x', row => horizontalScale(row[0]))
					.attr('y', row => verticalScale(row[1]))
					.attr('width', barWidth)
					.attr('transform', 'translate(-' + barWidth / 2 + ', 0)')
					.attr('height', row => graphHeight - verticalScale(row[1]));
		} else {
			var barHeight = this.__determineBarHeight(bar, graphHeight, verticalAxis, numberOfPositionValues, barFillRatio);

			var dataString = bar.barDataString(verticalAxisIsOrdinal, horizontalAxisIsOrdinal);
			var data = eval(dataString);

			this.__rectsSelection = this.__rectsGroupSelection.selectAll('rect') //
					.data(data) //
					.enter() //
					.append('rect')
					.attr('x', 0)
					.attr('y', row => verticalScale(row[0]))
					.attr('height', barHeight)
					.attr('transform', 'translate(0,-' + barHeight / 2 + ')')
					.attr('width', row => horizontalScale(row[1]));
		}

		//bind attributes
		this.bindString(() => this.color, this.__rectsGroupSelection, 'fill');
		
		this.bindTransparency(()=>this.transparency, this.__rectsSelection);
		this.bindBooleanToTransparency(()=>this.isHidden, ()=>this.transparency, this.__rectsSelection);

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
				var offset = horizontalScale(minValue);
				var scaledWidth = horizontalScale(minValue + smallestPositionDistance);
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
				var offset = graphHeight - verticalScale(minValue);
				var scaledHeight = graphHeight - verticalScale(minValue + smallestPositionDistance);
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
