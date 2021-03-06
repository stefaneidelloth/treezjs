import GraphicsAtom from './../graphics/graphicsAtom.js';

export default class Line extends GraphicsAtom {
	
	constructor(){
		super();

		this.leftColor = Color.black;
		this.leftWidth = 3;
		this.leftStyle = LineStyle.solid;
		this.leftTransparency = 0;
		this.leftIsHidden = false;
	
		this.rightColor = Color.black;
		this.rightWidth = 3;
		this.rightStyle = LineStyle.solid;
		this.rightTransparency = 0;
		this.rightIsHidden = false;
	}
	
	createPage(root) {
		var page = root.append('treez-tab')
			.label('Line');
		
		this.__createLeftSection(page);
		this.__createRightSection(page);		
	}
	
	__createLeftSection(page){
		var section = page.append('treez-section')
			.label('Left');	
	
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-color')
			.label('Color mode')
			.labelWidth('90px')	
			.bindValue(this, ()=>this.leftColor);
		
		sectionContent.append('treez-double')
			.label('Width')	
			.labelWidth('90px')
			.min('0')
			.bindValue(this, ()=>this.leftWidth);
		
		sectionContent.append('treez-line-style')
			.label('Style')	
			.labelWidth('90px')
			.bindValue(this, ()=>this.leftStyle);
		
			
		sectionContent.append('treez-double')
			.label('Transparency')	
			.labelWidth('90px')
			.min('0')
			.max('1')
			.bindValue(this, ()=>this.leftTransparency);
		
		sectionContent.append('treez-check-box')
			.label('IsHidden')	
			.contentWidth('90px')
			.bindValue(this, ()=>this.leftIsHidden);
	}
	
	__createRightSection(page){
		var section = page.append('treez-section')
			.label('Right');	
	
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-color')
			.label('Color mode')	
			.labelWidth('90px')
			.bindValue(this, ()=>this.rightColor);	
		
		sectionContent.append('treez-double')
			.label('Width')	
			.labelWidth('90px')
			.min('0')
			.bindValue(this, ()=>this.rightWidth);
		
		sectionContent.append('treez-line-style')
			.label('Style')	
			.labelWidth('90px')
			.bindValue(this, ()=>this.rightStyle);
			
		sectionContent.append('treez-double')
			.label('Transparency')	
			.labelWidth('90px')
			.min('0')
			.max('1')
			.bindValue(this, ()=>this.rightTransparency);
		
		sectionContent.append('treez-check-box')
			.label('IsHidden')
			.contentWidth('90px')	
			.bindValue(this, ()=>this.rightIsHidden);
	}
	
	
	plot(dTreez, tornadoSelection, rectSelection, tornado) {

		var rectsLeftSelection = tornadoSelection //
				.select('.bar-rects-left') //
				.selectAll('rect');
				
		this.bindString(()=>this.leftColor, rectsLeftSelection, 'stroke');
		this.bindString(()=>this.leftWidth, rectsLeftSelection, 'stroke-width');
		this.bindLineStyle(()=>this.leftStyle, rectsLeftSelection);		
		this.bindLineTransparency(()=>this.leftTransparency, rectsLeftSelection);
		this.bindBooleanToLineTransparency(()=>this.leftIsHidden, ()=>this.leftTransparency, rectsLeftSelection);
		
		var rectsRightSelection = tornadoSelection //
				.select('.bar-rects-right') //
				.selectAll('rect');

		this.bindString(()=>this.rightColor, rectsRightSelection, 'stroke');
		this.bindString(()=>this.rightWidth, rectsRightSelection, 'stroke-width');
		this.bindLineStyle(()=>this.rightStyle, rectsRightSelection);		
		this.bindLineTransparency(()=>this.rightTransparency, rectsRightSelection);
		this.bindBooleanToLineTransparency(()=>this.rightIsHidden, ()=>this.leftTransparency, rectsRightSelection);

		return tornadoSelection;
	}

	formatLegendSymbolLine(symbolSelection, legend) {
		
		this.bindString(()=>this.leftColor, symbolSelection, 'stroke');
		this.bindString(()=>this.leftWidth, symbolSelection, 'stroke-width');
		this.bindLineStyle(()=>this.leftStyle, symbolSelection);		
		this.bindLineTransparency(()=>this.leftTransparency, symbolSelection);
		this.bindBooleanToLineTransparency(()=>this.leftIsHidden, ()=>this.leftTransparency, symbolSelection);
		

		AbstractGraphicsAtom.bindStringAttribute(symbolSelection, 'stroke', leftColor);
		AbstractGraphicsAtom.bindStringAttribute(symbolSelection, 'stroke-width', leftWidth);
		AbstractGraphicsAtom.bindLineStyle(symbolSelection, leftStyle);
		AbstractGraphicsAtom.bindLineTransparency(symbolSelection, leftTransparency);
		AbstractGraphicsAtom.bindLineTransparencyToBooleanAttribute(symbolSelection, leftHide, leftTransparency);
		
		this.addListener(()=>this.leftWidth, ()=>legend.refresh());		

		return symbolSelection;
	}	

}
