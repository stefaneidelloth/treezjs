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
		this.data = Data.create(this);
		factories.push(this.data);

		this.axisLine = AxisLine.create();
		factories.push(this.axisLine);

		this.majorTicks = MajorTicks.create();
		factories.push(this.majorTicks);

		this.minorTicks = MinorTicks.create();
		factories.push(this.minorTicks);

		this.tickLabels = TickLabels.create();
		factories.push(this.tickLabels);

		this.axisLabel = AxisLabel.create(); //is created after ticks to consider tick height for label position
		factories.push(this.axisLabel);

		return factories;
	}

	

	plot(dTreez, graphSelection, graphRectSelection, treeView) {
		
		this.__dTreez = dTreez;
		this.treeView = treeView;
		
		this.__removeOldAxisGroupIfAlreadyExists(graphSelection);
		this.__createNewAxisGroup(graphSelection);
		this.updatePlot(dTreez);		
		
		return graphSelection;
	}
	
	updatePlot(dTreez) {
		this.__plotWithPages(dTreez);
	}

	update() {
		if (this.__dTreez) {
			this.updatePlot(this.__dTreez);
		}
	}
	
	createScale(graphWidthInPx, graphHeightInPx) {		
		
		switch (this.data.mode) {
		case AxisMode.quantitative:
			this.__quantitativeScaleBuilder.createScale(this.__dTreez, graphWidthInPx, graphHeightInPx);
			break;
		case AxisMode.ordinal:
			this.__ordinalScaleBuilder.createScale(this.__dTreez, this.isHorizontal, graphWidthInPx, graphHeightInPx);
			break;
		//case TIME:
		//	throw new IllegalStateException("not yet implemented");
		default:
			throw new Error('not yet implemented ' + this.__axisMode);
		}
	}
	
	__plotWithPages(dTreez) {
		for (var pageFactory of this.__pageFactories) {
			pageFactory.plot(dTreez, this.__axisSelection, null, this);
		}
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
				.onClick(() => this.handleMouseClick());		
		
		this.bindString(()=>this.name, this.__axisSelection, 'id');
		
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

	get scale() {
		
		switch (this.data.mode) {
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
		switch (this.data.mode) {
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
		return this.data.direction.isHorizontal;
	}

	get quantitativeLimits() {
		if (this.isQuantitative) {
			var min = parseFloat(this.data.min);			
			if (this.data.hasAutoMin) {
				min = this.__quantitativeScaleBuilder.autoMinValue;
			}

			var max = parseFloat(this.data.max);			
			if (this.data.hasAutoMax) {
				max = this.__quantitativeScaleBuilder.autoMaxValue;
			}

			return [min, max];
		} else {			
			return [1.0, this.numberOfValues];
		}
	}


}
