import GraphicsAtom from './../graphics/graphicsAtom.js';
import Length from './../graphics/length.js';
import Color from './../../components/color/color.js';
import LineStyle from './../../components/lineStyle/lineStyle.js';

export default class MajorTicks extends GraphicsAtom {
	
	constructor(){	
		super();	
		this.tickInterval = 5; 
		this.color = Color.black;
		this.width = 1
		this.length = 5;
		this.style = LineStyle.solid;
		this.transparency = 0;
		this.isHidden = false;
	}	

	createPage(root) {
		
		var page = root.append('treez-tab')
			.label('Ticks');
		
		var section = page.append('treez-section')
			.label('Ticks');

		var sectionContent = section.append('div');
		
		sectionContent.append('treez-integer')
			.label('Interval')
			.labelWidth('90px')
			.min('0')
			.bindValue(this, ()=>this.tickInterval);
		
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
		
		sectionContent.append('treez-unit-interval')
			.label('Transparency')
			.labelWidth('90px')			
			.bindValue(this, ()=>this.transparency);
		
		sectionContent.append('treez-check-box')
			.label('IsHidden')
			.contentWidth('90px')
			.bindValue(this, ()=>this.isHidden);		

	}

	plot(dTreez, chordContainer, rectSelection, chord) {

        var outerRadius = Length.toPx(chord.nodes.outerRadius); 

        chord.nodeGroups.selectAll('.group-tick')
            .selectAll('.treez-chord-tick')
		    .remove();  		
		
		var tickLines = chord.nodeGroups
		  .selectAll('.group-tick')
		  .data(group => chord.groupTicks(dTreez, group, this.tickIntervalAimedFor)) // Controls the number of ticks: one tick each 25 here.
		  .enter()
		  .append('g')
		  .className('treez-chord-tick')
		  .attr('transform', group => 
			  'rotate(' + (group.angle * 180 / Math.PI - 90) + ') '+
			  'translate(' + outerRadius + ',0)'
		  )
		  .append('line')               // By default, x1 = y1 = y2 = 0, so no need to specify it.
			.attr('x2', '' + this.length + 'px')
			.attr('stroke', 'black')
			.style('stroke-linecap', 'butt'); 				
		  //.style('shape-rendering', 'geometricPrecision');
		
		this.addListener(()=>this.tickInterval, () => chord.updatePlot(dTreez))
		this.addListener(()=>this.length, () => chord.updatePlot(dTreez))		

		this.bindColor(()=>this.color, tickLines, 'stroke');
		this.bindString(()=>this.width, tickLines, 'stroke-width');
		this.bindLineStyle(()=>this.style, tickLines);
		this.bindLineTransparency(()=>this.transparency, tickLines);
		this.bindBooleanToLineTransparency(()=>this.isHidden, ()=>this.transparency, tickLines);		

		return chordContainer;		
	}
	
	get tickIntervalAimedFor() {		
		try {
			return parseInt(this.tickInterval);
		} catch (error) {
			return 0;	
		}		
	}	

	

}
