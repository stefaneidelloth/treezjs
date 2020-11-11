import GraphicsAtom from './../graphics/graphicsAtom.js';
import Color from './../../components/color/color.js';
import ColorMap from './../../components/colorMap/colorMap.js';
import Length from './../graphics/Length.js';
import ChordMode from './chordMode.js';

export default class Links extends GraphicsAtom {
	
	constructor(){
		super();		
		
		this.radius = '3.4 cm';	
		this.isUsingArrowHeads = true;		

		this.fillMode = ChordMode.sourceAndTarget;	
		this.fillColorMap = ColorMap.Reds;
		this.fillTransparency = 0.2;

		this.strokeColor = Color.black;
		this.strokeWidth = '1';
		this.strokeTransparency = 0.2;
		this.strokeIsHidden = true;

		this.__fillColorMapSelection = undefined;
		this.__colorScale = undefined;
		
	}

	createPage(root) {
		
	    var tab = root.append('treez-tab')
			.label('Links');

	    this.__createShapeSection(tab);
	    this.__createFillSection(tab);
	    this.__createStrokeSection(tab);				
	}

	__createShapeSection(tab){
		var section = tab.append('treez-section')
			.label('Shape');
	
		var sectionContent = section.append('div');

		sectionContent.append('treez-text-field')
			.label('Radius')
			.bindValue(this, ()=>this.radius);
		
		sectionContent.append('treez-check-box')
			.label('Use arrow heads')
			.bindValue(this, ()=>this.isUsingArrowHeads);
	}

	__createFillSection(tab){
		var section = tab.append('treez-section')
			.label('Fill');
	
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-enum-combo-box')
			.label('Mode')			
			.nodeAttr('enum', ChordMode)
			.bindValue(this, ()=>this.fillMode);

		this.__fillColorMapSelection = sectionContent
		    .append('treez-color-map')
			.label('Color map')
			.bindValue(this, ()=>this.fillColorMap);			

		this.addListener(()=>this.fillMode, ()=>this.__fillModeChanged()); 	
		this.__fillModeChanged();	

		sectionContent.append('treez-unit-interval')
			.label('Transparency')
			.bindValue(this, ()=>this.fillTransparency);
	}

	__fillModeChanged(){
		var isValueFillMode = this.fillMode === ChordMode.value;

		if(isValueFillMode){
			this.__fillColorMapSelection.enable();
		} else {
			this.__fillColorMapSelection.disable();
		}			
	}

	__createStrokeSection(tab){
		var section = tab.append('treez-section')
			.label('Stroke');
	
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-color')
			.label('Color')	
			.bindValue(this, ()=>this.strokeColor);

		sectionContent.append('treez-text-field')
			.label('Width')	
			.bindValue(this, ()=>this.strokeWidth);

		sectionContent.append('treez-unit-interval')
			.label('Transparency')			
			.bindValue(this, ()=>this.strokeTransparency);

		sectionContent.append('treez-check-box')
			.label('IsHidden')	
			.contentWidth('90px')			
			.bindValue(this, ()=>this.strokeIsHidden);
	}
	

	plot(dTreez, chordContainer, rectSelection, chord) {
		
		var radius = Length.toPx(this.radius); 

		chordContainer.selectAll('.chord-link')
		    .remove();
		
		var ribbonGenerator = this.__createRibbonGenerator(dTreez, radius);

        if(this.fillMode === ChordMode.value){
        	this.__fillColorScale = this.__createFillColorScale(dTreez, chord);
        }

        var nodeIds = chord.nodeIds;
				
		var linkSelection = chordContainer
		  .datum(chord.chordDatum)
		  .append('g')
		  .className('chord-link')	
		  .selectAll('path')
		  .data(group => group)
		  .enter()
		  .append('path')
		  .onMouseOver((event, group)=>this.__mouseOver(event, group))
		  .onMouseOut((event, group)=>this.__mouseOut(event, group))
		  .attr('d', ribbonGenerator)
		  .style('fill', (group, index, elements) => this.__createFill(group, index, elements, chord));

		linkSelection.append('title')
		  .text(group => this.__title(group, nodeIds));	

         this.addListener(()=>this.radius, ()=>chord.updatePlot(dTreez));
		 this.addListener(()=>this.isUsingArrowHeads, ()=>chord.updatePlot(dTreez));
		 this.addListener(()=>this.fillMode, ()=>chord.updatePlot(dTreez));
		 this.addListener(()=>this.fillColorMap, ()=>chord.updatePlot(dTreez));

		 this.bindTransparency(()=>this.fillTransparency, linkSelection); 

		 this.bindColor(()=>this.strokeColor, linkSelection, 'stroke');
		 this.bindString(()=>this.strokeWidth, linkSelection, 'stroke-width');
		 this.bindLineTransparency(()=>this.strokeTransparency, linkSelection);
		 this.bindBooleanToLineTransparency(()=>this.strokeIsHidden, ()=>this.strokeTransparency, linkSelection);
		
		return chordContainer;
	}	

	__mouseOver(event, group){
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

	__mouseOut(event, group){
		var element = event.srcElement;
		element.setAttribute('stroke',element.strokeBackup);
		element.setAttribute('stroke-width', element.strokeWidthBackup);
		element.setAttribute('stroke-opacity', element.strokeOpacityBackup);
		element.setAttribute('fill-opacity', element.fillOpacityBackup);
	}

	__title(group, nodeIds){		
		var source = group.source;
		var sourceId = nodeIds[source.index];
		var target = group.target;
		var targetId = nodeIds[target.index];
		return 'Source: ' + sourceId + '\n' +
		'Target: ' + targetId + '\n' +
		'Value: ' + source.value;
	}	

	__createRibbonGenerator(dTreez, radius){	
	    if(this.isUsingArrowHeads){
	    	return dTreez.ribbonArrow()
			  .radius(radius)
			  .headRadius(3);
	    } else {
	        return dTreez.ribbon()
			  .radius(radius);
	    }	
	}

	__createFill(group, index, elements, chord){

		var colors = chord.nodes.nodeColors;

		switch(this.fillMode){
			case ChordMode.source:
			    return colors[group.source.index];
			case ChordMode.target:
			    return colors[group.target.index];
			case ChordMode.sourceAndTarget:
			    return this.__createFillGradient(group, index, elements, chord, colors);
			case ChordMode.value:
			    return this.__determineFillColorByValue(group, colors);
			default:
			    throw new Error('Chord mode ' + this.fillMode + ' is not yet implemented.');
		}
		
	}

	__createFillGradient(group, index, elements, chord, colors){
		
        var source =  group.source;
        var target =  group.target;

        var id = 'treez-chord-gradient-' + source.index + '-' + target.index;
        var radius = Length.toPx(this.radius); 

        var sourceAngle = (source.startAngle + source.endAngle)/2 - Math.PI/2;
        var x1 = radius * Math.cos(sourceAngle);
        var y1 = radius * Math.sin(sourceAngle);

        
        var targetAngle = (target.startAngle + target.endAngle)/2 - Math.PI/2;;
        var x2 = radius * Math.cos(targetAngle);
        var y2 = radius * Math.sin(targetAngle);       
        
        var gradient = chord.chordDefs            
            .append('linearGradient')			
			.attr('id', id)			
			.attr('gradientUnits', 'userSpaceOnUse')			
			.attr('x1', x1)
			.attr('y1', y1)
			.attr('x2', x2)
			.attr('y2', y2);

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

	__createFillColorScale(dTreez, chord){
		var colorMap = this.fillColorMap;
		var interpolateColor = dTreez['interpolate' + colorMap];
		var interpolator = value => interpolateColor.call(dTreez, value);
		var values = chord.valueValues;
		var min = Math.min.apply(null, values);
		var max = Math.max.apply(null, values);
		var colorScale = dTreez.scaleSequential(interpolator)
		                    .domain([min, max]);
		return colorScale;
	}

	__determineFillColorByValue(nodeGroup, colors){
		var value = nodeGroup.source.value;
		return this.__fillColorScale(value);

	}
}
