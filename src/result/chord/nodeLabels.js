import GraphicsAtom from './../graphics/graphicsAtom.js';
import Length from './../graphics/length.js';
import Color from './../../components/color/color.js';
import ColorMap from './../../components/colorMap/colorMap.js';
import LineStyle from './../../components/lineStyle/lineStyle.js';
import ChordNode from './chordNode.js';

export default class NodeLabels extends GraphicsAtom {
	
	constructor(){
		super(); 

		this.isShowingImageLabels = true;
		this.isAutoFlippingImageLabels = true;
        this.imageDistance = '10 px'; 
        this.imageAngleOffset = 0.0;

        this.textDistance = '30 px'; 
        this.textAngleOffset = 0.0;
        this.isShowingTextLabels = true;          
	}
	
	createPage(root) {
		
		var tab = root.append('treez-tab')
			.label('Node labels');
		
		
		this.__createTextSection(tab);	
		this.__createImageSection(tab);			
		
	}

	__createTextSection(tab){
        var section = tab.append('treez-section')
			.label('Text');	
		
		var sectionContent = section.append('div');

		sectionContent.append('treez-text-field')
			.label('Distance')
			.bindValue(this, ()=>this.textDistance);

		sectionContent.append('treez-double')
			.label('Angle offset')
			.bindValue(this, ()=>this.textAngleOffset);

		sectionContent.append('treez-check-box')
			.label('Show text labels')
			.bindValue(this, ()=>this.isShowingTextLabels);					

	}

	__createImageSection(tab){
        var section = tab.append('treez-section')
			.label('Image');	
		
		var sectionContent = section.append('div');

		sectionContent.append('treez-text-field')
			.label('Image distance')
			.bindValue(this, ()=>this.imageDistance);	

		sectionContent.append('treez-double')
			.label('Angle offset')
			.bindValue(this, ()=>this.imageAngleOffset);	

		sectionContent.append('treez-check-box')
			.label('Show image labels')
			.bindValue(this, ()=>this.isShowingImageLabels);

		sectionContent.append('treez-check-box')
			.label('Auto flip image labels')
			.bindValue(this, ()=>this.isAutoFlippingImageLabels);	
		
	}

	plot(dTreez, chordContainer, rectSelection, chord) {
	    
	    this.__plotImageLabels(dTreez, chord);
	    this.__plotTextLabels(dTreez, chord);		      

		return chordContainer;
	}

	__plotTextLabels(dTreez, chord){
		var outerRadius = Length.toPx(chord.nodes.outerRadius);	
		var textDistance = Length.toPx(this.textDistance);
		var labelRadius = outerRadius + textDistance;
					
        var ids = chord.nodeIds;

		chord.nodeGroups.selectAll('.chord-node-label')
		    .remove();

		var textLabels = chord.nodeGroups.append('svg:text')
			  .className('chord-node-label')
			  .text((d,i) => ids[i])			  
			  .each(nodeGroup => { nodeGroup.angle = (nodeGroup.startAngle + nodeGroup.endAngle) / 2; })			 	  	
			  .attr('text-anchor', nodeGroup => { return nodeGroup.angle > Math.PI ? 'end' : null; })
			  .attr('transform', nodeGroup => this.__transformTextLabel(nodeGroup, labelRadius))     
			  .attr('dy','0.35em');  
		
		this.bindBooleanToDisplay(()=>this.isShowingTextLabels, textLabels);
		this.addListener(()=>this.textDistance, ()=>chord.updatePlot(dTreez));
		this.addListener(()=>this.textAngleOffset, ()=>chord.updatePlot(dTreez));
	}	

	__transformTextLabel(nodeGroup, labelRadius){
		

		var isBackAngle = nodeGroup.angle > Math.PI;
        var extraRotation = isBackAngle
				? 'rotate(180)' 
				: '';

		var angle = nodeGroup.angle + this.textAngleOffset;
		var rotation = (angle * 180 / Math.PI - 90);

		var transform =  'rotate(' + rotation + ') '
			+ 'translate(' + labelRadius + ') '
			+ extraRotation;
		return transform;
	}

	__plotImageLabels(dTreez, chord){
       
        var outerRadius = Length.toPx(chord.nodes.outerRadius);	
		var imageDistance = Length.toPx(this.imageDistance);
		var imageRadius = outerRadius + imageDistance;

		var svgs = chord.nodeSvgs;

		chord.nodeGroups.selectAll('.chord-node-image-label')
		    .remove();

		var imageLabels = chord.nodeGroups
		      .append('g')
			  .className('chord-node-image-label')
			  .html((d,i) => svgs[i])
			  .each(nodeGroup => { nodeGroup.angle = (nodeGroup.startAngle + nodeGroup.endAngle) / 2; })
			  .attr('transform', (nodeGroup, index, elements) => 
			  	this.__transformImageLabel(nodeGroup, index, elements, imageRadius)
			  );  
		
		this.bindBooleanToDisplay(()=>this.isShowingImageLabels, imageLabels);
        this.addListener(()=>this.isAutoFlippingImageLabels, ()=>chord.updatePlot(dTreez));		
		this.addListener(()=>this.imageDistance, ()=>chord.updatePlot(dTreez));
		this.addListener(()=>this.imageAngleOffset, ()=>chord.updatePlot(dTreez));
	}

	__transformImageLabel(nodeGroup, index, elements, imageRadius){	
		

		var angle = nodeGroup.angle + this.imageAngleOffset;
		var rotation = (angle * 180 / Math.PI - 90);

		var element = elements[index];
	    var bounds = element.childNodes[0].getBoundingClientRect();
	    var svgWidth = bounds.width;
	    var svgHeight = bounds.height;

	    var transform = '';

	    var isBackAngle = nodeGroup.angle > Math.PI;

		if(isBackAngle && this.isAutoFlippingImageLabels){				
			transform =  'rotate(' + rotation + ') '
				+ 'translate(' + imageRadius + ') '
				+ 'rotate(180) '	
				+ 'translate(0,-'+ svgHeight/2 + ') '
				+ 'translate(-' + svgWidth + ')';
								
		} else {
			transform =  'rotate(' + rotation + ') '
				+ 'translate(' + imageRadius + ') '
				+ 'translate(0, -'+ svgHeight/2 + ')';
		}		

		return transform;
	}



}
