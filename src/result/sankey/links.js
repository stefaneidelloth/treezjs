import GraphicsAtom from './../graphics/graphicsAtom.js';
import Color from './../../components/color/color.js';
import ColorMap from './../../components/colorMap/colorMap.js';
import Length from './../graphics/length.js';
import SankeyFillMode from './sankeyFillMode.js';

export default class Links extends GraphicsAtom {
	
	constructor(){
		super();	
		
		this.fillMode = SankeyFillMode.sourceAndTarget;	
		this.colorMap = ColorMap.Reds;
		this.transparency = 0.2;		

		this.__colorMapSelection = undefined;
		this.__colorScale = undefined;
		this.__linkSelection = undefined;
		
	}

	createPage(root) {
		
	    var tab = root.append('treez-tab')
			.label('Links');

		var section = tab.append('treez-section')
			.label('Links');
	
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-enum-combo-box')
			.label('Fill mode')			
			.nodeAttr('enum', SankeyFillMode)
			.bindValue(this, ()=>this.fillMode);

		this.__colorMapSelection = sectionContent
		    .append('treez-color-map')
			.label('Color map')
			.bindValue(this, ()=>this.colorMap);			

		this.addListener(()=>this.fillMode, ()=>this.__fillModeChanged()); 	
		this.__fillModeChanged();	

		sectionContent.append('treez-unit-interval')
			.label('Transparency')
			.bindValue(this, ()=>this.transparency);	  
	    			
	}	

	__fillModeChanged(){
		var isValueFillMode = this.fillMode === SankeyFillMode.value;

		if(isValueFillMode){
			this.__colorMapSelection.enable();
		} else {
			this.__colorMapSelection.disable();
		}			
	}	

	plot(dTreez, sankeyContainer, rectSelection, sankey) {
		
		sankeyContainer.selectAll('.treez-sankey-link')
		    .remove();
	
        const linkGroup = sankeyContainer
          .append("g")
          .className('treez-sankey-link')	
		  .selectAll("g")
		  .data(sankey.linkData)
		  .join("g");

		if(this.fillMode === SankeyFillMode.value){
			this.__colorScale = this.__createColorScale(dTreez, sankey);
		}		

		var linkSelection = linkGroup
		  .append("path")
		  .attr("d", dTreez.sankeyLinkHorizontal())	 
		  .attr('fill','none')
		  .attr("stroke-width", link => Math.max(1, link.width))
		  .attr('stroke', (link, index) => this.__createStroke(sankey, link, index));
		  
	    linkGroup.append("title")
		  .text(link => `${link.source.id} → ${link.target.id}: ${link.value}`);
        
		this.addListener(()=>this.fillMode, ()=>sankey.updatePlot(dTreez));
		this.addListener(()=>this.colorMap, ()=>sankey.updatePlot(dTreez));				
		this.bindLineTransparency(()=>this.transparency, linkSelection);
		
		return sankeyContainer;
	}	

	__createStroke(sankey, link, index){
		var colors = sankey.nodes.nodeColors;

		switch(this.fillMode){
			case SankeyFillMode.source:
			    return colors[link.source.index];
			case SankeyFillMode.target:
			    return colors[link.target.index];
			case SankeyFillMode.sourceAndTarget:
			    return this.__createStrokeGradient(sankey, link, index, colors);
			case SankeyFillMode.value:
			    return this.__determineStrokeColorByValue(link, colors);
			default:
			    throw new Error('Sankey mode ' + this.fillMode + ' is not yet implemented.');
		}
	}
		
	__createStrokeGradient(sankey, link, index, colors){

		var source = link.source;
		var target = link.target;

        var id = 'treez-sankey-gradient-' + source.index + 
                 '-' + target.index + '-' + this.uniqueId();   
                     
        var gradient = sankey.sankeyDefs            
            .append('linearGradient')			
			.attr('id', id)			
			.attr('gradientUnits', 'userSpaceOnUse')			
			.attr('x1', source.x1)			
			.attr('x2', target.x0);

		var sourceColor = colors[source.index];
		gradient.append('stop')
		    .attr('offset','0%')
		    .attr('stop-color', sourceColor);

		var targetColor = colors[target.index];
		gradient.append('stop')
		    .attr('offset','100%')
		    .attr('stop-color', targetColor);		

        return 'url(#' + id + ')';
	}

	__createColorScale(dTreez, sankey){		
		var interpolateColor = dTreez['interpolate' + this.colorMap];
		var interpolator = value => interpolateColor.call(dTreez, value);
		var values = sankey.valueValues;
		var min = Math.min.apply(null, values);
		var max = Math.max.apply(null, values);
		var colorScale = dTreez.scaleSequential(interpolator)
		                    .domain([min, max]);
		return colorScale;
	}

	__determineStrokeColorByValue(link, colors){
		var value = link.source.value;
		return this.__colorScale(value);
	}

	__mouseOver(event, link){
		var element = event.srcElement;
        element.strokeBackup = element.getAttribute('stroke');
        element.setAttribute('stroke','lime');

        element.strokeWidthBackup = element.getAttribute('stroke-width');
        element.setAttribute('stroke-width','1');

        element.strokeOpacityBackup = element.getAttribute('stroke-opacity');
        element.setAttribute('stroke-opacity','1');

        element.fillOpacityBackup = element.getAttribute('fill-opacity');
        element.setAttribute('fill-opacity','1');
	}

	__mouseOut(event, link){
		var element = event.srcElement;
		element.setAttribute('stroke',element.strokeBackup);
		element.setAttribute('stroke-width', element.strokeWidthBackup);
		element.setAttribute('stroke-opacity', element.strokeOpacityBackup);
		element.setAttribute('fill-opacity', element.fillOpacityBackup);
	}
}
