import PagedGraphicsAtom from './../graphics/pagedGraphicsAtom.js';
import Main from './main.js';
import Text from './text.js';
import Background from '../graphics/background.js';
import Border from '../graphics/border.js';

export default class Legend extends PagedGraphicsAtom {

	constructor(name){
		super(name);
		this.image = 'legend.png';
		this.__legendGroupSelection = undefined;	
		this.__rectSelection = undefined;		
	}

	createPageFactories() {
		
		var factories = [];

		this.main = Main.create(this);
		factories.push(this.main);

		this.text = Text.create();
		factories.push(this.text);

		this.background = Background.create();
		factories.push(this.background);

		this.border = Border.create();
		factories.push(this.border);
		
		return factories;
	}

	plot(dTreez, graphSelection, graphRectSelection, treeView) {
		
		this.treeView = treeView;

		graphSelection //
				.select('#' + this.name) //
				.remove();

		this.__legendGroupSelection = graphSelection //
				.append('g') //
				.className('legend');
		
		this.bindString(()=>this.name, this.__legendGroupSelection, 'id');

		this.__rectSelection = this.__legendGroupSelection //
				.append('rect') //
				.onClick(()=>this.handleMouseClick());

		this.updatePlot(dTreez);

		return this.__legendGroupSelection;
	}

	updatePlot(dTreez) {
		this.__plotWithPages(dTreez);
	}

	__plotWithPages(dTreez) {
		for (var factory of this.__pageFactories) {
			factory.plot(dTreez, this.__legendGroupSelection, this.__rectSelection, this);
		}
	}	

}
