import PagedGraphicsAtom from './../graphics/pagedGraphicsAtom.js';

export default class Legend extends PagedGraphicsAtom {

	constructor(name){
		super(name);
		this.image = 'legend.png';
		this.__legendGroupSelection = undefined;	
		this.__rectSelection = undefined;		
	}

	createPageFactories() {
		
		var factories = [];

		this.main = new Main();
		factories.push(this.main);

		this.text = new Text();
		factories.push(this.text);

		this.background = new Background();
		factories.push(this.background);

		this.border = new Border();
		factories.push(this.border);
		
		return factories;
	}

	plot(dTreez, graphSelection, graphRectSelection, treeView) {
		
		this.treeView = treeView;

		graphSelection //
				.select('#' + name) //
				.remove();

		this.__legendGroupSelection = graphSelection //
				.append('g') //
				.className('legend');
		
		this.bindString(()=>this.name, this.__legendGroupSelection, 'id');

		this.__rectSelection = legendGroupSelection //
				.append('rect') //
				.onClick(()=>this.handleMouseClick());

		this.__updatePlot(dTreez);

		return legendGroupSelection;
	}

	__updatePlot(dTreez) {
		this.__plotWithPages(dTreez);
	}

	__plotWithPages(dTreez) {
		for (var factory of this.pageFactories) {
			factory.plot(dTreez, this.__legendGroupSelection, this.__rectSelection, this);
		}
	}	

}
