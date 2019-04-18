import GraphicsAtom from './../graphics/graphicsAtom.js';
import AddChildAtomTreeViewAction from './../../core/treeview/addChildAtomTreeViewAction.js';
import Monitor from './../../core/monitor/monitor.js';
import Graph from './../graph/graph.js';
import Color from './../../components/color/color.js';

export default class Page extends GraphicsAtom {
   
	constructor(name) {		
		super(name);
		this.image = 'page.png';
		this.isRunnable=true;	
		
		this.width = '15 cm';
		this.height = '15 cm';
		this.color = Color.white;
		this.isHidden = false;
		
		this.__pageSelection = undefined;
		this.__rectSelection = undefined;		
	}

	
	createComponentControl(tabFolder){  		
	     
		const page = tabFolder.append('treez-tab')
			.label('Page'); 
		
		const section = page.append('treez-section')
    		.label('Data');		
		
		section.append('treez-section-action')
			.image('run.png')
			.label('Build page')
			.addAction(()=> this.execute(this.__treeView)
					.catch(error => {
					   	console.error('Could not build Page  "' + this.name + '"!', error);            					   
				   })
			)			
		
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
	
	extendContextMenuActions(actions, parentSelection, treeView) {
		
		actions.push(new AddChildAtomTreeViewAction(
				Graph,
				"graph",
				"graph.png",
				parentSelection,
				this,
				treeView));	

		return actions
	}


	async execute(treeView, monitor) {
		
		this.treeView = treeView;
		
		if(!monitor){
			var monitorTitle = this.constructor.name + ' "' + this.name + '"';
			monitor = new Monitor(monitorTitle, treeView);
			monitor.showInMonitorView();			
		}			

		monitor.totalWork = 1 + this.numberOfRunnableChildren;	
		
		await this.executeRunnableChildren(treeView, monitor);

		var dTreez = treeView.dTreez;
		
		var svg = dTreez.select('#treez-svg');
						
		this.bindString(()=>this.width, svg, 'width');
		this.bindString(()=>this.height, svg, 'height');

		treeView.graphicsView.setFocus();		

		this.plot(dTreez, svg, treeView);
		
		monitor.done();			
		
	}


	plot(dTreez, svg, treeView) {
		this.treeView = treeView;

		//remove old page group if it already exists
		svg.select('#' + this.name).remove();
		
		//create new page group
		this.__pageSelection = svg.append('g'); 
		
		this.bindString(()=>this.name, this.__pageSelection, 'id');
		
		this.bindBooleanToNegatingDisplay(()=>this.isHidden, this.__pageSelection);
		
		this.__rectSelection = this.__pageSelection //
				.append('rect') //
				.onClick(()=>this.handleMouseClick());

		this.bindColor(()=>this.color, this.__rectSelection, 'fill');
		this.bindString(()=>this.width, this.__rectSelection, 'width');
		this.bindString(()=>this.height, this.__rectSelection, 'height');
		
		this.updatePlot(dTreez);
		
		return page;
	}

	updatePlot(dTreez) {
		this.plotChildGraphs(dTreez);
	}

	plotChildGraphs(dTreez) {
		for(const child of this.children){			
			if (child instanceof Graph) {				
				child.plot(dTreez, this.__pageSelection, this.__rectSelection, this.__treeView);
			}
		}		
	}	

	createGraph(name) {
		return this.createChild(Graph, name);		
	}	

}
