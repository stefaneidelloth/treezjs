import GraphicsAtom from './graphicsAtom.js';

export default class Border extends GraphicsAtom {

	constructor(){
		super('border');

		this.color = Color.black;
		this.width = '2';
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
