import GraphicsAtom from './../graphics/graphicsAtom.js';
import Length from './../graphics/length.js';
import Color from './../../components/color/color.js';
import ColorMap from './../../components/colorMap/colorMap.js';
import LineStyle from './../../components/lineStyle/lineStyle.js';
import SankeyNode from './sankeyNode.js';
import LabelAlignment from './labelAlignment.js';

export default class NodeLabels extends GraphicsAtom {
	
	constructor(){
		super(); 

        this.textAlignment = LabelAlignment.Center;
        this.textHorizontalOffset = '25 px';     
        this.textVerticalOffset = '0 px';        
        this.textFont = 'sans-serif';
		this.textSize = 15;
		this.textColor = 'black';
		this.textIsItalic = false;
		this.textIsBold = false;
		this.textHasUnderline = false;
        this.isShowingTextLabels = true;  

        this.valueAlignment = LabelAlignment.Center;
        this.valueHorizontalOffset = '2 px';     
        this.valueVerticalOffset = '0 px';    
        this.valueFont = 'sans-serif';
		this.valueSize = 15;
		this.valueColor = 'black';
		this.valueIsItalic = false;
		this.valueIsBold = false;
		this.valueHasUnderline = false;
        this.isShowingValueLabels = false;       

        this.imageAlignment = LabelAlignment.Below;
        this.imageHorizontalOffset = '0 px';     
        this.imageVerticalOffset = '20 px';  
        this.isShowingImageLabels = true;		     
	}
	
	createPage(root) {
		
		var tab = root.append('treez-tab')
			.label('Node labels');		
		
		this.__createTextSection(tab);	
		this.__createValueSection(tab);	
		this.__createImageSection(tab);			
		
	}

	__createTextSection(tab){
        var section = tab.append('treez-section')
			.label('Text');	
		
		var sectionContent = section.append('div');

	    sectionContent.append('treez-enum-combo-box')
	        .label('Alignment')
	        .nodeAttr('enum', LabelAlignment)
	        .bindValue(this, ()=>this.textAlignment);

		sectionContent.append('treez-text-field')
			.label('Horizontal offset')
			.bindValue(this, ()=>this.textHorizontalOffset);

		sectionContent.append('treez-text-field')
			.label('Vertical offset')
			.bindValue(this, ()=>this.textVerticalOffset);
	
		sectionContent.append('treez-font')
			.label('Font')
			.labelWidth('55px')
			.bindValue(this, ()=>this.textFont);
		
		sectionContent.append('treez-double')
			.label('Size')
			.labelWidth('55px')
			.min('0')
			.bindValue(this, ()=>this.textSize);
	
		sectionContent.append('treez-color')
			.label('Color')
			.labelWidth('55px')
			.bindValue(this, ()=>this.textColor);	
						
		sectionContent.append('treez-check-box')
			.label('Italic')
			.contentWidth('55px')
			.bindValue(this, ()=>this.textIsItalic);
		
		sectionContent.append('treez-check-box')
			.label('Bold')
			.contentWidth('55px')
			.bindValue(this, ()=>this.textIsBold);
		
		sectionContent.append('treez-check-box')
			.label('Has underline')
			.contentWidth('55px')
			.bindValue(this, ()=>this.textHasUnderline);

		sectionContent.append('treez-check-box')
			.label('Show text labels')
			.bindValue(this, ()=>this.isShowingTextLabels);							

	}

	__createValueSection(tab){
        var section = tab.append('treez-section')
            .attr('collapsed', true)
			.label('Value');	
		
		var sectionContent = section.append('div');

	    sectionContent.append('treez-enum-combo-box')
	        .label('Alignment')
	        .nodeAttr('enum', LabelAlignment)
	        .bindValue(this, ()=>this.valueAlignment);

		sectionContent.append('treez-text-field')
			.label('Horizontal offset')
			.bindValue(this, ()=>this.valueHorizontalOffset);

		sectionContent.append('treez-text-field')
			.label('Vertical offset')
			.bindValue(this, ()=>this.valueVerticalOffset);
	
		sectionContent.append('treez-font')
			.label('Font')
			.labelWidth('55px')
			.bindValue(this, ()=>this.valueFont);
		
		sectionContent.append('treez-double')
			.label('Size')
			.labelWidth('55px')
			.min('0')
			.bindValue(this, ()=>this.valueSize);
	
		sectionContent.append('treez-color')
			.label('Color')
			.labelWidth('55px')
			.bindValue(this, ()=>this.valueColor);	
						
		sectionContent.append('treez-check-box')
			.label('Italic')
			.contentWidth('55px')
			.bindValue(this, ()=>this.valueIsItalic);
		
		sectionContent.append('treez-check-box')
			.label('Bold')
			.contentWidth('55px')
			.bindValue(this, ()=>this.valueIsBold);
		
		sectionContent.append('treez-check-box')
			.label('Has underline')
			.contentWidth('55px')
			.bindValue(this, ()=>this.valueHasUnderline);

		sectionContent.append('treez-check-box')
			.label('Show value labels')
			.bindValue(this, ()=>this.isShowingValueLabels);							

	}

	__createImageSection(tab){
        var section = tab.append('treez-section')
			.label('Image');	
		
		var sectionContent = section.append('div');

		sectionContent.append('treez-enum-combo-box')
	        .label('Alignment')
	        .nodeAttr('enum', LabelAlignment)
	        .bindValue(this, ()=>this.imageAlignment);

		sectionContent.append('treez-text-field')
			.label('Horizontal offset')
			.bindValue(this, ()=>this.imageHorizontalOffset);

		sectionContent.append('treez-text-field')
			.label('Vertical offset')
			.bindValue(this, ()=>this.imageVerticalOffset);
		
		sectionContent.append('treez-check-box')
			.label('Show image labels')
			.bindValue(this, ()=>this.isShowingImageLabels);		
		
	}

	plot(dTreez, sankeyContainer, rectSelection, sankey) {		

		this.__createTextLabels(dTreez, sankeyContainer, sankey);
		this.__createValueLabels(dTreez, sankeyContainer, sankey);
		this.__createImageLabels(dTreez, sankeyContainer, sankey);		

		return sankeyContainer;
	}

	__createTextLabels(dTreez, sankeyContainer, sankey){

		var graphWidth = Length.toPx(sankey.graph.width);
	    var graphHeight = Length.toPx(sankey.graph.height);

	    var alignment = this.textAlignment;
			
		var widthOffset = Length.toPx(this.textHorizontalOffset);
		var heightOffset = Length.toPx(this.textVerticalOffset);

		sankeyContainer.selectAll('.sankey-node-text-label')
		    .remove();
	
		var textLabels = sankeyContainer.append('g')		 
		  .selectAll('text')
		  .data(sankey.nodeData)
		  .join('text')
		  .className('.sankey-node-text-label')
		  .attr('transform', group => 
		      this.__transformLabels(group, alignment, graphWidth, graphHeight, widthOffset, heightOffset))		 
		  .attr('dy', this.__dyLabels(alignment))
		  .attr('text-anchor', d => d.x0 < graphWidth / 2 ? 'start' : 'end')
		  .text(d => d.id);	    
	    				
	    this.addListener(()=>this.textAlignment, ()=>sankey.updatePlot(dTreez));
		this.addListener(()=>this.textHorizontalOffset, ()=>sankey.updatePlot(dTreez));
		this.addListener(()=>this.textVerticalOffset, ()=>sankey.updatePlot(dTreez));		

		this.bindString(()=>this.textFont, textLabels, 'font-family');
		this.bindString(()=>this.textSize, textLabels, 'font-size');
		this.bindColor(()=>this.textColor, textLabels, 'fill');			
		this.bindFontItalicStyle(()=>this.textIsItalic, textLabels);
		this.bindFontBoldStyle(()=>this.textIsBold, textLabels);
		this.bindFontUnderline(()=>this.textHasUnderline, textLabels);
		
		this.bindBooleanToDisplay(()=>this.isShowingTextLabels, textLabels);		
	}

	__createValueLabels(dTreez, sankeyContainer, sankey){
        var graphWidth = Length.toPx(sankey.graph.width);
	    var graphHeight = Length.toPx(sankey.graph.height);

	    var alignment = this.valueAlignment;
			
		var widthOffset = Length.toPx(this.valueHorizontalOffset);
		var heightOffset = Length.toPx(this.valueVerticalOffset);

		sankeyContainer.selectAll('.sankey-node-value-label')
		    .remove();
	
		var valueLabels = sankeyContainer.append('g')		 
		  .selectAll('text')
		  .data(sankey.nodeData)
		  .join('text')
		  .className('.sankey-node-value-label')
		  .attr('transform', group => 
		      this.__transformLabels(group, alignment, graphWidth, graphHeight, widthOffset, heightOffset))		 
		  .attr('dy', this.__dyLabels(alignment))
		  .attr('text-anchor', d => d.x0 < graphWidth / 2 ? 'start' : 'end')
		  .text(d => d.value);	    
	    				
	    this.addListener(()=>this.valueAlignment, ()=>sankey.updatePlot(dTreez));
		this.addListener(()=>this.valueHorizontalOffset, ()=>sankey.updatePlot(dTreez));
		this.addListener(()=>this.valueVerticalOffset, ()=>sankey.updatePlot(dTreez));		

		this.bindString(()=>this.valueFont, valueLabels, 'font-family');
		this.bindString(()=>this.valueSize, valueLabels, 'font-size');
		this.bindColor(()=>this.valueColor, valueLabels, 'fill');			
		this.bindFontItalicStyle(()=>this.valueIsItalic, valueLabels);
		this.bindFontBoldStyle(()=>this.valueIsBold, valueLabels);
		this.bindFontUnderline(()=>this.valueHasUnderline, valueLabels);
		
		this.bindBooleanToDisplay(()=>this.isShowingValueLabels, valueLabels);
	}
	

	__transformLabels(group, alignment, graphWidth, graphHeight, widthOffset, heightOffset){
		switch(alignment){
			case LabelAlignment.Above:
			    return this.__transformLabelsAbove(group, graphWidth, graphHeight, widthOffset, heightOffset);
			case LabelAlignment.Center:
			    return this.__transformLabelsCenter(group, graphWidth, graphHeight, widthOffset, heightOffset);
			case LabelAlignment.Below:
			    return this.__transformLabelsBelow(group, graphWidth, graphHeight, widthOffset, heightOffset);
			default:
			    throw new Exception('LabelAlignment ' + alignment + ' is not yet implemented.');

		}			
	}		

	__transformLabelsAbove(group, graphWidth, graphHeight, widthOffset, heightOffset){
        var x =  group.x0 + widthOffset;
		if( group.x0 >= graphWidth / 2 ){
			x = group.x1 - widthOffset;
		}
		 
		var y = group.y0 + heightOffset;
		
		return 'translate('+x+','+y+')';
	}

	__transformLabelsCenter(group, graphWidth, graphHeight, widthOffset, heightOffset){
		var x =  group.x0 + widthOffset;
		if( group.x0 >= graphWidth / 2 ){
			x = group.x1 - widthOffset;
		}
		 
		var y = (group.y0 + group.y1) / 2 + heightOffset;
		
		return 'translate('+x+','+y+')';	
	}

	__transformLabelsBelow(group, graphWidth, graphHeight, widthOffset, heightOffset){
		var x =  group.x0 + widthOffset;
		if( group.x0 >= graphWidth / 2 ){
			x = group.x1 - widthOffset;
		}
		 
		var y = group.y1 + heightOffset;
		
		return 'translate('+x+','+y+')';
	}

	__dyLabels(alignment){		
		switch(alignment){
			case LabelAlignment.Above:
			    return '-0.1em';
			case LabelAlignment.Center:
			    return '0.35em';
			case LabelAlignment.Below:
			    return '0.9em';
			default:
			    throw new Exception('LabelAlignment ' + alignment + ' is not yet implemented.');

		}		
	}

	
	__createImageLabels(dTreez, sankeyContainer, sankey){
       
		var graphWidth = Length.toPx(sankey.graph.width);
	    var graphHeight = Length.toPx(sankey.graph.height);

	    var alignment = this.imageAlignment;
			
		var widthOffset = Length.toPx(this.imageHorizontalOffset);
		var heightOffset = Length.toPx(this.imageVerticalOffset);
		
		var svgs = sankey.nodeSvgs;

		sankeyContainer.selectAll('.sankey-node-text-label')
		    .remove();		

		var imageLabels = sankeyContainer.append('g')		 
		  .selectAll('g')
		  .data(sankey.nodeData)
		  .join('g')
		  .className('.sankey-node-value-label')
		  .html((group, index) => svgs[index])			  
		  .attr('transform', (group, index, elements) => 
			this.__transformImageLabels(group, elements, alignment, graphWidth, graphHeight, widthOffset, heightOffset)
		  ); 
		

	    imageLabels.append('title')
		  .text(group => sankey.nodes.nodeTitle(group, graphWidth)); 
      
		this.addListener(()=>this.imageAlignment, ()=>sankey.updatePlot(dTreez));
		this.addListener(()=>this.imageHorizontalOffset, ()=>sankey.updatePlot(dTreez));
		this.addListener(()=>this.imageVerticalOffset, ()=>sankey.updatePlot(dTreez));

		this.bindBooleanToDisplay(()=>this.isShowingImageLabels, imageLabels);

		
	}

	__transformImageLabels(group, elements, alignment, graphWidth, graphHeight, widthOffset, heightOffset){
		switch(alignment){
			case LabelAlignment.Above:
			    return this.__transformImageLabelsAbove(group, elements, graphWidth, graphHeight, widthOffset, heightOffset);
			case LabelAlignment.Center:
			    return this.__transformImageLabelsCenter(group, elements, graphWidth, graphHeight, widthOffset, heightOffset);
			case LabelAlignment.Below:
			    return this.__transformImageLabelsBelow(group, elements, graphWidth, graphHeight, widthOffset, heightOffset);
			default:
			    throw new Exception('LabelAlignment ' + alignment + ' is not yet implemented.');

		}			
	}	

	

	__transformImageLabelsAbove(group, elements, graphWidth, graphHeight, widthOffset, heightOffset){
        var x =  group.x0 + widthOffset;
		if( group.x0 >= graphWidth / 2 ){
			var dx = this.__dxImage(group, elements, graphWidth);
			x = group.x1 + dx - widthOffset;
		}
		 
		var y = group.y0 + heightOffset;
		
		return 'translate('+x+','+y+')';
	}

	__transformImageLabelsCenter(group, elements, graphWidth, graphHeight, widthOffset, heightOffset){
		var x =  group.x0 + widthOffset;		
		if( group.x0 >= graphWidth / 2 ){
			var dx = this.__dxImage(group, elements, graphWidth);
			x = group.x1 + dx - widthOffset;
		}
		 
		var y = (group.y0 + group.y1) / 2 + heightOffset;
		
		return 'translate('+x+','+y+')';	
	}

	__transformImageLabelsBelow(group, elements, graphWidth, graphHeight, widthOffset, heightOffset){
		var x =  group.x0 + widthOffset;
		if( group.x0 >= graphWidth / 2 ){
			var dx = this.__dxImage(group, elements, graphWidth);
			x = group.x1 + dx - widthOffset;
		}
		 
		var y = group.y1 + heightOffset;
		
		return 'translate('+x+','+y+')';
	}

	__dxImage(group, elements, graphWidth){
		if(group.x0 < graphWidth/2){
			return 0;
		} else {
			var element = elements[group.index];
			var svgElement = element.childNodes[0];
			if(!svgElement){
				return 0;
			}
			var elementWidth = svgElement.getBoundingClientRect().width;
			return -elementWidth;
		}
	}


}
