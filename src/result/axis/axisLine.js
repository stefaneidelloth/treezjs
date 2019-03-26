import GraphicsAtom from './../graphics/graphicsAtom.js';

export default class AxisLine extends GraphicsAtom {

	constructor(){
		super();
		this.color = 'black';
		this.width = '2';
		this.style = LineStyle.solid;
		this.transparency = '0'
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
			.bindValue(this,()=>this.color);

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
			.bindValue(this, ()=>this.isHidden);	

	}

	plot(dTreez, axisSelection, rectSelection, parentAtom) {

		var axisDomainLine = axisSelection //
				.selectAll('.domain') //
				.style('fill', 'none') //
				.style('stroke-linecap', 'butt'); //
				//.style('shape-rendering', 'geometricPrecision');

		this.bindString(()=>this.color, axisDomainLine, 'stroke');
		this.bindString(()=>this.width, axisDomainLine, 'stroke-width');
		this.bindLineStyle(()=>this.style, axisDomainLine);		
		this.bindLineTransparency(()=>this.transparency, axisDomainLine);
		this.bindBooleanToLineTransparency(()=>this.isHidden, ()=>this.transparency, axisDomainLine);		

		return axisSelection;
	}	

}
