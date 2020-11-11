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
        this.paddingAngle = 2;
        this.colorMap = ColorMap.Turbo;
        this.fillTransparency = 0.2;
        this.strokeWidth = '0';       
	}
	
	createPage(root) {
		
		var tab = root.append('treez-tab')
			.label('Nodes');

        this.__createShapeSection(tab);
        this.__createFillSection(tab);
        this.__createStrokeSection(tab);	
		
	}

	__createShapeSection(tab){
		var section = tab.append('treez-section')
			.label('Shape');	
		
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
	}

	__createFillSection(tab){
		var section = tab.append('treez-section')
			.label('Fill');	
		
		var sectionContent = section.append('div');

		sectionContent.append('treez-color-map')
			.label('Color map')
			.bindValue(this, ()=>this.colorMap);

		sectionContent.append('treez-unit-interval')
			.label('Transparency')
			.bindValue(this, ()=>this.fillTransparency);
	}

	__createStrokeSection(tab){
		var section = tab.append('treez-section')
			.label('Stroke');	
		
		var sectionContent = section.append('div');

		sectionContent.append('treez-text-field')
			.label('Width')
			.bindValue(this, ()=>this.strokeWidth);		
	}

	plot(dTreez, chordContainer, rectSelection, chord) {	

	    this.__dTreez = dTreez;		

		var outerRadius = Length.toPx(this.outerRadius);
		var innerRadius = Length.toPx(this.innerRadius);       

		var colors = this.nodeColors;

		var nodeIds = chord.nodeIds;

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

		nodeSelection.append('title')
		  .text(group => this.nodeTitle(group, nodeIds));

        this.bindTransparency(()=>this.fillTransparency, nodeSelection);
		this.bindString(()=>this.strokeWidth, nodeSelection, 'stroke-width');		
       
        this.addListener(()=>this.outerRadius, ()=>chord.updatePlot(dTreez));
        this.addListener(()=>this.innerRadius, ()=>chord.updatePlot(dTreez));
		this.addListener(()=>this.paddingAngle, ()=>chord.updatePlot(dTreez));
		this.addListener(()=>this.colorMap, ()=>chord.updatePlot(dTreez));

		return chordContainer;
	}

	nodeTitle(group, nodeIds){
		var id = nodeIds[group.index];
		return id + ': ' + group.value;
	}

	get nodeColors(){

		var nodeIds = this.parent.nodeIds;
		var numberOfNodes = nodeIds.length;

		var colors = [];
		var chordNodes = this.parent.childrenByClass(ChordNode);
		

		if(chordNodes.length > 0){
			for(var chordNode of chordNodes){
			    colors.push(chordNode.color.toString());
		    }
		    if(colors.length < numberOfNodes){
		    	console.warn('There are less chord node children than nodes');
		    }
		}

        var numberOfExtraColors = numberOfNodes - colors.length;
        if(numberOfExtraColors > 0){        	
            var interpolateColor = this.__dTreez['interpolate' + this.colorMap];

            var distance = 1/numberOfExtraColors;
            for(var index = 0; index < numberOfExtraColors; index++){
            	var extraColor = interpolateColor.call(this.__dTreez, index*distance);
            	colors.push(extraColor);
            }
            
        }
        

		return colors;
	}	

}
