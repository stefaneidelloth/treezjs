import GraphicsAtom from './../graphics/graphicsAtom.js';
import Color from './../../components/color/color.js';

export default class Text extends GraphicsAtom {
	
	constructor(){
		super();

		this.font = 'sans-serif';
		this.size = 14;
		this.color = Color.black;
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

		let leftWidth = '50px';

		sectionContent.append('treez-font')
			.label('Font')
			.labelWidth(leftWidth)
			.bindValue(this, ()=>this.font);

		sectionContent.append('treez-integer')
			.label('Size')
			.labelWidth(leftWidth)
			.min('0')
			.bindValue(this, ()=>this.size);
		
		sectionContent.append('treez-color')
			.label('Color')
			.labelWidth(leftWidth)	
			.bindValue(this, ()=>this.color);	

		sectionContent.append('treez-check-box')
			.label('Italic')	
			.contentWidth(leftWidth)
			.bindValue(this, ()=>this.isItalic);
		
		sectionContent.append('treez-check-box')
			.label('Bold')	
			.contentWidth(leftWidth)
			.bindValue(this, ()=>this.isBold);
		
		sectionContent.append('treez-check-box')
			.label('Underline')
			.contentWidth(leftWidth)
			.bindValue(this, ()=>this.hasUnderline);

		sectionContent.append('treez-check-box')
			.label('IsHidden')	
			.contentWidth(leftWidth)
			.bindValue(this, ()=>this.isHidden);

	}

	plot(dTreez, legendSelection, rectSelection, legend) {
		//not needed here since text formatting is called while creating the legend entries
		return legendSelection;
	}

	formatText(textSelection, layout) {

		this.bindString(()=>this.font, textSelection, 'font-family');
		this.bindInteger(()=>this.size, textSelection, 'font-size');
		this.bindString(()=>this.color, textSelection, 'fill');
				
		this.bindFontItalicStyle(()=>this.isItalic, textSelection);
		this.bindFontBoldStyle(()=>this.isBold, textSelection);
		this.bindFontUnderline(()=>this.hasUnderline, textSelection);		

		var refreshLegend = () => layout.refresh();
		
		this.addListener(()=>this.font, refreshLegend);
		this.addListener(()=>this.size, refreshLegend);
		this.addListener(()=>this.color, refreshLegend);
		this.addListener(()=>this.isItalic, refreshLegend);
		this.addListener(()=>this.isBold, refreshLegend);
		this.addListener(()=>this.hasUnderline, refreshLegend);		

		return textSelection;
	}	

}
