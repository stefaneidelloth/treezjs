import GraphicsAtom from './../graphics/graphicsAtom.js';
import InterpolationMode from './interpolationMode.js';
import Color from './../../components/color/color.js';
import LineStyle from './../../components/lineStyle/lineStyle.js';

export default class Line extends GraphicsAtom {
	
	constructor(){
		super();
		this.interpolationMode = InterpolationMode.linear;
		//this.bezierJoin = false;
		this.color = Color.black;
		this.width = 3;
		this.style = LineStyle.solid;
		this.transparency = 0;
		this.isHidden = false;
	}
	
	createPage(root) {
		
		var page = root.append('treez-tab')
			.label('Line');

		var section = page.append('treez-section')
			.label('Line');	
		
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-enum-combo-box')
			.label('Interpolation mode')
			.labelWidth('120px')
			.nodeAttr('enum', InterpolationMode)
			.bindValue(this, ()=>this.interpolationMode);		

		//line.createCheckBox(bezierJoin, this).setLabel('Bezier join');
		
		sectionContent.append('treez-color')
			.label('Color')
			.labelWidth('120px')			
			.bindValue(this, ()=>this.color);	
		
		sectionContent.append('treez-double')
			.label('Width')	
			.labelWidth('120px')
			.min('0')
			.bindValue(this, ()=>this.width);	
		
		sectionContent.append('treez-line-style')
			.label('Style')	
			.labelWidth('120px')
			.bindValue(this, ()=>this.style);
		
		sectionContent.append('treez-double')
			.label('Transparency')	
			.labelWidth('120px')
			.min('0')
			.max('1')
			.bindValue(this, ()=>this.transparency);
		
		sectionContent.append('treez-check-box')
			.label('IsHidden')	
			.contentWidth('120px')
			.bindValue(this, ()=>this.isHidden);
		
	}

	plot(dTreez, xySelection, rectSelection, xy) {

		var parentName = parent.name;
		var id = 'lines_' + parentName;

		//remove old line group if it already exists
		xySelection.selectAll('#' + id) //
				   .remove();

		//create new line group
		var linesSelection = xySelection //
				.append('g') //
				.attr('id', id) //
				.attr('class', 'lines');		

        var xScale = xy.xScale;
        var yScale = xy.yScale;
		var linePathGenerator = dTreez //				
				.line()
				.x((row)=>xScale(row[0]))
				.y((row)=>yScale(row[1]));//
				//.curve(this.interpolationMode); //TODO

		//plot new lines
		var lines = linesSelection //
				.append('path') //
				.attr('d', linePathGenerator(xy.xyData))
				.attr('fill', 'none');

		//bind attributes
		this.bindBooleanToNegatingDisplay(()=>this.isHidden, lines);
		this.bindString(()=>this.color,lines, 'stroke');
		this.bindString(()=>this.width,lines, 'stroke-width');
		this.bindLineTransparency(()=>this.transparency, lines)
		this.bindLineStyle(()=>this.style, lines);
		
		this.addListener(()=>this.interpolationMode, ()=>xy.updatePlot(dTreez));

		return xySelection;
	}

	plotLegendLine(dTreez, parentSelection, length) {

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

		return parentSelection;
	}

	

}
