import PagedGraphicsAtom from './../graphics/pagedGraphicsAtom.js';
import AddChildAtomTreeViewAction from './../../core/treeView/addChildAtomTreeViewAction.js';
import Length from './../graphics/length.js';
import Data from './data.js';
import Nodes from './nodes.js';
import NodeLabels from './nodeLabels.js';
import Links from './links.js';
import Graph from './../graph/graph.js';
import SankeyNode from './sankeyNode.js';

export default class Sankey extends PagedGraphicsAtom {

	constructor(name){
		super(name);
		this.image = 'sankey.png';	
		this.__sankeyContainer = undefined;
		this.__sankeyGenerator = undefined;
		this.__isUpdatingSankeyNodes = false;
	}
	
	createPageFactories() {

		var factories = [];
		
		this.data = Data.create(this);
		factories.push(this.data);

		this.nodes = Nodes.create(this);
		factories.push(this.nodes);	

		this.links = Links.create(this);
		factories.push(this.links);		

		this.nodeLabels = NodeLabels.create(this);
		factories.push(this.nodeLabels);

			
		
		return factories;
	}


	extendContextMenuActions(actions, parentSelection, treeView) {
				
		actions.push(
			new AddChildAtomTreeViewAction(
				SankeyNode,
				'sankeyNode',
				'sankeyNode.png',
				parentSelection,
				this,
				treeView
			)
		);
		return actions;	
	}

	plot(dTreez, graphSelection, graphRectSelection, treeView) {

		this.treeView = treeView;

		this.__sankeyGenerator = undefined;

		this.__sankeyContainer = this.__recreateSankeyContainer(graphSelection);						         
		
		this.updatePlot(dTreez);

		this.__initSankeyNodes();

		return this.__sankeyContainer;
	}

	updateLinksAfterDrag(dTreez){		
        this.__updateSankeyData();
		this.__updateSankeyNodes();
		this.links.plot(dTreez, this.__sankeyContainer, null, this);
	}

	resetSankeyGenerator(){
		this.__sankeyGenerator = undefined;
		this.__nodeData = undefined;
		this.__linkData = undefined;
	}	

	updatePlot(dTreez) {  

        //re-creating the sankey generator might cause
	    //partial loss of (manual) node positioning
	    //=>only do it if sankey generator does not
	    //yet exist 
	    if(!this.__sankeyGenerator){	    	
	    	this.__sankeyGenerator = this.__createSankeyGenerator(dTreez);
	    }  
		
		this.__updateSankeyData();        

		this.__sankeyContainer.selectAll('g')
		    .remove();

		this.__sankeyContainer.selectAll('defs')
		    .remove(); 

		this.__sankeyDefs = this.__sankeyContainer
		    .append('defs');
		  	
		this.__plotWithPages(dTreez);		
	}	

	sankeyNodeChanged(sankeyNode){
	    if(this.__isUpdatingSankeyNodes){
	    	return;
	    }

		if(this.__sankeyContainer){
			var sankeyNodes = this.childrenByClass(SankeyNode);
			var index = sankeyNodes.indexOf(sankeyNode);	  
			
			var nodeDatum = this.__nodeData[index];

			var hasChange = false;

			if(nodeDatum.x0 !== sankeyNode.x){
				this.__mergeXPosition(sankeyNode, nodeDatum);
				hasChange = true;
			}

			if(nodeDatum.y0 !== sankeyNode.y){
				this.__mergeYPosition(sankeyNode, nodeDatum);
				hasChange = true;
			}		

			if(hasChange){
				this.__updateSankeyData();			    
			}	
			this.updatePlot(this.treeView.dTreez);			
		}		
	}

	
	addLegendContributors(legendContributors) {
		if (this.providesLegendEntry) {
			legendContributors.push(this);
		}
	}

	createLegendSymbolGroup(dTreez , parentSelection, symbolLengthInPx, treeView) {
		var symbolSelection = parentSelection //
				.append('g') //
				.classed('sankey-legend-entry-symbol', true);

		//this.line.plotLegendLine(dTreez, symbolSelection, symbolLengthInPx);
		//this.symbol.plotLegendSymbol(dTreez, symbolSelection, symbolLengthInPx / 2, treeView);

		return symbolSelection;
	}

	createSankeyNode(name) {
		return this.createChild(SankeyNode, name);
	}	

	__initSankeyNodes(){
		var sankeyNodes = this.childrenByClass(SankeyNode);
		for(var nodeData of this.__nodeData){
            var sankeyNode = sankeyNodes[nodeData.index];
            if(isNaN(sankeyNode.x)){
            	sankeyNode.x = parseInt(nodeData.x0);
            }

            if(isNaN(sankeyNode.y)){
            	sankeyNode.y = parseInt(nodeData.y0);
            } 
		}
	}

	__updateSankeyData(){

		var sankeyData = undefined;
		if(this.__nodeData){
			var sankeyData = {nodes: this.__nodeData, links: this.__linkData};
			sankeyData = this.__sankeyGenerator.update(sankeyData);
		} else {
			sankeyData = this.__sankeyGenerator();
			sankeyData = this.__applyPositionsFromSankeyNodes(sankeyData);
			sankeyData = this.__sankeyGenerator.update(sankeyData);
		}
		
		
		this.__nodeData = sankeyData.nodes;
		this.__linkData = sankeyData.links;
	}

	__updateSankeyNodes(){
		this.__isUpdatingSankeyNodes = true;

		var sankeyNodes = this.childrenByClass(SankeyNode);
		for(var nodeData of this.__nodeData){
            var sankeyNode = sankeyNodes[nodeData.index];
            sankeyNode.x = parseInt(nodeData.x0);             
            sankeyNode.y = parseInt(nodeData.y0);  
		}

		this.__isUpdatingSankeyNodes = false;
	}

	__applyPositionsFromSankeyNodes(sankeyData){
		var sankeyNodes = this.childrenByClass(SankeyNode);
		var nodeData = sankeyData.nodes;
		var index = 0;
		for(var sankeyNode of sankeyNodes){

			var nodeDatum = nodeData[index];

            if(!isNaN(sankeyNode.x)){
            	this.__mergeXPosition(sankeyNode, nodeDatum);            	
            }

            if(!isNaN(sankeyNode.y)){
            	this.__mergeYPosition(sankeyNode, nodeDatum);
            }
            index++;
             
		}
		return sankeyData;
	}

	__mergeXPosition(sankeyNode, nodeDatum){
		
		var graphWidth = Length.toPx(this.graph.width);	  
        var margin = Length.toPx(this.nodes.margin);
		var width = nodeDatum.x1 - nodeDatum.x0;

		var x0 = sankeyNode.x;
		var x1 = x0 + width;

		if(x0 > margin && x1 < graphWidth - margin){
            nodeDatum.x0 = x0;
		    nodeDatum.x1 = x1;
		} else {
			sankeyNode.x = parseInt(nodeDatum.x0);
		}
		
	}

	__mergeYPosition(sankeyNode, nodeDatum){		
	    var graphHeight = Length.toPx(this.graph.height);
        var margin = Length.toPx(this.nodes.margin);
		var height = nodeDatum.y1 - nodeDatum.y0;

		
		var y0 = sankeyNode.y;
		var y1 = y0 + height;

		if(y0 > margin && y1 < graphHeight - margin){
            nodeDatum.y0 = y0;
		    nodeDatum.y1 = y1;
		} else {
			sankeyNode.y = parseInt(nodeDatum.y0);
		}
	}


	__createSankeyGenerator(dTreez){

		const nodes = this.nodeIds.map(id => ({id: id}));

	    const links = this.sankeyData.map(row => {
	    	return {source: row[0], target: row[1], value: row[2]};
	    });

	    var graphWidth = Length.toPx(this.graph.width);
	    var graphHeight = Length.toPx(this.graph.height);
        var margin = Length.toPx(this.nodes.margin);

	    var nodeWidth = Length.toPx(this.nodes.nodeWidth);
	    var nodePadding = Length.toPx(this.nodes.nodePadding);

        //Documentaiton of d3-sankey: 
        //https://github.com/d3/d3-sankey

        var sankeyAlignment = (...args) =>{
        	var method = dTreez['sankey' + this.nodes.alignment];
        	return method.call(dTreez, ...args);
        }; 

		var sankeyGenerator = dTreez.sankey()
		    .nodes(nodes)
			.links(links)
		    .nodeId(d => d.id)
		    .extent([
		        [margin, margin], 
		        [graphWidth - margin, graphHeight - margin]
		    ])
			.nodeWidth(nodeWidth)
			.nodePadding(nodePadding)		
			.nodeAlign(sankeyAlignment);

		return sankeyGenerator;
	}

	__plotWithPages(dTreez) {
		for (var pageFactory of this.__pageFactories) {
			pageFactory.plot(dTreez, this.__sankeyContainer, null, this);
		}
	}

	__recreateSankeyContainer(graphSelection){
       
		graphSelection //
				.select('#' + this.name) //
				.remove();

		
		var sankeyContainer =  graphSelection //
				.append('g') //
				.className('sankey') //
				.onClick(()=>this.handleMouseClick());

		this.bindString(() => this.name, sankeyContainer, 'id');
		return sankeyContainer;

	}
	
    get graph() {		
		if (this.parent instanceof Graph) {
			return this.parent;
		} else {
			var grandParent = this.parent.parent;
			return grandParent;
		}
	}

	get linkData(){
		return this.__linkData;
	}

	get nodeData(){
		return this.__nodeData;
	}

	get nodeIds(){
		var nodeMap = this.__idToIndexMap;
		var numberOfIds = Object.keys(nodeMap).length;
		var nodeIds = new Array(numberOfIds);
		for(var id of Object.keys(nodeMap)){
           var index = nodeMap[id];
           nodeIds[index]=id;
		}
       return nodeIds;
	}

	get nodeSvgs(){
		var nodeMap = this.__idToIndexMap;
		var numberOfIds = Object.keys(nodeMap).length;
		var nodeSvgs = new Array(numberOfIds).fill('');

		var sankeyNodes = this.childrenByClass(SankeyNode);

		for(var sankeyNode of sankeyNodes){
		   var id = sankeyNode.name;
           var index = nodeMap[id];
           var svg = sankeyNode.svg;
           nodeSvgs[index]=svg;
		}
       return nodeSvgs;
	}		

	get legendText() {
		return this.data.legendText;
	}

	get providesLegendEntry() {
		return this.data.legendText.length > 0;
	}

	get sankeyData() {

		var sourceDataValues = this.sourceValues;
		var targetDataValues = this.targetValues;
		var valueDataValues = this.valueValues;
		
		var sourceLength = sourceDataValues.length;
		var targetLength = targetDataValues.length;
		var valueLength = valueDataValues.length;
		var lengthsAreOk = (sourceLength == targetLength) && (targetLength == valueLength);
		if (!lengthsAreOk) {
			var message = 'The source, target and value data has to be of equal size';
			throw new Error(message);
		}

		if (sourceLength == 0) {
			return [];
		}	

		var rowList =[];
		for (var rowIndex = 0; rowIndex < sourceLength; rowIndex++) {
			
			var source = sourceDataValues[rowIndex];
			var target = targetDataValues[rowIndex];
			var value = valueDataValues[rowIndex];	
			rowList.push([source, target, value]);
		}		
		return rowList;
	}	

	get sankeyDefs(){
		return this.__sankeyDefs;
	}

	get sourceValues() {
		var sourceDataPath = this.data.sourceData;
		if (!sourceDataPath) {
			return [];
		}
		var sourceDataColumn = this.childFromRoot(sourceDataPath);
		return sourceDataColumn.values;		
	}

	get targetValues() {
		var targetDataPath = this.data.targetData;
		if (!targetDataPath) {
			return [];
		}
		var targetDataColumn = this.childFromRoot(targetDataPath);
		return targetDataColumn.values;		
	}

	get valueValues() {
		var valueDataPath = this.data.valueData;
		if (!valueDataPath) {
			return [];
		}
		var valueDataColumn = this.childFromRoot(valueDataPath);
		return valueDataColumn.values;		
	}

	get __uniqueNodeIds(){

		var ids = new Set();
		for(var row of this.sankeyData){
			var sourceId = row[0];
			var targetId = row[1];
            ids.add(sourceId);
            ids.add(targetId);
		}
		return Array.from(ids);
	}

	get __idToIndexMap(){
		var ids = this.__uniqueNodeIds;
		var map = {};
		var sankeyNodes = this.childrenByClass(SankeyNode);
		var index = 0;
		//order defined by sankeyNode children has higher priority
		for(var sankeyNode of sankeyNodes){
			var id = sankeyNode.name;
			if(ids.includes(id)){
				map[sankeyNode.name] = index;
			    index++;
			}			
		}
		//derive remaining order from sankey data
		for(var id of ids){
			if(map[id] === undefined){
				map[id] = index;
				index++;
			}
		}
		return map;
	}	

	

}
