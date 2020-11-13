import PagedGraphicsAtom  from './../graphics/pagedGraphicsAtom.js';
import Data from './data.js';
import Background from './../graphics/background.js';
import Border from './../graphics/border.js';
import AddChildAtomTreeViewAction from './../../core/treeView/addChildAtomTreeViewAction.js';
import Axis from './../axis/axis.js';
import Bar from './../bar/bar.js';
import Xy from './../xy/xy.js';
import XySeries from './../xySeries/xySeries.js';
import Tornado from './../tornado/tornado.js';
import Chord from './../chord/chord.js';
import Legend from './../legend/legend.js';
import Sankey from './../sankey/sankey.js';


export default class Graph extends PagedGraphicsAtom {

	constructor(name) {		
		super(name);
		this.image='graph.png';
		this.isRunnable=true;
				
		this.__graphGroupSelection = undefined;
		this.__rectSelection = undefined;		
	}	

	createPageFactories() {

		var pageFactories =  [];
		this.data = Data.create(this);
		pageFactories.push(this.data);
		
		this.background = Background.create();
		pageFactories.push(this.background);

		this.border = Border.create();
		pageFactories.push(this.border);	

		return pageFactories;	
	}
	
	extendContextMenuActions(actions, parentSelection, treeView) {
		
		
		actions.push(
			new AddChildAtomTreeViewAction(
				Axis,
				'axis',
				'axis.png',
				parentSelection,
				this,
				treeView
			)
		);	

		actions.push(
			new AddChildAtomTreeViewAction(
				Xy, 
				'xy', 
				'xy.png',
				parentSelection,
				this, 
				treeView
			)
		);		
		
		actions.push(
			new AddChildAtomTreeViewAction(
				XySeries,
				'xySeries',
				'xySeries.png',
				parentSelection,
				this,
				treeView
			)
		);
		
		actions.push(
			new AddChildAtomTreeViewAction(
				Bar,
				'bar',
				'bar.png',
				parentSelection,
				this,
				treeView
			)
		);		
		
		actions.push(
			new AddChildAtomTreeViewAction(
				Tornado,
				'tornado',
				'tornado.png',
				parentSelection,
				this,
				treeView
			)
		);

		actions.push(
			new AddChildAtomTreeViewAction(
				Chord,
				'chord',
				'chord.png',
				parentSelection,
				this,
				treeView
			)
		);

		actions.push(
			new AddChildAtomTreeViewAction(
				Sankey,
				'sankey',
				'sankey.png',
				parentSelection,
				this,
				treeView
			)
		);
		
		/*
		
		actions.push(
			new AddChildAtomTreeViewAction(
				Contour,
				'contour',
				'contour.png',
				parentSelection,
				this,
				treeView
			)
		);	


		*/

		actions.push(
			new AddChildAtomTreeViewAction(
				Legend,
				'legend',
				'legend.png',
				parentSelection,
				this,
				treeView
			)
		);	


		return actions
	}


	plot(dTreez, pageSelection, pageRectSelection, treeView) {
			
		//remove old graph group if it already exists
		pageSelection //
				.select('#' + this.name) //
				.remove();

		//create new graph group
		this.__graphGroupSelection = pageSelection //
				.append('g');
		
		this.bindString(()=>this.name, this.__graphGroupSelection, 'id');	
	
		this.__rectSelection = this.__graphGroupSelection //
				.append('rect') //
				.onClick(() => this.handleMouseClick());

		this.updatePlot(dTreez);
			
	}

	updatePlot(dTreez) {
		this.__clearAutoScaleData();
		this.__plotWithPages(dTreez);
		this.__plotChildren(dTreez);
	}

	updatePlotForChangedScales(dTreez) {
		this.__plotChildren(dTreez)
	}

	__clearAutoScaleData() {
		for (var child of this.children) {			
			if (child instanceof Axis) {
				child.clearDataForAutoScale();
			}
		}
	}

	__plotWithPages(dTreez) {
		for (var pageFactory of this.__pageFactories) {
			pageFactory.plot(dTreez, this.__graphGroupSelection, this.__rectSelection, this);
		}
	}

	
	
	__plotChildren(dTreez){
		for (var child of this.children) {			
			if (child.plot) {				
				child.plot(dTreez, this.__graphGroupSelection, this.__rectSelection, this.treeView);
			}
		}
	}

	createAxis(name) {
		return this.createChild(Axis, name);	
	}

	createXySeries(name) {
		return this.createChild(XySeries, name);
	}

	createXy(name) {
		return this.createChild(Xy, name);
	}

	createBar(name) {
		return this.createChild(Bar, name);
	}

	createTornado(name) {
		return this.createChild(Tornado, name);
	}

	createLegend(name) {
		return this.createChild(Legend, name);
	}

	createChord(name) {
		return this.createChild(Chord, name);
	}

	createSankey(name) {
		return this.createChild(Sankey, name);
	}

	createContour(name) {
		return this.createChild(Contour, name);
	}

	get width(){
		return this.data.width;
	}

	get height(){
		return this.data.height;
	}

}
