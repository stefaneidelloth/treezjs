import PagedGraphicsAtom  from './../graphics/pagedGraphicsAtom.js';
import Data from './data.js';
import Background from './../graphics/background.js';
import Border from './../graphics/border.js';

export default class Graph extends PagedGraphicsAtom {

	constructor(name) {		
		super(name);
		this.image='graph.png';
		
		this.data = undefined;
		this.background = undefined;
		this.border = undefined;

		this.__graphGroupSelection = undefined;
		this.__rectSelection = undefined;		
	}	

	createPageFactories() {

		var pageFactories =  [];
		this.data = new Data();
		pageFactories.push(this.data);
		
		this.background = new Background();
		pageFactories.push(this.background);

		this.border = new Border();
		pageFactories.push(this.border);	

		return pageFactories;	
	}
	
	extendContextMenuActions(actions, parentSelection, treeView) {
		
		/*
		actions.push(new AddChildAtomTreeViewAction(
				Axis,
				"axis",
				"axis.png",
				parentSelection,
				this,
				treeView));	
		
		
		Action addXySeries = new AddChildAtomTreeViewAction(
				XySeries.class,
				"xySeries",
				Activator.getImage("xySeries.png"),
				this,
				treeViewer);
		actions.add(addXySeries);

		Action addXy = new AddChildAtomTreeViewAction(Xy.class, "xy", Activator.getImage("xy.png"), this, treeViewer);
		actions.add(addXy);

		Action addBar = new AddChildAtomTreeViewAction(
				Bar.class,
				"bar",
				Activator.getImage("bar.png"),
				this,
				treeViewer);
		actions.add(addBar);

		Action addTornado = new AddChildAtomTreeViewAction(
				Tornado.class,
				"tornado",
				Activator.getImage("tornado.png"),
				this,
				treeViewer);
		actions.add(addTornado);

		Action addContour = new AddChildAtomTreeViewAction(
				Contour.class,
				"contour",
				Activator.getImage("contour.png"),
				this,
				treeViewer);
		actions.add(addContour);

		Action addLegend = new AddChildAtomTreeViewAction(
				Legend.class,
				"legend",
				Activator.getImage("legend.png"),
				this,
				treeViewer);
		actions.add(addLegend);
		*/


		return actions
	}


	async execute(treeView, monitor) {
		//await this.executeChildren(XySeries, treeView, monitor);		
	}

	plot(dTreez, pageSelection, pageRectSelection, treeView) {
			
		//remove old graph group if it already exists
		pageSelection //
				.select("#" + name) //
				.remove();

		//create new graph group
		graphGroupSelection = pageSelection //
				.append("g");
		
		this.bindString(()=>this.name, graphGroupSelection, 'id');	
	
		rectSelection = graphGroupSelection //
				.append("rect") //
				.onClick(this);

		this.updatePlot(dTreez);
		
		return graphGroupSelection;
	}

	updatePlot(dTreez) {
		this.__clearAutoScaleData();
		this.__plotWithPages(dTreez);
		this.__plotChildrenInSpecificOrder(dTreez);
	}

	updatePlotForChangedScales(dTreez) {
		this.__plotChildrenInSpecificOrder(dTreez);
	}

	__clearAutoScaleData() {
		for (var child of children) {			
			if (child instanceof Axis) {
				child.clearDataForAutoScale();
			}
		}
	}

	__plotWithPages(dTreez) {
		for (var pageFactory of this.pageFactories) {
			pageFactory.plot(dTreez, this.graphGroupSelection, this.rectSelection, this);
		}
	}

	__plotChildrenInSpecificOrder(dTreez) {
		/*
		this.__plotChildren(Axis, dTreez);
		this.__plotChildren(Contour, dTreez);
		this.__plotChildren(XySeries, dTreez);
		this.__plotChildren(Xy, dTreez);
		this.__plotChildren(Bar, dTreez);
		this.__plotChildren(Tornado, dTreez);
		this.__plotChildren(Legend, dTreez);
		*/
	}	
	
	__plotChildren(clazz, dTreez){
		for (var child of this.children) {			
			if (child instanceof clazz) {				
				child.plot(dTreez, gthis.graphGroupSelection, this.rectSelection, this.treeView);
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

	createContour(name) {
		return this.createChild(Contour, name);
	}

}
