import GraphicsAtom from './../graphics/graphicsAtom.js';

export default class Text extends GraphicsAtom {
	
	constructor(){
		super();

		this.font = 'serif';
		this.size = '14';
		this. color = Color.black;
		this.isItalic = false;
		this.isBold = false;
		this.hasUnderline = false;
		this.isHidden = false;
	}
	
	createPage(root) {
		
		var page = root.append('treez-tab')
			.label('Text');
	
		var section = page.append('treez-section')
			.label('Text');	
	
		var sectionContent = section.append('div');

		sectionContent.append('treez-font')
			.label('Font')
			.bindValue(this, ()=>this.font);

		sectionContent.append('treez-text-field')
			.label('Size')
			.bindValue(this, ()=>this.size);
		
		sectionContent.append('treez-color')
			.label('Color mode')	
			.bindValue(this, ()=>this.color);	

		sectionContent.append('treez-check-box')
			.label('Italic')	
			.bindValue(this, ()=>this.isItalic);
		
		sectionContent.append('treez-check-box')
			.label('Bold')	
			.bindValue(this, ()=>this.isBold);
		
		sectionContent.append('treez-check-box')
			.label('Underline')	
			.bindValue(this, ()=>this.hasUnderline);

		sectionContent.append('treez-check-box')
			.label('IsHidden')	
			.bindValue(this, ()=>this.isHideen);

	}

	plot(dTreez, legendSelection, rectSelection, legend) {
		//not needed here since text formatting is called while creating the legend entries
		return legendSelection;
	}

	formatText(textSelection, main) {

		this.bindString(()=>this.font, textSelection, 'font-family');
		this.bindString(()=>this.size, textSelection, 'font-size');
		this.bindString(()=>this.color, textSelection, 'fill');
				
		this.bindFontItalicStyle(()=>this.isItalic, textSelection);
		this.bindFontBoldStyle(()=>this.isBold, textSelection);
		this.bindFontUnderline(()=>this.hasUnderline, textSelection);
		this.bindBooleanToTransparency(()=>this.isHidden, ()=>this.transparency, textSelection);		

		var refreshLegend = () => main.refresh();
		
		this.addListener(()=>this.font, refreshLegend);
		this.addListener(()=>this.size, refreshLegend);
		this.addListener(()=>this.color, refreshLegend);
		this.addListener(()=>this.isItalic, refreshLegend);
		this.addListener(()=>this.isBold, refreshLegend);
		this.addListener(()=>this.hasUnderline, refreshLegend);		

		return textSelection;
	}	

}
