import GraphicsAtom from './../graphics/graphicsAtom.js';
import Length from './../graphics/length.js';
import Color from './../../components/color/color.js';
import ColorMap from './../../components/colorMap/colorMap.js';
import LineStyle from './../../components/lineStyle/lineStyle.js';
import SankeyNode from './sankeyNode.js';

export default class NodeLabels extends GraphicsAtom {
	
	constructor(){
		super(); 

        this.textDistance = '30 px';        
        this.font = 'sans-serif';
		this.size = 15;
		this.color = 'black';
		this.isItalic = false;
		this.isBold = false;
		this.hasUnderline = false;
        this.isShowingTextLabels = true;        

        this.imageDistance = '10 px';  
        this.isShowingImageLabels = true;		     
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

	}

	__createImageSection(tab){
        var section = tab.append('treez-section')
			.label('Image');	
		
		var sectionContent = section.append('div');

		sectionContent.append('treez-text-field')
			.label('Distance')
			.bindValue(this, ()=>this.imageDistance);
		
		sectionContent.append('treez-check-box')
			.label('Show image labels')
			.bindValue(this, ()=>this.isShowingImageLabels);		
		
	}

	plot(dTreez, sankeyContainer, rectSelection, sankey) {

		sankeyContainer.selectAll('.sankey-node-label')
		    .remove();

		var graphWidth = Length.toPx(sankey.graph.width);
	    var graphHeight = Length.toPx(sankey.graph.height);

	    /*

		sankeyContainer.append("g")
		  .attr("font-family", "sans-serif")
		  .attr("font-size", 10)
		  .selectAll("text")
		  .data(sankey.nodeData)
		  .join("text")
		  .className('.sankey-node-label')
		  .attr("x", d => d.x0 < graphWidth / 2 ? d.x1 + 6 : d.x0 - 6)
		  .attr("y", d => (d.y1 + d.y0) / 2)
		  .attr("dy", "0.35em")
		  .attr("text-anchor", d => d.x0 < graphWidth / 2 ? "start" : "end")
		  .text(d => d.id);

        */

        
		    /*

		    // add in the title for the nodes
		  node.append("text")
			  .attr("x", -6)
			  .attr("y", function(d) { return d.dy / 2; })
			  .attr("dy", ".35em")
			  .attr("text-anchor", "end")
			  .attr("transform", null)
			  .text(function(d) { return d.name; })
			.filter(function(d) { return d.x < width / 2; })
			  .attr("x", 6 + sankey.nodeWidth())
			  .attr("text-anchor", "start");

		var labelGroups = sankeyContainer
		  .datum(sankey.sankeyDatum)
		  .append('g')
		  .className('sankey-node-label')	
		  .selectAll('g')
		  .data(d => d.groups)
		  .enter();
	    
	    this.__plotImageLabels(dTreez, labelGroups, sankey);
	    this.__plotTextLabels(dTreez, labelGroups, sankey);		

	    */      

		return sankeyContainer;
	}

	__plotTextLabels(dTreez, labelGroups, sankey){
			
		var textDistance = Length.toPx(this.textDistance);

		/*
							
        var nodeIds = sankey.nodeIds;		
	
		var textLabels = labelGroups		  
		    .append('text');

	    
		textLabels  
		  .text((d,i) => nodeIds[i])
		  .attr('transform', group => this.__transformTextLabel(group, labelRadius))
		  .attr('text-anchor', group => { return group.angle > Math.PI ? 'end' : null; })			    
		  .attr('dy','0.35em');  
	    

	    textLabels.append('title')
		  .text(group => sankey.nodes.nodeTitle(group, nodeIds));	    
	    				
		this.addListener(()=>this.textDistance, ()=>sankey.updatePlot(dTreez));
		this.addListener(()=>this.textAngleOffset, ()=>sankey.updatePlot(dTreez));

		this.bindString(()=>this.font, textLabels, 'font-family');
		this.bindString(()=>this.size, textLabels, 'font-size');
		this.bindColor(()=>this.color, textLabels, 'fill');			
		this.bindFontItalicStyle(()=>this.isItalic, textLabels);
		this.bindFontBoldStyle(()=>this.isBold, textLabels);
		this.bindFontUnderline(()=>this.hasUnderline, textLabels);
		
		this.bindBooleanToDisplay(()=>this.isShowingTextLabels, textLabels);
		this.addListener(()=>this.isAzimuthal, ()=>sankey.updatePlot(dTreez));

		*/
	}	

	__plotImageLabels(dTreez, labelGroups, sankey){       
       
		var imageDistance = Length.toPx(this.imageDistance);
		
		var svgs = sankey.nodeSvgs;

		/*

		labelGroups.selectAll('.sankey-node-image-label')
		    .remove();

		var imageLabels = labelGroups
		      .append('g')
			  .className('sankey-node-image-label')
			  .html((d,i) => svgs[i])
			  .each(group => { group.angle = (group.startAngle + group.endAngle) / 2; })
			  .attr('transform', (group, index, elements) => 
			  	this.__transformImageLabel(group, index, elements, imageRadius)
			  ); 

		var nodeIds = sankey.nodeIds;

	    imageLabels.append('title')
		  .text(group => sankey.nodes.nodeTitle(group, nodeIds)); 
		
		this.bindBooleanToDisplay(()=>this.isShowingImageLabels, imageLabels);
        this.addListener(()=>this.isAutoFlippingImageLabels, ()=>sankey.updatePlot(dTreez));		
		this.addListener(()=>this.imageDistance, ()=>sankey.updatePlot(dTreez));
		this.addListener(()=>this.imageAngleOffset, ()=>sankey.updatePlot(dTreez));
		this.addListener(()=>this.imageRotation, ()=>sankey.updatePlot(dTreez));

		*/
	}


}
