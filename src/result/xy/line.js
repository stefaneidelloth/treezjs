import GraphicsAtom from './../graphics/graphicsAtom.js';

export default class Line extends GraphicsAtom {
	
	constructor(){
		super();
		this.interpolationMode = InterpolationMode.linear;
		//this.bezierJoin = false;
		this.color = Color.black;
		this.width = '3';
		this.style = LineStyle.solid;
		this.transparency = '0';
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
			.nodeAttr('options', InterpolationMode)
			.bindValue(this, ()=>this.interpolationMode);		

		//line.createCheckBox(bezierJoin, this).setLabel('Bezier join');
		
		sectionContent.append('treez-color')
			.label('Color mode')	
			.bindValue(this, ()=>this.color);	
		
		sectionContent.append('treez-text-field')
			.label('Width')	
			.bindValue(this, ()=>this.width);	
		
		sectionContent.append('treez-line-style')
			.label('Style')	
			.bindValue(this, ()=>this.style);
		
		sectionContent.append('treez-text-field')
			.label('Transparency')	
			.bindValue(this, ()=>this.transparency);
		
		sectionContent.append('treez-check-box')
			.label('IsHidden')	
			.bindValue(this, ()=>this.isHideen);
		
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

		var linePathGenerator = d3 //
				.svg()//
				.line()
				.x(new AxisScaleFirstDataFunction(engine, xy.xScale))
				.y(new AxisScaleSecondDataFunction(engine, xy.yScale))//
				.interpolate(this.interpolationMode);

		//plot new lines		
		var xyDataString = xy.createXyDataString(xy.xValues, xy.yValues);

		var lines = linesSelection //
				.append('path') //
				.attr('d', linePathGenerator.generate(xyDataString))
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

		var linePathGenerator = d3 //
				.svg()//
				.line();

		var path = linePathGenerator.generate('[[0,0],[' + length + ',0]]');

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
