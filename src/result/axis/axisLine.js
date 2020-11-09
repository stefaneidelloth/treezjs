import GraphicsAtom from './../graphics/graphicsAtom.js';
import Color from './../../components/color/color.js';
import LineStyle from './../../components/lineStyle/lineStyle.js';

export default class AxisLine extends GraphicsAtom {

	constructor(){
		super();
		this.color = Color.black;
		this.width = 2;
		this.style = LineStyle.solid;
		this.transparency = 0;
		this.isHidden = false;		
	}

	createPage(root) {
		
		var page = root.append('treez-tab')
			.label('Axis line');

		var section = page.append('treez-section')
			.label('Axis line');
	
		var sectionContent = section.append('div');

		sectionContent.append('treez-color')
			.label('Color')
			.labelWidth('90px')
			.bindValue(this,()=>this.color);

		sectionContent.append('treez-double')
			.label('Width')
			.labelWidth('90px')			
			.min('0')			
			.bindValue(this, ()=>this.width);
		
		sectionContent.append('treez-line-style')			
			.label('Style')
			.labelWidth('90px')
			.bindValue(this, ()=>this.style);		
	
		sectionContent.append('treez-double')
			.label('Transparency')
			.labelWidth('90px')			
			.min('0')
			.max('1')
			.bindValue(this, ()=>this.transparency);
	
		sectionContent.append('treez-check-box')
			.label('IsHidden')	
			.contentWidth('90px')			
			.bindValue(this, ()=>this.isHidden);	

	}

	plot(dTreez, axisSelection, rectSelection, parentAtom) {

		var axisDomainLine = axisSelection //
				.selectAll('.domain') //
				.style('fill', 'none') //
				.style('stroke-linecap', 'butt'); //
				//.style('shape-rendering', 'geometricPrecision');

		this.bindColor(()=>this.color, axisDomainLine, 'stroke');
		this.bindString(()=>this.width, axisDomainLine, 'stroke-width');
		this.bindLineStyle(()=>this.style, axisDomainLine);		
		this.bindLineTransparency(()=>this.transparency, axisDomainLine);
		this.bindBooleanToLineTransparency(()=>this.isHidden, ()=>this.transparency, axisDomainLine);		

		return axisSelection;
	}	

}
