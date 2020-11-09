import GraphicsAtom from './../graphics/graphicsAtom.js';
import Length from './../graphics/length.js';
import Color from './../../components/color/color.js';
import ColorMap from './../../components/colorMap/colorMap.js';
import LineStyle from './../../components/lineStyle/lineStyle.js';
import ChordNode from './chordNode.js';

export default class NodeLabels extends GraphicsAtom {
	
	constructor(){
		super(); 

        this.textDistance = '30 px'; 
        this.textAngleOffset = 0.0;
        this.font = 'sans-serif';
		this.size = 15;
		this.color = 'black';
		this.isItalic = false;
		this.isBold = false;
		this.hasUnderline = false;
        this.isShowingTextLabels = true; 
        this.isAzimuthal = false;

        this.imageDistance = '10 px'; 
        this.imageAngleOffset = 0;
        this.imageRotation = 0;
        this.isShowingImageLabels = true;
		this.isAutoFlippingImageLabels = true;         
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

		sectionContent.append('treez-check-box')
			.label('Show text labels')
			.bindValue(this, ()=>this.isShowingTextLabels);	

		sectionContent.append('treez-check-box')
			.label('Azimuthal')
			.bindValue(this, ()=>this.isAzimuthal);					

	}

	__createImageSection(tab){
        var section = tab.append('treez-section')
			.label('Image');	
		
		var sectionContent = section.append('div');

		sectionContent.append('treez-text-field')
			.label('Distance')
			.bindValue(this, ()=>this.imageDistance);	

		sectionContent.append('treez-double')
			.label('Angle offset')
			.bindValue(this, ()=>this.imageAngleOffset);

		sectionContent.append('treez-double')
			.label('Rotation')
			.bindValue(this, ()=>this.imageRotation);	

		sectionContent.append('treez-check-box')
			.label('Show image labels')
			.bindValue(this, ()=>this.isShowingImageLabels);

		sectionContent.append('treez-check-box')
			.label('Auto flip image labels')
			.bindValue(this, ()=>this.isAutoFlippingImageLabels);	
		
	}

	plot(dTreez, chordContainer, rectSelection, chord) {

		chordContainer.selectAll('.chord-node-label')
		    .remove();

		var labelGroups = chordContainer
		  .datum(chord.chordDatum)
		  .append('g')
		  .className('chord-node-label')	
		  .selectAll('g')
		  .data(d => d.groups)
		  .enter();
	    
	    this.__plotImageLabels(dTreez, labelGroups, chord);
	    this.__plotTextLabels(dTreez, labelGroups, chord);		      

		return chordContainer;
	}

	__plotTextLabels(dTreez, labelGroups, chord){
		var outerRadius = Length.toPx(chord.nodes.outerRadius);	
		var textDistance = Length.toPx(this.textDistance);
		var labelRadius = outerRadius + textDistance;
					
        var ids = chord.nodeIds;		
	
		var textLabels = labelGroups		  
		    .append('text');

	    if(this.isAzimuthal){ 

	        labelGroups.selectAll('dev')
		        .remove();

	       var alignmentNodes = labelGroups	          
			  .append('dev')          
			  .append('path')
			  .attr('id',(d,i) => 'treez-chord-label-path-' + i)			  					
			  .attr('d', dTreez.arc()			  
						  .outerRadius(labelRadius)
						  .innerRadius(labelRadius)
			  );	        	                                 

			textLabels.append('textPath')
                .attr('xlink:href', (d, i) => '#treez-chord-label-path-' + i)
                .attr('startOffset', '25%')               
                .attr('text-anchor','middle')            
                .text((d,i) => ids[i]);


	    }	else {
            textLabels              
		      .each(group => { 
		          group.angle = (group.startAngle + group.endAngle) / 2;		         
		      })
              .text((d,i) => ids[i])
              .attr('transform', group => this.__transformTextLabel(group, labelRadius))
			  .attr('text-anchor', group => { return group.angle > Math.PI ? 'end' : null; })			    
			  .attr('dy','0.35em');  
	    }	    
	    				
		this.addListener(()=>this.textDistance, ()=>chord.updatePlot(dTreez));
		this.addListener(()=>this.textAngleOffset, ()=>chord.updatePlot(dTreez));

		this.bindString(()=>this.font, textLabels, 'font-family');
		this.bindString(()=>this.size, textLabels, 'font-size');
		this.bindColor(()=>this.color, textLabels, 'fill');			
		this.bindFontItalicStyle(()=>this.isItalic, textLabels);
		this.bindFontBoldStyle(()=>this.isBold, textLabels);
		this.bindFontUnderline(()=>this.hasUnderline, textLabels);
		
		this.bindBooleanToDisplay(()=>this.isShowingTextLabels, textLabels);
		this.addListener(()=>this.isAzimuthal, ()=>chord.updatePlot(dTreez));
	}	

	__transformTextLabel(group, labelRadius){		
       
		var isBackAngle = group.angle > Math.PI;
        var extraRotation = '';
        if(isBackAngle) {
        	extraRotation = 'rotate(180)';
        } 
        if(this.isAzimuthal){
        	extraRotation = 'rotate(90)';
        }	
		
		var rotation = group.angle * 180 / Math.PI + this.textAngleOffset - 90;

		var transform =  'rotate(' + rotation + ') '
			+ 'translate(' + labelRadius + ') '
			+ extraRotation;
		return transform;
	}

	__plotImageLabels(dTreez, labelGroups, chord){
       
        var outerRadius = Length.toPx(chord.nodes.outerRadius);	
		var imageDistance = Length.toPx(this.imageDistance);
		var imageRadius = outerRadius + imageDistance;

		var svgs = chord.nodeSvgs;

		labelGroups.selectAll('.chord-node-image-label')
		    .remove();

		var imageLabels = labelGroups
		      .append('g')
			  .className('chord-node-image-label')
			  .html((d,i) => svgs[i])
			  .each(group => { group.angle = (group.startAngle + group.endAngle) / 2; })
			  .attr('transform', (group, index, elements) => 
			  	this.__transformImageLabel(group, index, elements, imageRadius)
			  );  
		
		this.bindBooleanToDisplay(()=>this.isShowingImageLabels, imageLabels);
        this.addListener(()=>this.isAutoFlippingImageLabels, ()=>chord.updatePlot(dTreez));		
		this.addListener(()=>this.imageDistance, ()=>chord.updatePlot(dTreez));
		this.addListener(()=>this.imageAngleOffset, ()=>chord.updatePlot(dTreez));
		this.addListener(()=>this.imageRotation, ()=>chord.updatePlot(dTreez));
	}

	__transformImageLabel(group, index, elements, imageRadius){		

		
		var rotation = group.angle * 180 / Math.PI + this.imageAngleOffset - 90;

		var element = elements[index];
	    var bounds = element.childNodes[0].getBoundingClientRect();
	    var svgWidth = bounds.width;
	    var svgHeight = bounds.height;

	    var transform = '';

	    var isBackAngle = group.angle > Math.PI;

		if(isBackAngle && this.isAutoFlippingImageLabels){				
			transform =  'rotate(' + rotation + ') '
				+ 'translate(' + imageRadius + ') '
				+ 'rotate(180) '	
				+ 'translate(0,-'+ svgHeight/2 + ') '
				+ 'translate(-' + svgWidth + ') '
				+ 'rotate('+ this.imageRotation +' ' + svgWidth/2 + ' ' +svgHeight/2+ ')';
								
		} else {
			transform =  'rotate(' + rotation + ') '
				+ 'translate(' + imageRadius + ') '
				+ 'translate(0, -'+ svgHeight/2 + ')'
				+ 'rotate('+ this.imageRotation +' ' + svgWidth/2 + ' ' +svgHeight/2+ ')';
		}		

		return transform;
	}



}
