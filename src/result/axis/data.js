import GraphicsAtom from './../graphics/graphicsAtom.js';
import AxisMode from './axisMode.js';
import BorderMode from './borderMode.js';
import Direction from './direction.js';
import Length from './../graphics/length.js';

export default class Data extends GraphicsAtom {
	
	constructor(){
		super();
		this.label = '';
		this.mode = AxisMode.quantitative;
		this.direction = Direction.horizontal;
		
		this.isMirroring = true; //If true, the axis is mirrored to the other side of the graph: a second axis is shown.
		this.isHidden = false;
		
		this.hasAutoMin = true;
		this.borderMin = BorderMode.two;
		this.min = '0';

		//this.minTime = 

		this.hasAutoMax = true;
		this.borderMax = BorderMode.two;
		this.max = '1';

		//this.maxTime = 
		//this.timeFormat = 
		//this.timeZone =

		this.isLog = false;

		this.__domainSectionSelection = undefined;
		this.__borderMinSelection = undefined;
		
		this.__borderMaxSelection = undefined;
		this.__primaryDTreezAxis = undefined;	
	}
	
	createPage(root) {

		var page = root.append('treez-tab')
			.label('Data');
		
		this.__createGeneralSection(page);
		this.__createDomainSection(page);
	}

	__createGeneralSection(page) {
		var section = page.append('treez-section')
			.label('General');
		
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-text-field')
			.label('Label')
			.bindValue(this,()=>this.label);

		sectionContent.append('treez-enum-combo-box')			
			.label('Mode')
			.nodeAttr('options', AxisMode)	
			.onChange(()=>this.__axisModeChanged())
			.bindValue(this,()=>this.mode);

		sectionContent.append('treez-enum-combo-box')			
			.label('Direction')
			.nodeAttr('options', Direction)				
			.bindValue(this,()=>this.direction);
		

		sectionContent.append('treez-check-box')
			.label('Auto mirror')
			.bindValue(this, ()=>this.isMirroring);

		sectionContent.append('treez-check-box')
			.label('IsHidden')
			.bindValue(this, ()=>this.isHidden);
		
	}
	
	

	__createDomainSection(page) {
		var section = page.append('treez-section')
			.label('Domain');
		
		this.__domainSectionSelection = section;
		
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-check-box')
			.label('Auto min')
			.onChange(()=>this.__autoMinChanged())
			.bindValue(this, ()=>this.hasAutoMin);

		this.__borderMinSelection = sectionContent.append('treez-enum-combo-box')			
			.label('Border min')
			.nodeAttr('options', BorderMode)				
			.bindValue(this,()=>this.borderMin);
		
		this.__minSelection = sectionContent.append('treez-text-field')
			.label('Min')			
			.bindValue(this, ()=>this.min)
			.hide();
		
		//this.__minTimeSelection = sectionContent.append('treez-text-field')
		//	.label('Min time')			
		//	.bindValue(this, ()=>this.minTime)
		//	.hide();
		
		sectionContent.append('treez-check-box')
			.label('Auto max')
			.onChange(()=>this.__autoMaxChanged())
			.bindValue(this, ()=>this.hasAutoMax);
	
		this.__borderMaxSelection = sectionContent.append('treez-enum-combo-box')			
			.label('Border max')
			.nodeAttr('options', BorderMode)				
			.bindValue(this,()=>this.borderMax);
		
		this.__maxSelection = sectionContent.append('treez-text-field')
			.label('Max')			
			.bindValue(this, ()=>this.max)
			.hide();
			
		/*
		domain.createTextField(maxTime, this, '1') //
				.setLabel('Max time') //
				.setEnabled(false);

		domain.createTextField(timeFormat, this, '%a %d') //
				.setLabel('Time format') //
				.setEnabled(false);

		domain.createTextField(timeZone, this, '%a %d') //
				.setLabel('Time zone') //
				.setEnabled(false);
		*/

		sectionContent.append('treez-check-box')
			.label('Log')			
			.bindValue(this, ()=>this.isLog);

		
	}
	
	
	
	__axisModeChanged(){
		if(this.mode.isOrdinal){
			this.__domainSection.hide();
		} else {
			this.__domainSeleciton.show();
		}
	}
	
	__autoMinChanged(){
		if(this.hasAutoMin){
			this.__borderMinSelection.hide();
			this.__minSelection.hide();
		} else {
			this.__borderMinSelection.show();
			this.__minSelection.show();
		}		
	}
	
	__autoMaxChanged(){
		if(this.hasAutoMax){
			this.__borderMaxSelection.hide();
			this.__maxSelection.hide();
		} else {
			this.__borderMaxSelection.show();
			this.__maxSelection.show();
		}		
	}

	plot(dTreez, axisSelection, rectSelection, axis) {
		
		var graph = axis.parent;

		this.__addUpdateListeners(dTreez, graph);

		this.bindBooleanToNegatingDisplay(()=>this.isHidden, axisSelection)
		
		var graphWidthInPx = Length.toPx(graph.data.width);
		var graphHeightInPx = Length.toPx(graph.data.height);

		axis.createScale(graphWidthInPx, graphHeightInPx);
		this.__plotAxis(dTreez, axisSelection, axis, graphWidthInPx, graphHeightInPx);

		return axisSelection;
	}

	__addUpdateListeners(dTreez, graph) {
		var replotGraph = () => graph.updatePlot(dTreez);
		
		this.addListener(()=>this.mode, replotGraph);
		this.addListener(()=>this.direction, replotGraph);
		this.addListener(()=>this.isMirroring, replotGraph);
		
		this.addListener(()=>this.hasAutoMin, replotGraph);
		this.addListener(()=>this.borderMin, replotGraph);
		this.addListener(()=>this.min, replotGraph);
		
		this.addListener(()=>this.hasAutoMax, replotGraph);
		this.addListener(()=>this.borderMax, replotGraph);
		this.addListener(()=>this.max, replotGraph);
		
		this.addListener(()=>this.isLog, replotGraph);			
	}

	__plotAxis(dTreez, axisSelection, axis, graphWidthInPx, graphHeightInPx) {

		axisSelection.selectAll('.primary').remove();
		this.__plotPrimaryAxis(dTreez, axis, axisSelection, graphHeightInPx);

		axisSelection.selectAll('.secondary').remove();
		if (this.isMirroring) {
			this.__plotSecondaryAxis(dTreez, axis, axisSelection, graphWidthInPx);
		}

		return axisSelection;
	}

	__plotPrimaryAxis(dTreez, axis, axisSelection, graphHeightInPx) {

		var primaryAxisSelection = axisSelection //
				.append('g') //
				.attr('id', 'primary') //
				.className('primary');

		
		switch (this.mode) {
		case AxisMode.quantitative:
			this.__primaryDTreezAxis = this.__createPrimaryQuantitativeD3Axis(dTreez, axis, primaryAxisSelection, graphHeightInPx);
			break;
		case AxisMode.ordinal:
			this.__primaryDTreezAxis = this.__createPrimaryOrdinalD3Axis(dTreez, axis, primaryAxisSelection, graphHeightInPx);
			break;
		//case TIME:
		//	throw new Error('not yet implemented');
		default:
			throw new Error('Not yet implemented');
		}

		//primaryAxisSelection.call(this.__primaryDTreezAxis);		
		return primaryAxisSelection;
	}

	__createPrimaryQuantitativeD3Axis(dTreez, axis, axisSelection, graphHeightInPx) {
		var numberOfTicksAimedFor = parseInt(axis.majorTicks.number);
		var tickFormat = axis.tickLabels.format;

		//set translation and tick padding
		var tickPadding;
		if (this.isHorizontal) {
			axisSelection.attr('transform', 'translate(0,' + graphHeightInPx + ')');
			tickPadding = -6.0;
		} else {
			tickPadding = -12.0;
		}

		//create tick format expression
		//also see https://github.com/mbostock/d3/wiki/Formatting#d3_format
		var formatFunction = this.__createFormatFunction(dTreez, tickFormat);

		//create d3 axis
		var dTreezAxis = this.isHorizontal
							?dTreez.axisBottom()
							:dTreez.axisLeft();		
								
		dTreezAxis.scale(axis.scale) //
				.tickSizeOuter(0.0) //
				.tickPadding(tickPadding);

		if (this.isLog) {
			//for log axis only the number of tick labels will be influenced, not the number of tick lines
			dTreezAxis.ticksExpression(numberOfTicksAimedFor, formatFunctionExpression);
		} else {
			dTreezAxis.ticks(numberOfTicksAimedFor);
			dTreezAxis.tickFormat(formatFunction);
		}
		return dTreezAxis;
	}

	__createFormatFunction(dTreez, tickFormat) {
		var formatString = tickFormat;
		if (!formatString) {
			if (this.isLog) {
				formatString = 'log';
			} else {
				formatString = 'g';
			}
		}
		
		if (formatString === 'log') {

			//use unicode characters to create exponent notation 10^0, 10^1, ...
			return function(d){
					var superscript = "\u2070\u00B9\u00B2\u00B3\u2074" // super script numbers in
					                   + "\u2075\u2076\u2077\u2078\u2079"; // unicode from 0 to 9
					 function formatPower (d){
					 	return (d + "\\").split("\\")
					 		.map(function(c) { 
					 			return superscript[c]; 
					 		}).join("\\");
					 }
					 var power = formatPower(Math.round(Math.log(d) / Math.LN10));
					 var displayString = '10' + power;
					 return displayString;
			};

		} else {
			dTreez.format(formatString);
		}
		
	}

	__createPrimaryOrdinalD3Axis(dTreez, axis, axisSelection, graphHeightInPx) {

		//set translation and tick padding
		var tickPadding;
		if (this.isHorizontal) {
			axisSelection.attr('transform', 'translate(0,' + graphHeightInPx + ')');
			tickPadding = -6.0;
		} else {
			tickPadding = -12.0;
		}

		//create d3 axis
		return d3 //
				.svg() //
				.axis() //
				.scale(axisAtom.scale) //
				.outerTickSize(0.0) //
				.ticks(axisAtom.numberOfValues)
				.tickPadding(tickPadding);		
	}

	

	__plotSecondaryAxis(dTreez, axis, axisSelection, graphWidthInPx) {

		var secondaryAxisSelection = axisSelection //
				.append('g') //
				.attr('id', 'secondary') //
				.className('secondary');

		if (!this.isHorizontal) {
			secondaryAxisSelection.attr('transform', 'translate(' + graphWidthInPx + ',0)');
		}

		var dTreezAxis;
		
		switch (this.axisMode) {
		case AxisMode.quantitiative:
			dTreezAxis = this.__createSecondaryQuantitativeDTreezAxis(dTreez, axis);
			break;
		case AxisMode.ordinal:
			dTreezAxis = createSecondaryOrdinalDTreezAxis(dTreez, axis);
			break;
		//case TIME:
		//	throw new Error('Not yet implemented');
		default:
			throw new Error('Not yet implemented');
		}

		

		//TODO dTreezAxis.apply(secondaryAxisSelection);
		return secondaryAxisSelection;
	}

	__createSecondaryQuantitativeDTreezAxis(dTreez, axis) {
		var numberOfTicksAimedFor = parseInt(axis.majorTicks.number);
		return dTreez //
				.axisRight() //
				.scale(axis.scale) //
				.tickSizeOuter(0.0) //
				.ticks(numberOfTicksAimedFor) //for log axis only the tick labels will be influenced
				.tickFormat(function (d) { return ''; }); //hides the tick labels		
	}

	__createSecondaryOrdinalDTreezAxis(dTreez, axis) {
		return dTreez //
				.axisRight() //				
				.scale(axis.scale) //
				.outerTickSize(0.0) //
				.tickFormat(function (d) { return ''; }); //hides the tick labels		
	}	

	get isHorizontal() {
		return this.direction.isHorizontal;		
	}

	get isQuantitative() {		
		return this.mode === AxisMode.quantitative;
	}

	get isOrdinal() {
		return this.mode === AxisMode.ordinal;
	}	

}
