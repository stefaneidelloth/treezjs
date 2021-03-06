import GraphicsAtom from './../graphics/graphicsAtom.js';
import Graph from './../graph/graph.js';
import Length from './../graphics/length.js';
import Color from './../../components/color/color.js';
import LineStyle from './../../components/lineStyle/lineStyle.js';
import SymbolStyle from './../../components/symbolStyle/symbolStyle.js';

export default class Symbol extends GraphicsAtom {
	
	constructor(){
		super();
		this.style = SymbolStyle.circle;	
		this.size = 64;	
		this.isHidden = false;	
		
		//this.errorStyle = new Wrap<>();	
		this.fillColor = Color.black;
		//this.fillStyle = new Wrap<>();	
		this.fillTransparency = 0;
		this.isHiddenFill = false;
		
		this.lineColor = Color.black;	
		this.lineWidth = 0.5;	
		this.lineStyle = LineStyle.solid;
		this.lineTransparency = 0;
		this.isHiddenLine = false;	
		
		//this.colorMap = new Wrap<>();	
		//this.invertMap = new Wrap<>();
		
		this.__symbolsSelection;	
	}

	createPage(root) {

		var page = root.append('treez-tab')
		.label('Symbol');
		
		this.__createSymbolSection(page);		
		this.__createFillSection(page);		
		this.__createLineSection(page);		
	}
	
	__createSymbolSection(page){
		
		var section = page.append('treez-section')
			.label('Symbol');	
	
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-symbol-style')
			.label('Type')
			.labelWidth('90px')
			.bindValue(this,()=>this.style);		

		sectionContent.append('treez-double')
			.label('Size')
			.labelWidth('90px')
			.min('0')
			.bindValue(this, ()=>this.size);		

		//symbol.createTextField(thinMarkers, 'thinMarkers', 'Thin markers', '1');		
		
		sectionContent.append('treez-check-box')
			.label('IsHidden')	
			.contentWidth('90px')
			.bindValue(this, ()=>this.isHidden);

		//symbol.createErrorBarStyle(errorStyle, 'errorStyle', 'Error style');
		
	}	
	
	__createFillSection(page){
		
		var section = page.append('treez-section')
			.label('Fill');	
	
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-color')
			.label('Color')	
			.labelWidth('90px')
			.bindValue(this, ()=>this.fillColor);

		//fill.createFillStyle(fillStyle, 'style', 'Style');	

		sectionContent.append('treez-double')
			.label('Transparency')
			.labelWidth('90px')
			.min('0')
			.max('1')
			.bindValue(this, ()=>this.fillTransparency);
		
		sectionContent.append('treez-check-box')
			.label('IsHidden')	
			.contentWidth('90px')
			.bindValue(this, ()=>this.isHiddenFill);

		//markerFill.createColorMap(colorMap, this, 'Color map');

		//markerFill.createCheckBox(invertMap, this, 'Invert map');
		
	}	
	
	__createLineSection(page){
		
		var section = page.append('treez-section')
			.label('Line');	
	
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-color')
			.label('Color')	
			.labelWidth('90px')
			.bindValue(this, ()=>this.lineColor);

		sectionContent.append('treez-double')
			.label('Width')
			.labelWidth('90px')
			.min('0')
			.bindValue(this, ()=>this.lineWidth);
		
		sectionContent.append('treez-line-style')
			.label('Style')
			.labelWidth('90px')
			.bindValue(this, ()=>this.lineStyle);		

		sectionContent.append('treez-double')
			.label('Transparency')
			.labelWidth('90px')
			.min('0')
			.max('1')
			.bindValue(this, ()=>this.lineTransparency);

		sectionContent.append('treez-check-box')
			.label('IsHidden')	
			.contentWidth('90px')
			.bindValue(this, ()=>this.isHiddenLine);
		
	}	

	plot(dTreez, xySelection, rectSelection, xy) {
		
		var id = 'symbols_' + parent.name;
		var clipPathId = id + '_clip-path';

		//remove old symbols group if it already exists
		xySelection //
				.select('#' + id) //
				.remove();

		//create new symbols group
		this.__symbolsSelection = xySelection //
				.append('g') //
				.attr('id', id) //
				.attr('class', 'symbols') //
				.attr('clip-path', 'url(#' + clipPathId);

		//create clipping path that ensures that the symbols are only
		//shown within the bounds of the graph
		var graph = this.__getGraph(xy);

		var width = Length.toPx(graph.data.width);
		var height = Length.toPx(graph.data.width);
		this.__symbolsSelection.append('clipPath') //
				.attr('id', clipPathId) //
				.append('rect') //
				.attr('x', 0) //
				.attr('y', 0) //
				.attr('width', width) //
				.attr('height', height);

		//bind attributes
		this.bindBooleanToNegatingDisplay(()=>this.isHidden, this.__symbolsSelection);

		var updateSymbols = () => this.__replotSymbols(dTreez, xy);
		
		this.addListener(()=>this.style, updateSymbols);
		this.addListener(()=>this.size, updateSymbols);	
				
		this.__replotSymbols(dTreez, xy);
		
		return xySelection;
	}

	__getGraph(xy) {
		var grandParent = xy.parent;	
		
		if (grandParent instanceof Graph) {
			return grandParent;
		} else {
			return grandParent.parent;			
		}
		return graph;
	}

	__replotSymbols(dTreez, xy) {

		//remove old symbols
		this.__symbolsSelection.selectAll('path') //
				.remove();

		//get symbol type and plot new symbols
		var isNoneSymbol = this.style === SymbolStyle.none;
		if (!isNoneSymbol) {
			//plot new symbols
			this.__plotNewSymbols(dTreez, xy);
		}
	}

	__plotNewSymbols(dTreez, xy) {
		
		var symbolSquareSize = parseInt(this.size);

		//symbol path generator
		var symbol = dTreez //				
				.symbol() //
				.size(symbolSquareSize) //
				.type(this.style.d3Symbol(dTreez));
		
		var symbolDString = symbol();
		
		var xScale = xy.xScale;
		var yScale = xy.yScale;

		var selection = this.__symbolsSelection;
		
		selection.selectAll('path') //
				.data(xy.xyData) //
				.enter() //
				.append('path') //
				.attr('transform', (row)=>{					
					return 'translate('+xScale(row[0])+','+yScale(row[1])+')';
				}) //
				.attr('d', symbolDString);

		//bind attributes
		this.bindString(()=>this.fillColor, selection, 'fill');
		this.bindTransparency(()=>this.fillTransparency, selection);
		this.bindBooleanToTransparency(()=>this.isHiddenFill, ()=>this.fillTransparency, selection);
		
		this.bindString(()=>this.lineColor, selection, 'stroke');
		this.bindString(()=>this.lineWidth, selection, 'stroke-width');
		this.bindLineTransparency(()=>this.lineTransparency, selection);
		this.bindBooleanToLineTransparency(()=>this.isHiddenLine, ()=>this.lineTransparency, selection);
		
		this.bindLineStyle(()=>this.lineStyle, selection);
	
	}

	plotLegendSymbol(dTreez, parentSelection, xSymbol, refreshable) {
		this.addListener(()=>this.style, ()=>refreshable.refresh());
		this.addListener(()=>this.size, ()=>refreshable.refresh());
		this.__plotLegendSymbols(dTreez, parentSelection, xSymbol);
	}

	__plotLegendSymbols(dTreez, parentSelection, xSymbol) {

		parentSelection //
				.select('.legend-symbol') //
				.remove();

		
		var isNoneSymbol = this.style === SymbolStyle.none;
		if (!isNoneSymbol) {
			
			var symbolSquareSize = parseInt(this.size);

			//symbol path generator
			var symbolPathGenerator = dTreez //					
					.symbol() //
					.size(symbolSquareSize)
					.type(dTreez[this.style.d3Name]);
			

			var symbolDPath = symbolPathGenerator();
			
			//create symbol
			var legendSymbol = parentSelection //
					.append('path') //
					.attr('d', symbolDPath)
					.classed('legend-symbol', true) //
					.attr('transform', 'translate(' + xSymbol + ',0)'); 

			//bind attributes
			
			this.bindString(()=>this.fillColor, legendSymbol, 'fill');
			this.bindTransparency(()=>this.fillTransparency, legendSymbol);
			this.bindBooleanToTransparency(()=>this.isHiddenFill, ()=>this.fillTransparency, legendSymbol);
			
			this.bindString(()=>this.lineColor, legendSymbol, 'stroke');
			this.bindString(()=>this.lineWidth, legendSymbol, 'stroke-width');
			this.bindLineTransparency(()=>this.lineTransparency, legendSymbol);
			this.bindBooleanToLineTransparency(()=>this.isHiddenLine, ()=>this.lineTransparency, legendSymbol);
			
			this.bindLineStyle(()=>this.lineStyle, legendSymbol);
		}
	}	

}
