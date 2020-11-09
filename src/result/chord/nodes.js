import GraphicsAtom from './../graphics/graphicsAtom.js';
import Length from './../graphics/length.js';
import Color from './../../components/color/color.js';
import ColorMap from './../../components/colorMap/colorMap.js';
import LineStyle from './../../components/lineStyle/lineStyle.js';
import ChordNode from './chordNode.js';

export default class Nodes extends GraphicsAtom {
	
	constructor(){
		super();
		this.outerRadius = '4 cm';		
        this.innerRadius = '3.8 cm';
        this.paddingAngle = 0.05;
        this.colorMap = ColorMap.Turbo;
        this.strokeWidth = '1';       
	}
	
	createPage(root) {
		
		var tab = root.append('treez-tab')
			.label('Nodes');

		var section = tab.append('treez-section')
			.label('Nodes');	
		
		var sectionContent = section.append('div');

		sectionContent.append('treez-text-field')
			.label('Outer radius')
			.bindValue(this, ()=>this.outerRadius);

		sectionContent.append('treez-text-field')
			.label('Inner radius')
			.bindValue(this, ()=>this.innerRadius);

		sectionContent.append('treez-double')
			.label('Padding angle')
			.bindValue(this, ()=>this.paddingAngle);

		sectionContent.append('treez-color-map')
			.label('Color map')
			.bindValue(this, ()=>this.colorMap);

		sectionContent.append('treez-text-field')
			.label('Stroke width')
			.bindValue(this, ()=>this.strokeWidth);		
		
	}

	plot(dTreez, chordContainer, rectSelection, chord) {			

		var outerRadius = Length.toPx(this.outerRadius);
		var innerRadius = Length.toPx(this.innerRadius);       

		var colors = this.nodeColors;

		chordContainer.selectAll('.chord-node')
		    .remove();
				
        var nodeSelection = chordContainer
		  .datum(chord.chordDatum)
		  .append('g')			  
		  .className('chord-node')		  	  	  
		  .selectAll('g')
		  .data(d => d.groups)
		  .enter()
		  .append('g')          
		  .append('path')		   
			.style('fill', (d,i) => colors[i])
			.style('stroke', 'black')			
			.attr('d', dTreez.arc()			  
			  .outerRadius(outerRadius)
			  .innerRadius(innerRadius)
			);

		this.bindString(()=>this.strokeWidth, nodeSelection, 'stroke-width');

		
       
        this.addListener(()=>this.outerRadius, ()=>chord.updatePlot(dTreez));
        this.addListener(()=>this.innerRadius, ()=>chord.updatePlot(dTreez));
		this.addListener(()=>this.paddingAngle, ()=>chord.updatePlot(dTreez));

		return chordContainer;
	}

	plotLegendLine(dTreez, parentSelection, length) {

		/*

		var linePathGenerator = dTreez //				
				.line();

		var path = linePathGenerator([[0, 0],[length, 0]]);

		var legendLine = parentSelection //
				.append('path') //
				.classed('legend-line', true)
				.attr('d', path)
				.attr('fill', 'none');

		//bind attributes
		this.bindBooleanToNegatingDisplay(()=>this.isHidden, legendLine);
		this.bindString(()=>this.color,legendLine, 'stroke');
		this.bindString(()=>this.width,legendLine, 'stroke-width');
		this.bindLineTransparency(()=>this.transparency, legendLine)
		this.bindLineStyle(()=>this.style, legendLine);		

		*/

		return parentSelection;
	}

	get nodeColors(){

		var colors = [];
		var chordNodes = this.parent.childrenByClass(ChordNode);
		for(var chordNode of chordNodes){
			colors.push(chordNode.color.toString());
		}
		return colors.concat([ 'red', 'blue', 'green', 'yellow','orange']);
	}	

}
