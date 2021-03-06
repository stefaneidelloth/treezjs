import GraphicsAtom from './../graphics/graphicsAtom.js';
import Color from './../../components/color/color.js';
import LineStyle from './../../components/lineStyle/lineStyle.js';

export default class MajorTicks extends GraphicsAtom {
	
	constructor(){	
		super();	
		this.number = 6; 
		this.color = Color.black;
		this.width = 2
		this.length = 10;
		this.style = LineStyle.solid;
		this.transparency = 0;
		this.isHidden = false;
	}	

	createPage(root) {
		
		var page = root.append('treez-tab')
			.label('Major ticks');
		
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

		//Hint: The major tick lines already have been created with the axis (see Data).
		//Here only the properties of the ticks need to be applied.

		var primary = axisSelection //
				.selectAll('.primary');

		var secondary = axisSelection //
				.selectAll('.secondary');

		this.__markMajorTicksWithCssClass(axis, primary, secondary);

		var primaryMajorTickLines = primary //
				.selectAll('.major') //
				.selectAll('line');

		var secondaryMajorTickLines = secondary //
				.selectAll('.major') //
				.selectAll('line');				

		var majorTickLines = axisSelection //
				.selectAll('g') //
				.selectAll('.major') //
				.selectAll('line')
				.style('stroke-linecap', 'butt'); //
				//.style('shape-rendering', 'geometricPrecision');;
		
		this.addListener(()=>this.number, () => axis.updatePlot(dTreez))

		this.addListenerAndRun(()=>this.length, () => {
			var isHorizontal = axis.data.direction.isHorizontal;
			if (isHorizontal) {
				primaryMajorTickLines.attr('y2', '-' + this.length);
				secondaryMajorTickLines.attr('y2', '' + this.length);
			} else {
				primaryMajorTickLines.attr('x2', this.length);
				secondaryMajorTickLines.attr('x2', '-' + this.length);
			}
		});

		this.bindColor(()=>this.color, majorTickLines, 'stroke');
		this.bindString(()=>this.width, majorTickLines, 'stroke-width');
		this.bindLineStyle(()=>this.style, majorTickLines);
		this.bindLineTransparency(()=>this.transparency, majorTickLines);
		this.bindBooleanToLineTransparency(()=>this.isHidden, ()=>this.transparency, majorTickLines);		

		return axisSelection;
	}

	

	__markMajorTicksWithCssClass(axis, primary, secondary) {

		if (axis.data.isQuantitative) {
			var isLog = axis.data.isLog;
			if (isLog) {

				primary.selectAll('.tick:nth-child(1)') //
						.classed('major', true);

				primary.selectAll('.tick:nth-child(9n+1)') //
						.classed('major', true);

				secondary.selectAll('.tick:nth-child(1)') //
						.classed('major', true);

				secondary.selectAll('.tick:nth-child(9n+1)') //
						.classed('major', true);
				return;
			}
		}

		primary.selectAll('.tick') //
				.classed('major', true);

		secondary.selectAll('.tick') //
				.classed('major', true);

	}

	get numberOfTicksAimedFor() {		
		try {
			return parseInt(this.number);
		} catch (error) {
			return 0;	
		}		
	}	

	

}
