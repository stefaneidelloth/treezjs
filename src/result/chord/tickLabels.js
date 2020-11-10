import GraphicsAtom from './../graphics/graphicsAtom.js';
import Length from './../graphics/length.js';

export default class TickLabels extends GraphicsAtom {
	
	constructor(){
		super();
		this.font = 'sans-serif';
		this.size = 10;
		this.color = 'black';
		this.format = ''
		this.isItalic = false;
		this.isBold = false;
		this.hasUnderline = false;		
		this.offset = 6;
		this.isHidden= false;
	}	

	createPage(root) {
		
		var page = root.append('treez-tab')
			.label('Tick labels');
	
		var section = page.append('treez-section')
			.label('Tick labels');
	
		var sectionContent = section.append('div');

		sectionContent.append('treez-text-field')
			.label('Format')
			.bindValue(this, ()=>this.format);
		
		sectionContent.append('treez-font')
			.label('Font')
			.labelWidth('55px')
			.bindValue(this, ()=>this.font);
		
		sectionContent.append('treez-double')
			.label('Size')
			.labelWidth('55px')
			.min('0')
			.bindValue(this, ()=>this.size);
	
		sectionContent.append('treez-color')
			.label('Color')
			.labelWidth('55px')
			.bindValue(this, ()=>this.color);
		
		
		sectionContent.append('treez-check-box')
			.label('Italic')
			.contentWidth('55px')
			.bindValue(this, ()=>this.isItalic);
		
		sectionContent.append('treez-check-box')
			.label('Bold')
			.contentWidth('55px')
			.bindValue(this, ()=>this.isBold);
		
		sectionContent.append('treez-check-box')
			.label('Has underline')
			.contentWidth('55px')
			.bindValue(this, ()=>this.hasUnderline);			
	
		sectionContent.append('treez-double')
			.label('Offset')
			.labelWidth('55px')		
			.bindValue(this, ()=>this.offset);

		sectionContent.append('treez-check-box')
			.label('IsHidden')
			.contentWidth('55px')
			.bindValue(this, ()=>this.isHidden);

	}

	plot(dTreez, chordContainer, rectSelection, chord) {

		var outerRadius = Length.toPx(chord.nodes.outerRadius);

		var className = 'treez-chord-tick-label';

		var interval = chord.ticks.tickIntervalAimedFor;

		chord.nodeGroups.selectAll('.group-tick-label')
		    .selectAll('.' + className)
		    .remove();   
		
		var tickLabels = chord.nodeGroups
		  .selectAll('.group-tick-label')
		  .data(group => chord.groupTicks(dTreez, group, interval))
		  .enter()
		  .filter((d) => d.value % interval === 0)
		  .append('g')
		  .className(className)
		  .attr('transform', group => 
			    'rotate(' + (group.angle * 180 / Math.PI - 90) + ') ' +
			    'translate(' + outerRadius + ',0)'
		  )
		  .append('text')
			.attr('x', this.offset)
			.attr('dy', '.35em')
			.attr('transform', group => group.angle > Math.PI ? 'rotate(180) translate(-16)' : null)
			.style('text-anchor', group => group.angle > Math.PI ? 'end' : null)
			.text(group => group.value);

		this.bindString(()=>this.font, tickLabels, 'font-family');
		this.bindString(()=>this.size, tickLabels, 'font-size');
		this.bindColor(()=>this.color, tickLabels, 'fill');			
		this.bindFontItalicStyle(()=>this.isItalic, tickLabels);
		this.bindFontBoldStyle(()=>this.isBold, tickLabels);
		this.bindFontUnderline(()=>this.hasUnderline, tickLabels);
		this.bindBooleanToTransparency(()=>this.isHidden, null, tickLabels);

		this.addListener(()=>this.format, ()=> chord.updatePlot(dTreez));
		this.addListener(()=>this.offset, ()=> chord.updatePlot(dTreez));		
		
		return chordContainer;

	}

	
	

}
