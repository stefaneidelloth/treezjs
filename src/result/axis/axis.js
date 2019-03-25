import PagedGraphicsAtom from './../graphics/pagedGraphicsAtom.js';
import QuantitativeScaleBuilder from './scale/quantitativeScaleBuilder.js';
import OrdinalScaleBuilder from './scale/ordinalScaleBuilder.js';

import Data from './data.js';
import AxisLine from './axisLine.js';
import MajorTicks from './majorTicks.js';
import MinorTicks from './minorTicks.js';
import TickLabels from './tickLabels.js';
import AxisLabel from './axisLabel.js';

import AxisMode from './axisMode.js';



export default class Axis extends PagedGraphicsAtom {

	
	constructor(name, direction) {
		super(name);
		this.image = 'axis.png';		
				
		this.__axisSelection= undefined;		
		this.__quantitativeScaleBuilder = new QuantitativeScaleBuilder(this);
		this.__ordinalScaleBuilder = new OrdinalScaleBuilder();
		
		//data has been created createPropertyPageFactories, which is called from super constructor
		if(direction){
			this.data.direction = direction;
		}
		
	}

	createPageFactories() {

        var factories = []
		this.data = new Data();
		factories.push(this.data);

		this.axisLine = new AxisLine();
		factories.push(this.axisLine);

		this.majorTicks = new MajorTicks();
		factories.push(this.majorTicks);

		this.minorTicks = new MinorTicks();
		factories.push(this.minorTicks);

		this.tickLabels = new TickLabels();
		factories.push(this.tickLabels);

		this.axisLabel = new AxisLabel();
		factories.push(this.axisLabel);

		return factories;
	}

	

	plot(dTreez, graphSelection, graphRectSelection, treeView) {
		
		this.__dTreez = dTreez;
		this.__treeView = treeView;
		
		this.__removeOldAxisGroupIfAlreadyExists(graphSelection);
		this.__createNewAxisGroup(graphSelection);
		this.__updatePlot(dTreez);
		return graphSelection;
	}

	__removeOldAxisGroupIfAlreadyExists(graphSelection) {
		graphSelection //
				.select('#' + this.name) //
				.remove(); //
	}

	__createNewAxisGroup(graphSelection) {
		this.__axisSelection = graphSelection //
				.append('g') //
				.className('axis') //
				.onClick(this);		
		
		this.bindString(()=>this.name, this.__axisSelection, 'id');
		
	}

	__updatePlot(dTreez) {
		this.__plotWithPages(dTreez);
	}

	update() {
		if (this.__dTreez) {
			this.__updatePlot(this.__dTreez);
		}
	}
	
	__plotWithPages(dTreez) {
		for (var pageFactory of this.__pageFactories) {
			pageFactory.plot(dTreez, this.__axisSelection, null, this);
		}
	}

	

	createScale(graphWidthInPx, graphHeightInPx) {

		var scaleFactory = this.__dTreez.scaleLinear();
		
		switch (this.data.mode) {
		case AxisMode.quantitative:
			this.__quantitativeScaleBuilder.createScale(scaleFactory, graphWidthInPx, graphHeightInPx);
			break;
		case AxisMode.ordinal:
			this.__ordinalScaleBuilder.createScale(scaleFactory, this.isHorizontal, graphWidthInPx, graphHeightInPx);
			break;
		//case TIME:
		//	throw new IllegalStateException("not yet implemented");
		default:
			throw new Error('not yet implemented ' + this.__axisMode);
		}
	}

	includeDataForAutoScale(dataForAutoScale) {
		this.__quantitativeScaleBuilder.includeDomainValuesForAutoScale(dataForAutoScale);
	}

	clearDataForAutoScale() {
		this.__quantitativeScaleBuilder.clearDataForAutoScale();
	}

	includeOrdinalValuesForAutoScale(ordinalValues) {
		this.__ordinalScaleBuilder.includeDomainValuesForAutoScale(ordinalValues);
	}

	
	get axisMode() {
		return this.data.mode;
	}

	get scale() {
		
		switch (this.axisMode) {
		case AxisMode.quantitative:
			return this.__quantitativeScaleBuilder.scale;
		case AxisMode.ordinal:
			return this.__ordinalScaleBuilder.scale;
		//case TIME:
		//	throw new IllegalStateException("not yet implemented");
		default:
			throw new Error('not yet implemented');
		}
	}

	get numberOfValues() {
		var axisMode = getAxisMode();
		switch (this.axisMode) {
		case AxisMode.quantitative:
			throw new Error('not yet implemented');
		case AxisMode.ordinal:
			return this.__ordinalScaleBuilder.numberOfValues;
		//case TIME:
		//	throw new IllegalStateException("not yet implemented");
		default:
			throw new Error('not yet implemented');
		}
	}

	get isQuantitative() {
		return this.data.isQuantitative;
		
	}

	get isOrdinal() {
		return this.data.isOrdinal;
	}

	get isHorizontal() {
		var direction = data.direction;
		return direction.isHorizontal;
	}

	get quantitativeLimits() {

		if (this.isQuantitative) {
			var min = data.min;
			var isAutoMin = data.autoMin;
			if (isAutoMin) {
				min = this.__quantitativeScaleBuilder.autoMinValue;
			}

			var max = data.max;
			var isAutoMax = data.autoMax;
			if (isAutoMax) {
				max = this.__quantitativeScaleBuilder.autoMaxValue;
			}

			return [min, max];
		} else {
			var numberOfValues = 0.0 + this.numberOfValues;
			return [1.0, numberOfValues];
		}
	}


}
