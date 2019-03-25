import GraphicsAtom from './../graphics/graphicsAtom.js';

export default class Symbol extends GraphicsAtom {
	
	constructor(){
		super();
		this.type = SymbolType.circle;	
		this.size = '64';	
		this.isHidden = false;	
		
		//this.errorStyle = new Wrap<>();	
		this.fillColor = Color.black;
		//this.fillStyle = new Wrap<>();	
		this.fillTransparency = '0';
		this.isHiddenFill = false;
		
		this.lineColor = Color.black;	
		this.lineWidth = '0.5';	
		this.lineStyle = LineStyle.solid;
		this.lineTransparency = '0';
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
		
		sectionContent.append('treez-symbol-type')
			.label('Type')
			.bindValue(this,()=>this.symbolType);
		

		sectionContent.append('treez-text-field')
			.label('Size')
			.bindValue(this, ()=>this.size);		

		//symbol.createTextField(thinMarkers, 'thinMarkers', 'Thin markers', '1');		
		
		sectionContent.append('treez-check-box')
			.label('IsHidden')	
			.bindValue(this, ()=>this.isHidden);

		//symbol.createErrorBarStyle(errorStyle, 'errorStyle', 'Error style');
		
	}	
	
	__createFillSection(page){
		
		var section = page.append('treez-section')
			.label('Fill');	
	
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-color')
			.label('Color')	
			.bindValue(this, ()=>this.fillColor);

		//fill.createFillStyle(fillStyle, 'style', 'Style');	

		sectionContent.append('treez-text-field')
			.label('Transparency')
			.bindValue(this, ()=>this.fillTransparency);
		
		sectionContent.append('treez-check-box')
			.label('IsHidden')	
			.bindValue(this, ()=>this.fillIsHidden);

		//markerFill.createColorMap(colorMap, this, 'Color map');

		//markerFill.createCheckBox(invertMap, this, 'Invert map');
		
	}	
	
	__createLineSection(page){
		
		var section = page.append('treez-section')
			.label('Line');	
	
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-color')
			.label('Color')	
			.bindValue(this, ()=>this.lineColor);

		sectionContent.append('treez-text-field')
			.label('Width')
			.bindValue(this, ()=>this.lineWidth);
		
		sectionContent.append('treez-line-style')
			.label('Style')
			.bindValue(this, ()=>this.lineStyle);		

		sectionContent.append('treez-text-field')
			.label('Transparency')
			.bindValue(this, ()=>this.lineTransparency);

		sectionContent.append('treez-check-box')
			.label('IsHidden')	
			.bindValue(this, ()=>this.lineIsHidden);
		
	}	

	plot(dTreez, xySelection, rectSelection, xy) {
		
		var id = 'symbols_' + parent.name;
		var clipPathId = id + '_clip-path';

		//remove old symbols group if it already exists
		xySelection //
				.select('#' + id) //
				.remove();

		//create new symbols group
		symbolsSelection = xySelection //
				.append('g') //
				.attr('id', id) //
				.attr('class', 'symbols') //
				.attr('clip-path', 'url(#' + clipPathId);

		//create clipping path that ensures that the symbols are only
		//shown within the bounds of the graph
		var graph = this.__getGraph(xy);

		var width = Length.toPx(graph.data.width);
		var height = Length.toPx(graph.data.width);
		symbolsSelection.append('clipPath') //
				.attr('id', clipPathId) //
				.append('rect') //
				.attr('x', 0) //
				.attr('y', 0) //
				.attr('width', width) //
				.attr('height', height);

		//bind attributes
		this.bindBooleanToNegatingDisplay(()=>this.isHidden, symbolsSelection);

		var updateSymbols = () => this.__replotSymbols(dTeez, xy);
		
		this.addListener(()=>this.symbolType, updateSymbols);
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
		symbolsSelection.selectAll('path') //
				.remove();

		//get symbol type and plot new symbols
		var isNoneSymbol = this.symbolType === SymbolType.none;
		if (!isNoneSymbol) {
			//plot new symbols
			this.__plotNewSymbols(dTeez, xy);
		}
	}

	__plotNewSymbols(d3, xy) {
		
		var symbolSquareSize = parseInt(this.size);

		//symbol path generator
		var symbol = d3 //
				.svg() //
				.symbol() //
				.size(symbolSquareSize) //
				.type(this.type);
		
		var symbolDString = symbol.generate();

			
		var xyDataString = xy.createXyDataString(xy.xData, xy.yData);
		
		symbolsSelection.selectAll('path') //
				.data(xyDataString) //
				.enter() //
				.append('path') //
				.attr('transform', new AxisTransformPointDataFunction(engine, xy.xScale, xy.yScale)) //
				.attr('d', symbolDString);

		//bind attributes
		this.bindString(()=>this.fillColor, symbolsSelection, 'fill');
		this.bindTransparency(()=>this.fillTransparency, symbolsSelection);
		this.bindBooleanToTransparency(()=>this.isHiddenFill, ()=>this.fillTransparency, symbolsSelection);
		
		this.bindString(()=>this.lineColor, symbolsSelection, 'stroke');
		this.bindString(()=>this.lineWidth, symbolsSelection, 'stroke-width');
		this.bindLineTransparency(()=>this.lineTransparency, symbolsSelection);
		this.bindBooleanToLineTransparency(()=>this.isHiddenLine, ()=>this.lineTransparency, symbolsSelection);
		
		this.bindLineStyle(()=>this.lineStyle, symbolsSelection);
	
	}

	__plotLegendSymbol(dTreez, parentSelection, xSymbol, refreshable) {
		this.addListener(()=>this.symbolType, ()=>refreshable.refresh());
		this.addListener(()=>this.size, ()=>refreshable.refresh());
		this.__plotLegendSymbols(d3, parentSelection, xSymbol);
	}

	__plotLegendSymbols(dTreez, parentSelection, xSymbol) {

		parentSelection //
				.select('.legend-symbol') //
				.remove();

		
		var isNoneSymbol = this.symbolType === SymbolType.none;
		if (!isNoneSymbol) {
			
			var symbolSquareSize = parseInt(this.size);

			//symbol path generator
			var symbol = d3 //
					.svg() //
					.symbol() //
					.size(symbolSquareSize) //
					.type(this.type);

			var symbolDString = symbol.generate();

			//create symbol
			var legendSymbol = parentSelection //
					.append('path') //
					.classed('legend-symbol', true) //
					.attr('transform', 'translate(' + xSymbol + ',0)') //
					.attr('d', symbolDString);

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
