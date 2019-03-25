import GraphicsAtom from './../graphics/graphicsAtom.js';

export default class Line extends GraphicsAtom {
	
	constructor(){
		this.color = Color.black;
		this.width = '3';
		this.style = LineStyle.solid;
		this.transparency = '0';
		this.isHiden = false;	
	}

	createPage(root) {

		var page = root.append('treez-tab')
			.label('Line');
	
		var section = page.append('treez-section')
			.label('Line');	
		
		var sectionContent = section.append('div');

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
