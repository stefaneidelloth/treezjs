import GraphicsAtom from './../graphics/graphicsAtom.js';
import Color from './../../components/color/color.js';
import Length from './../graphics/Length.js';

export default class Links extends GraphicsAtom {
	
	constructor(){
		super();		
		this.isUsingFillGradient = true;			
	}

	createPage(root) {
		
		var tab = root.append('treez-tab')
			.label('Links');
		
		var section = tab.append('treez-section')
			.label('Links');
	
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-check-box')
			.label('Is using fill gradient')			
			.bindValue(this, ()=>this.isUsingFillGradient);			
	}
	

	plot(dTreez, chordContainer, rectSelection, chord) {

		var colors = chord.nodes.nodeColors;

		var innerRadius = Length.toPx(chord.nodes.innerRadius); 

		chordContainer.selectAll('.chord-link')
		    .remove(); 
		
		chordContainer
		  .datum(chord.chordDatum)
		  .append('g')
		  .className('chord-link')	
		  .selectAll('path')
		  .data(nodeGroup => nodeGroup)
		  .enter()
		  .append('path')
			.attr('d', dTreez.ribbon()
			  .radius(innerRadius)
		  )
		  .style('fill', nodeGroup => this.__determineFillColor(nodeGroup,colors) )
		  .style('stroke', 'black');
		

		return chordContainer;
	}	

	__determineFillColor(nodeGroup, colors){
		return colors[nodeGroup.source.index]
	}
}
