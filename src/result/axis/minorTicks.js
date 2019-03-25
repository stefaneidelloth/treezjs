import GraphicsAtom from './../graphics/graphicsAtom.js';
import PrimaryAndSecondarySelection from './primaryAndSecondarySelection.js';

export default class MinorTicks extends GraphicsAtom {
	
	constructor(){		
		super();
		this.number = '40'; //Number of minor ticks aimed for
		this.color = Color.black;
		this.width = '2'
		this.length = '5';
		this.style = LineStyle.solid;
		this.transparency = '0';
		this.isHidden = false;
	}	

	createPage(root) {
		
		var page = root.append('treez-section')
		.label('Minor ticks');
	
		var section = page.append('treez-section')
			.label('Ticks');
	
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-text-field')
			.label('Number')
			.bindValue(this, ()=>this.number);
		
		sectionContent.append('treez-color')
			.label('Color')
			.bindValue(this, ()=>this.color);
		
		sectionContent.append('treez-text-field')
			.label('Width')
			.bindValue(this, ()=>this.width);
		
		sectionContent.append('treez-text-field')
			.label('Length')
			.bindValue(this, ()=>this.length);
		
		sectionContent.append('treez-line-style')
			.label('Line style')
			.bindValue(this, ()=>this.style);
		
		sectionContent.append('treez-text-field')
			.label('Transparency')
			.bindValue(this, ()=>this.transparency);
		
		sectionContent.append('treez-check-box')
			.label('IsHidden')
			.bindValue(this, ()=>this.isHidden);			

	}

	plot(dTreez, axisSelection, rectSelection, parent) {
		this.addListenerAndRun(()=>this.number, ()=>this.__replotMinorTicks(axisSelection, parent));		
		return axisSelection;
	}

	__replotMinorTicks(axisSelection, axis) {		

		if (axis.data.isOrdinal) {
			return; //ordinal axis has no minor ticks
		}

		var scale = axis.scale;
		var isHorizontal = axis.data.direction.isHorizontal;
		var isLog = axis.data.isLog;

		var minorTickLineSelections;
		if (isLog) {
			minorTickLineSelections = this.__createMinorTickLinesForLogScale(axisSelection, isHorizontal);
		} else {
			minorTickLineSelections = this.__createMinorTickLinesForLinearScale(axisSelection, scale, isHorizontal);
		}
		
		this.addListener(()=>this.length, () => {
			var axisIsHorizontal = axis.data.direction.isHorizontal;
			if (axisIsHorizontal) {
				minorTickLineSelections.primary.attr('y2', '-' + length.get());
				minorTickLineSelections.secondary.attr('y2', length.get());
			} else {
				minorTickLineSelections.primary.attr('x2', length.get());
				minorTickLineSelections.secondary.attr('x2', '-' + length.get());
			}
		});

		
		var allMinorTickLines = axisSelection.selectAll('g') //
										     .selectAll('.minor') //
										     .selectAll('line');
		
		this.bindString(()=>this.color, allMinorTickLines, 'stroke');
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
			primaryMinorTickLines.attr('y2', '-' + length.get());
			secondaryMinorTickLines.attr('y2', length.get());
		} else {
			primaryMinorTickLines.attr('x2', length.get());
			secondaryMinorTickLines.attr('x2', '-' + length.get());
		}

		return minorTickLineSelections;
	}

	__createMinorTickLinesForLinearScale(axisSelection, linearScale, isHorizontal) {
		var minorTickLineSelections = new PrimaryAndSecondarySelection();

		//remove old minor ticks
		axisSelection.selectAll('.minor').remove();

		//recreate minor ticks
		var numberOfTicksAimedFor = this.numberOfTicksAimedFor;		
		var tickData = linearScale.ticks(numberOfTicksAimedFor);

		var primaryMinorTicks = axisSelection //
				.selectAll('.primary') //
				.selectAll('.tick') //
				.data(tickData, function(d) { return d; }) //
				.enter() //
				.insert('g', '.domain') //insert instead of append to ensure that tick lines are not on top in 'z-order'
				.classed('minor', true);

		var primaryMinorTickLines = primaryMinorTicks //
				.append('line') //
				.attr('stroke', 'black');
		minorTickLineSelections.primary = primaryMinorTickLines;

		var secondaryMinorTicks = axisSelection //
				.selectAll('.secondary') //
				.selectAll('tick') //
				.data(tickData, function(d) { return d; }) //
				.enter() //
				.insert('g', '.domain') //insert instead of append to ensure that tick lines are not on top in 'z-order'
				.classed('minor', true);

		var secondaryMinorTickLines = secondaryMinorTicks //
				.append('line') //
				.attr('stroke', 'black');
		minorTickLineSelections.secondary = secondaryMinorTickLines;

		//set tick line geometry
		if (isHorizontal) {
			primaryMinorTickLines //
					.attr('x1', linearScale) //
					.attr('x2', linearScale)
					.attr('y1', '0') //
					.attr('y2', '-' + this.length); //
			secondaryMinorTickLines //
					.attr('x1', linearScale) //
					.attr('x2', linearScale) //
					.attr('y1', '0') //
					.attr('y2', this.length);

		} else {
			primaryMinorTickLines //
					.attr('x1', '0') //
					.attr('x2', this.length) //
					.attr('y1', linearScale) //
					.attr('y2', linearScale);
			secondaryMinorTickLines //
					.attr('x1', '0') //
					.attr('x2', '-' + this.length) //
					.attr('y1', linearScale) //
					.attr('y2', linearScale);
		}

		return minorTickLineSelections;
	}

	get numberOfTicksAimedFor() {
		var numberOfTicks = 0;
		try {
			numberOfTicks = parseInt(this.number);
		} catch (error) {			
		}
		return numberOfTicks;
	}	

}
