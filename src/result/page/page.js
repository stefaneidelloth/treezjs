import ComponentAtom from './../../core/component/componentAtom.js';
import AddChildAtomTreeViewAction from './../../core/treeview/addChildAtomTreeViewAction.js';
//import Graph from './../graph/graph.js';


export default class Data extends ComponentAtom {
   
	constructor(name) {
		if(!name){
			name='page';
		}
		super(name);
		this.image = 'page.png';
		this.isRunnable=true;	
		
		this.width = '15 cm';
		this.height = '15 cm';
		this.color = 'white';
		this.isHidden = false;
		
		this.pageSelection = undefined;
		this.rectSelection = undefined;		
	}

	
	createComponentControl(tabFolder, treeView){    
	     
		const page = tabFolder.append('treez-tab'); 
		
		const section = page.append('treez-section')
    		.label('Page');
	
		section.append('treez-text-label')
			.value('This atom represents data.');	
		
		section.append('treez-section-action')
			.label('Build page')
			.addAction(()=> this.execute(treeView))
		
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-text-field')
			.label('Width')
			.bindValue(this, ()=>this.width);
		
		sectionContent.append('treez-text-field')
			.label('Height')
			.bindValue(this, ()=>this.height);
		
		sectionContent.append('treez-color')
			.label('Color')
			.bindValue(this, ()=>this.color);

		sectionContent.append('treez-check-box')
			.label('IsHidden')
			.bindValue(this, ()=>this.isHidden);
		
	}	


	extendContextMenuActions(actions, treeView) {

		/*
		
		actions.add( new AddChildAtomTreeViewAction(
				Graph,
				'Graph',
				'graph.png',
				this,
				treeView)
		);

		*/

		return actions
	}


	execute(treeView) {
		this.__treeView = treeView;

		this.executeChildren(Graph, treeView);

		var dTreez = treeView.dTreez;
		
		var svgSelection = dTreez.select("#svg");
		
		GraphicsAtom.bindStringAttribute(svgSelection, "width", this.width);
		GraphicsAtom.bindStringAttribute(svgSelection, "height", this.height);

		this.plot(dTreez, svgSelection, treeView);
		
	}

	plot(dTreez, svgSelection, treeView) {
		this.__treeView = treeView;

		//remove old page group if it already exists
		svgSelection //
				.select('#' + this.name).remove();

		//create new page group
		var pageSelection = svgSelection.append('g'); 
		
		/*
		this.bindNameToId(pageSelection);

		GraphicsAtom.bindDisplayToBooleanAttribute("hidePage", pageSelection, this.isHiding);

		//create rect
		rectSelection = pageSelection //
				.append("rect") //
				.onClick(this);

		bindStringAttribute(rectSelection, "fill", color);
		bindStringAttribute(rectSelection, "width", width);
		bindStringAttribute(rectSelection, "height", height);

		updatePlotWithD3(d3);
		
		*/

		return pageSelection;
	}

	updatePlot(dTreez) {
		this.plotChildGraphs(dTreez);
	}

	plotChildGraphs(dTreez) {
		this.children.forEach(child=>{			
			if (child instanceof Graph) {				
				child.plot(dTreez, this.pageSelection, this.rectSelection, this.__treeView);
			}
		});
		
	}	

	createGraph(name) {
		return this.createChild(Graph, name);		
	}
	

}
