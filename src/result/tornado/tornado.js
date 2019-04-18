import PagedGraphicsAtom from './../graphics/pagedGraphicsAtom.js';

export default class Tornado extends PagedGraphicsAtom {
	
	constructor(name){
		super(name);
		this.image = 'tornado.png';
		this.__tornadoSelection = undefined;		
	}

	createPageFactories() {

		var factories = [];
		
		this.data = Data.create(this);
		factories.push(this.data);

		this.fill = Fill.create(this);
		factories.push(this.fill);

		line = Line.create(this);
		factories.push(this.line);

		labels = Labels.create(this);
		factories.push(this.labels);
		
		return factories;

	}

	plot(dTreez, graphOrBarSeriesSelection, graphRectSelection, treeView) {
	
		this.treeView = treeView;

		//remove old bar group if it already exists
		graphOrBarSeriesSelection //
				.select('#' + name) //
				.remove();

		//create new axis group
		this.__tornadoSelection = graphOrBarSeriesSelection //
				.insert('g', '.axis') //
				.className('tornado') //
				.onClick(this);
		
		this.bindString(()=>this.name, this.__tornadoSelection, 'id');
		
		this.__updatePlot(dTreez);

		return tornadoSelection;
	}

	__updatePlot(dTreez) {
		this.__plotWithPages(dTreez);
	}
	
	__plotWithPages(dTreez) {
		for (var pageFactory of this.__pageFactories) {
			pageFactory.plot(dTreez, this.__tornadoSelection, null, this);
		}
	}
	

	addLegendContributors(legendContributors) {
		if (this.providesLegendEntry) {
			legendContributors.push(this);
		}
	}

	get providesLegendEntry() {
		return this.legendText.length > 0;
	}

	get legendText() {
		return data.legendText;
	}

	createLegendSymbolGroup(dTreez, parentSelection, symbolLengthInPx, legend) {
		var symbolSelection = parentSelection //
				.append('rect') //
				.classed('tornado-legend-entry-symbol', true);

		//TODO
		/*
		this.fill.formatLegendSymbol(symbolSelection, symbolLengthInPx);
		this.line.formatLegendSymbolLine(symbolSelection, refreshable);
		*/

		return symbolSelection;
	}

	get graph() {		
		if (this.parent instanceof Graph) {
			return this.parent;
		} else {
			var grandParent = this.parent.parent;
			return grandParent;
		}
	}

	

}
