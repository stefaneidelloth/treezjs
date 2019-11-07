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
		this.min = 0;

		//this.minTime = 

		this.hasAutoMax = true;
		this.borderMax = BorderMode.two;
		this.max = 1;

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

	__createGeneralSection(page) {

		let axis = this.parent;
		
		var section = page.append('treez-section')
			.label('General');

		axis.createHelpAction(section, 'result/axis/axis.md');
		
		var sectionContent = section.append('div');

		

		sectionContent.append('treez-text-field')
			.label('Name')
			.nodeAttr('validatior', (name)=>this.validateName(name))
			.onChange(()=>this.__nameChanged())
			.bindValue(axis,(axis)=>axis.name);
		
		sectionContent.append('treez-text-field')
			.label('Label')
			.bindValue(this,()=>this.label);

		sectionContent.append('treez-enum-combo-box')			
			.label('Mode')
			.labelWidth('70px')			
			.nodeAttr('enum', AxisMode)
			.onChange(()=>this.__axisModeChanged())
			.bindValue(this,()=>this.mode);

		sectionContent.append('treez-enum-combo-box')			
			.label('Direction')
			.labelWidth('70px')
			.nodeAttr('enum', Direction)
			.bindValue(this,()=>this.direction);		

		sectionContent.append('treez-check-box')
			.label('Auto mirror')
			.contentWidth('70px')
			.bindValue(this, ()=>this.isMirroring);

		sectionContent.append('treez-check-box')
			.label('IsHidden')
			.contentWidth('70px')
			.bindValue(this, ()=>this.isHidden);		
	}

	__nameChanged(){
		if(this.__domainSectionSelection){	
			this.parent.treeView.refresh(this.parent);						
		}
	}	
	

	__createDomainSection(page) {
		var section = page.append('treez-section')
			.label('Domain');
		
		this.__domainSectionSelection = section;
		
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-check-box')
			.label('Auto min')
			.contentWidth('70px')
			.onChange(()=>this.__autoMinChanged())
			.bindValue(this, ()=>this.hasAutoMin);

		this.__borderMinSelection = sectionContent.append('treez-enum-combo-box')			
			.label('Border min')
			.labelWidth('70px')
			.nodeAttr('enum', BorderMode)
			.bindValue(this,()=>this.borderMin);
		
		this.__minSelection = sectionContent.append('treez-double')
			.label('Min')
			.labelWidth('70px')	
			.contentWidth('20%')		
			.bindValue(this, ()=>this.min)
			.hide();
		
		//this.__minTimeSelection = sectionContent.append('treez-text-field')
		//	.label('Min time')			
		//	.bindValue(this, ()=>this.minTime)
		//	.hide();
		
		sectionContent.append('treez-check-box')
			.label('Auto max')
			.contentWidth('70px')
			.onChange(()=>this.__autoMaxChanged())
			.bindValue(this, ()=>this.hasAutoMax);
	
		this.__borderMaxSelection = sectionContent.append('treez-enum-combo-box')			
			.label('Border max')
			.labelWidth('70px')
			.nodeAttr('enum', BorderMode)
			.bindValue(this,()=>this.borderMax);
		
		this.__maxSelection = sectionContent.append('treez-double')
			.label('Max')		
			.labelWidth('70px')	
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
			.contentWidth('70px')			
			.bindValue(this, ()=>this.isLog);		
	}	
	
	
	__axisModeChanged(){
		if(this.__domainSectionSelection){
			if(this.mode.isOrdinal){
				this.__domainSectionSelection.hide();
			} else {
				this.__domainSectionSelection.show();
			}
		}		
	}
	
	__autoMinChanged(){
		if(this.__borderMinSelection){
			if(this.hasAutoMin){
				this.__borderMinSelection.hide();
				this.__minSelection.hide();
			} else {
				this.__borderMinSelection.show();
				this.__minSelection.show();
			}	
		}			
	}
	
	__autoMaxChanged(){
		if(this.__borderMaxSelection){
			if(this.hasAutoMax){
				this.__borderMaxSelection.hide();
				this.__maxSelection.hide();
			} else {
				this.__borderMaxSelection.show();
				this.__maxSelection.show();
			}	
		}
			
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
			this.__primaryDTreezAxis = this.__createPrimaryQuantitativeDTreezAxis(dTreez, axis, primaryAxisSelection, graphHeightInPx);
			break;
		case AxisMode.ordinal:
			this.__primaryDTreezAxis = this.__createPrimaryOrdinalDTreezAxis(dTreez, axis, primaryAxisSelection, graphHeightInPx);
			break;
		//case TIME:
		//	throw new Error('not yet implemented');
		default:
			throw new Error('Not yet implemented');
		}
		
		primaryAxisSelection.call(this.__primaryDTreezAxis);
				
		return primaryAxisSelection;
	}

	__createPrimaryQuantitativeDTreezAxis(dTreez, axis, axisSelection, graphHeightInPx) {
		
		//set translation and tick padding
		var tickPadding;
		if (this.isHorizontal) {
			axisSelection.attr('transform', 'translate(0,' + graphHeightInPx + ')');
			tickPadding = -6.0;
		} else {
			tickPadding = -12.0;
		}		

		//create dTreez axis
		var dTreezAxis = this.isHorizontal
							?dTreez.axisBottom(axis.scale)
							:dTreez.axisLeft(axis.scale);		
								
		dTreezAxis.tickSizeOuter(0) //
				  .tickPadding(tickPadding);
		
		//create tick format expression
		//also see https://github.com/mbostock/d3/wiki/Formatting#d3_format		
		var formatFunction = this.__createFormatFunction(dTreez, axis.tickLabels.format);
		
		dTreezAxis.ticks(axis.majorTicks.numberOfTicksAimedFor, formatFunction);
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
					var superscript = "\u2070\u00B9\u00B2\u00B3\u2074" // super script numbers in unicode from 0 to 9
					                   + "\u2075\u2076\u2077\u2078\u2079";  
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
			return dTreez.format(formatString);
		}
		
	}

	__createPrimaryOrdinalDTreezAxis(dTreez, axis, axisSelection, graphHeightInPx) {

		//set translation and tick padding
		var tickPadding;
		if (this.isHorizontal) {
			axisSelection.attr('transform', 'translate(0,' + graphHeightInPx + ')');
			tickPadding = -6.0;
		} else {
			tickPadding = -12.0;
		}
		
		var dTreezAxis = this.isHorizontal
			?dTreez.axisBottom(axis.scale)
			:dTreez.axisLeft(axis.scale);

		dTreezAxis
				.tickSizeOuter(0) //
				.ticks(axis.numberOfValues)
				.tickPadding(tickPadding);
		
		return dTreezAxis;
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

		secondaryAxisSelection.call(dTreezAxis);		
		return secondaryAxisSelection;
	}

	__createSecondaryQuantitativeDTreezAxis(dTreez, axis) {
		var numberOfTicksAimedFor = parseInt(axis.majorTicks.number);
		
		
		var dTreezAxis = this.isHorizontal
							?dTreez.axisTop(axis.scale)
							:dTreez.axisRight(axis.scale);	
		
		dTreezAxis //				
				.tickSizeOuter(0) //
				.ticks(numberOfTicksAimedFor) //for log axis only the tick labels will be influenced
				.tickFormat(function (d) { return ''; }); //hides the tick labels		
		
		return dTreezAxis;
	}

	__createSecondaryOrdinalDTreezAxis(dTreez, axis) {
		
		var dTreezAxis = this.isHorizontal
							?dTreez.axisTop(axis.scale)
							:dTreez.axisRight(axis.scale);	

		dTreezAxis //	
				.tickSizeOuter(0) //
				.tickFormat(function (d) { return ''; }); //hides the tick labels	
		
		return dTreezAxis;
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
