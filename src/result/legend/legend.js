import PagedGraphicsAtom from './../graphics/pagedGraphicsAtom.js';
import Layout from './layout.js';
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

		this.layout = Layout.create(this);
		factories.push(this.layout);

		this.text = Text.create(this);
		factories.push(this.text);

		this.background = Background.create(this);
		factories.push(this.background);

		this.border = Border.create(this);
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

        var dragSelection = this.__legendGroupSelection;
		var dragDeltaX = 0;
		var dragDeltaY = 0;

		let dragMethod = dTreez.drag()
							.on('start', () =>{
								dragDeltaX = this.layout.xTransform - dTreez.event.x;
								dragDeltaY = this.layout.yTransform - dTreez.event.y;

							})
							.on('drag', () => {
								let x = dTreez.event.x + dragDeltaX;
								let y = dTreez.event.y + dragDeltaY;
								this.layout.handleDragEvent(x, y);	
							});

		dragMethod(this.__legendGroupSelection);		
		
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
