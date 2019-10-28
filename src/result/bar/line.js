import GraphicsAtom from './../graphics/graphicsAtom.js';

import Color from './../../components/color/color.js';
import LineStyle from './../../components/lineStyle/lineStyle.js';

export default class Line extends GraphicsAtom {
	
	constructor(){
		super();
		
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

		sectionContent.append('treez-color')
			.label('Color mode')
			.labelWidth('90px')		
			.bindValue(this, ()=>this.color);	
		
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

	plot(dTreez, barSelection, rectSelection, bar) {

		var rectsSelection = barSelection //
				.select(".bar-rects") //
				.selectAll("rect");

		this.bindString(()=>this.color,rectsSelection, 'stroke');
		this.bindString(()=>this.width,rectsSelection, 'stroke-width');		
		this.bindLineStyle(()=>this.style, rectsSelection);
		this.bindLineTransparency(()=>this.transparency, rectsSelection)
		this.bindBooleanToLineTransparency(()=>this.isHidden, ()=>this.transparency, rectsSelection)		

		return barSelection;
	}

	formatLegendSymbolLine(symbolSelection, legend) {
		
		this.bindString(()=>this.color,symbolSelection, 'stroke');
		this.bindString(()=>this.width,symbolSelection, 'stroke-width');		
		this.bindLineStyle(()=>this.style, symbolSelection);
		this.bindLineTransparency(()=>this.transparency, symbolSelection)
		this.bindBooleanToLineTransparency(()=>this.isHidden, ()=>this.transparency, symbolSelection)	

		var replotLegend = () => legend.refresh();
		this.addListener(()=>this.width, replotLegend);		

		return symbolSelection;
	}

	

}
