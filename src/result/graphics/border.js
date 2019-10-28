import GraphicsAtom from './graphicsAtom.js';
import Color from './../../components/color/color.js';
import LineStyle from './../../components/lineStyle/lineStyle.js';

export default class Border extends GraphicsAtom {

	constructor(){
		super('border');

		this.color = Color.black;
		this.width = 2;
		this.style = LineStyle.solid;
		this.transparency = 0;
		this.isHidden = false;
	}

	createPage(tabFolder, parent) {

		var page = tabFolder.append('treez-tab')
			.label('Border');

		var section = page.append('treez-section')
			.label('Data');

		var sectionContent = section.append('div');

		sectionContent.append('treez-color')
			.label('Color')
			.labelWidth('90px')	
			.bindValue(this, ()=>this.color);

		sectionContent.append('treez-double')
			.label('Width')
			.labelWidth('90px')	
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

	plot(dTreez, parentSelection, rectSelection, parent) {

		this.bindColor(()=>this.color, rectSelection, 'stroke');
		this.bindString(()=>this.width, rectSelection, 'stroke-width');
		this.bindLineStyle(()=>this.style, rectSelection);
		this.bindLineTransparency(()=>this.transparency, rectSelection);
		this.bindBooleanToLineTransparency(()=>this.isHidden, ()=>this.transparency, rectSelection);

		return parentSelection;
	}

}
