import GraphicsAtom from './../graphics/graphicsAtom.js';
import PrimaryAndSecondarySelection from './primaryAndSecondarySelection.js';
import Color from './../../components/color/color.js';
import LineStyle from './../../components/lineStyle/lineStyle.js';

export default class MinorTicks extends GraphicsAtom {
	
	constructor(){		
		super();
		this.number = 40; //Number of minor ticks aimed for
		this.color = Color.black;
		this.width = 2
		this.length = 5;
		this.style = LineStyle.solid;
		this.transparency = 0;
		this.isHidden = false;
	}	

	createPage(root) {
		
		var page = root.append('treez-tab')
		.label('Minor ticks');
	
		var section = page.append('treez-section')
			.label('Ticks');
	
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-integer')
			.label('Number')
			.labelWidth('90px')
			.min('0')
			.bindValue(this, ()=>this.number);
		
		sectionContent.append('treez-color')
			.label('Color')
			.labelWidth('90px')
			.bindValue(this, ()=>this.color);
		
		sectionContent.append('treez-double')
			.label('Width')
			.labelWidth('90px')
			.min('0')
			.bindValue(this, ()=>this.width);
		
		sectionContent.append('treez-double')
			.label('Length')	
			.labelWidth('90px')		
			.bindValue(this, ()=>this.length);
		
		sectionContent.append('treez-line-style')
			.label('Line style')
			.labelWidth('90px')
			.bindValue(this, ()=>this.style);
		
		sectionContent.append('treez-double')
			.label('Transparency')
			.labelWidth('90px')
			.min('0')
			.max('1')
			.bindValue(this, ()=>this.transparency);
		
		sectionContent.append('treez-check-box')
			.label('IsHidden')
			.contentWidth('90px')
			.bindValue(this, ()=>this.isHidden);			

	}

	plot(dTreez, axisSelection, rectSelection, axis) {
		this.addListenerAndRun(()=>this.number, ()=>this.__replotMinorTicks(axisSelection, axis));		
		return axisSelection;
	}

	__replotMinorTicks(axisSelection, axis) {		

		if (axis.data.isOrdinal) {
			return; //ordinal axis has no minor ticks
		}
		
		var isHorizontal = axis.data.direction.isHorizontal;
		var isLog = axis.data.isLog;

		

		var minorTickLineSelections;
		if (isLog) {
			minorTickLineSelections = this.__createMinorTickLinesForLogScale(axisSelection, isHorizontal);
		} else {
			minorTickLineSelections = this.__createMinorTickLinesForLinearScale(axisSelection, axis, isHorizontal);
		}
				
		
		this.addListenerAndRun(()=>this.length, () => {
			var axisIsHorizontal = axis.data.direction.isHorizontal;
			if (axisIsHorizontal) {
				minorTickLineSelections.primary.attr('y2', '-' + this.length);
				minorTickLineSelections.secondary.attr('y2', this.length);
			} else {
				minorTickLineSelections.primary.attr('x2', this.length);
				minorTickLineSelections.secondary.attr('x2', '-' + this.length);
			}
		});			

		
		var allMinorTickLines = axisSelection.selectAll('g') //
										     .selectAll('.minor') //
										     .selectAll('line')
										     .style('stroke-linecap', 'butt'); //
											 //.style('shape-rendering', 'geometricPrecistion');
		
		this.bindColor(()=>this.color, allMinorTickLines, 'stroke');
		this.bindString(()=>this.width, allMinorTickLines, 'stroke-width');
		this.bindLineStyle(()=>this.style, allMinorTickLines);
		this.bindLineTransparency(()=>this.transparency, allMinorTickLines);
		this.bindBooleanToLineTransparency(()=>this.isHidden, ()=>this.transparency, allMinorTickLines);	

		
	}

	__createMinorTickLinesForLogScale(axisSelection, isHorizontal) {

		//note: for log scales no additional minor ticks are created;
		//only the already existing ticks are used (and modified in their length)

		var minorTickLineSelections = new PrimaryAndSecondarySelection();

		axisSelection.selectAll('g') //
			.selectAll('.tick:not(.major)') //
			.classed('minor', true);

		var primaryMinorTickLines = axisSelection //
				.selectAll('.primary') //
				.selectAll('.minor') //
				.selectAll('line');
		minorTickLineSelections.pimary = primaryMinorTickLines;

		var secondaryMinorTickLines = axisSelection //
				.selectAll('.secondary') //
				.selectAll('.minor') //
				.selectAll('line');
		
		minorTickLineSelections.secondary = secondaryMinorTickLines;
		if (isHorizontal) {
			primaryMinorTickLines.attr('y2', '-' + this.length);
			secondaryMinorTickLines.attr('y2', this.length);
		} else {
			primaryMinorTickLines.attr('x2', this.length);
			secondaryMinorTickLines.attr('x2', '-' + this.length);
		}

		return minorTickLineSelections;
	}

	__createMinorTickLinesForLinearScale(axisSelection, axis, isHorizontal) {
		var minorTickLineSelections = new PrimaryAndSecondarySelection();

		//remove old minor ticks
		axisSelection.selectAll('.minor').remove();

		//recreate minor ticks
		var minorTickData = this.__createMinorTickData(axis);		

		var primaryMinorTicks = axisSelection //
				.selectAll('.primary') //
				.selectAll('.tick') //
				.data(minorTickData, function(d) {
					 return d; 
					 }) //
				.enter() //
				.insert('g', '.domain') //insert instead of append to ensure that tick lines are not on top in 'z-order'
				.classed('minor', true);

		var primaryMinorTickLines = primaryMinorTicks //
				.append('line');
		minorTickLineSelections.primary = primaryMinorTickLines;

		var secondaryMinorTicks = axisSelection //
				.selectAll('.secondary') //
				.selectAll('tick') //
				.data(minorTickData, function(d) { return d; }) //
				.enter() //
				.insert('g', '.domain') //insert instead of append to ensure that tick lines are not on top in 'z-order'
				.classed('minor', true);

		var secondaryMinorTickLines = secondaryMinorTicks //
				.append('line');
		minorTickLineSelections.secondary = secondaryMinorTickLines;

		//set tick line geometry
		
		var scale = axis.scale;
		
		if (isHorizontal) {
			primaryMinorTickLines //
					.attr('x1', scale) //
					.attr('x2', scale)
					.attr('y1', '0') //
					.attr('y2', '-' + this.length); //
			secondaryMinorTickLines //
					.attr('x1', scale) //
					.attr('x2', scale) //
					.attr('y1', '0') //
					.attr('y2', this.length);

		} else {
			primaryMinorTickLines //
					.attr('x1', '0') //
					.attr('x2', this.length) //
					.attr('y1', scale) //
					.attr('y2', scale);
			secondaryMinorTickLines //
					.attr('x1', '0') //
					.attr('x2', '-' + this.length) //
					.attr('y1', scale) //
					.attr('y2', scale);
		}		

		return minorTickLineSelections;
	}

	__createMinorTickData(axis){

		var scale = axis.scale;
		var existingTickData = scale.ticks(axis.majorTicks.numberOfTicksAimedFor);		
		var tickData = scale.ticks(this.numberOfTicksAimedFor);

		for (var tickValue of existingTickData){
			var index = tickData.indexOf(tickValue);
			if(index > -1){
				tickData.splice(index,1);
			}
		}
		return tickData;
	}

	get numberOfTicksAimedFor() {		
		try {
			return parseInt(this.number);
		} catch (error) {
			return 0;	
		}		
	}	

}
