import PagedGraphicsAtom from './../graphics/pagedGraphicsAtom.js';
import AddChildAtomTreeViewAction from './../../core/treeView/addChildAtomTreeViewAction.js';
import Length from './../graphics/length.js';
import Data from './data.js';
import Nodes from './nodes.js';
import NodeLabels from './nodeLabels.js';
import Links from './links.js';
import Ticks from './ticks.js';
import TickLabels from './tickLabels.js';
import Graph from './../graph/graph.js';
import ChordNode from './chordNode.js';

export default class Chord extends PagedGraphicsAtom {

	constructor(name){
		super(name);
		this.image = 'chord.png';			
		this.__chordDatum	= undefined;
		this.__chordContainer = undefined;
	}
	
	createPageFactories() {

		var factories = [];
		
		this.data = Data.create(this);
		factories.push(this.data);

		this.nodes = Nodes.create(this);
		factories.push(this.nodes);	

		this.nodeLabels = NodeLabels.create(this);
		factories.push(this.nodeLabels);

		this.links = Links.create(this);
		factories.push(this.links);	

		this.ticks = Ticks.create(this);
		factories.push(this.ticks);	

		this.tickLabels = TickLabels.create(this);
		factories.push(this.tickLabels);	
		
		return factories;
	}


	extendContextMenuActions(actions, parentSelection, treeView) {
				
		actions.push(
			new AddChildAtomTreeViewAction(
				ChordNode,
				'chordNode',
				'chordNode.png',
				parentSelection,
				this,
				treeView
			)
		);

		return actions;	
	}

	plot(dTreez, graphSelection, graphRectSelection, treeView) {
		
		this.treeView = treeView;

		var chordSelection = this.__recreateChordSelection(graphSelection);	

		this.__chordContainer = this.__createCenteredContainer(chordSelection);			         
		
		this.updatePlot(dTreez);

		return this.__chordContainer;
	}

	updatePlot(dTreez) {	
	    

	    var paddingAngle = this.nodes.paddingAngle * Math.PI/180;	
        var matrix = this.__createChordMatrix(); 
		this.__chordDatum = dTreez.chord()
					.padAngle(paddingAngle) 
					(matrix); 

		this.__chordContainer.selectAll('g')
		    .remove();
		
		this.__nodeGroups = this.__chordContainer
		  .datum(this.chordDatum)
		  .append('g')
		  .selectAll('g')
		  .data(d => d.groups)
		  .enter() 

		this.__chordContainer.selectAll('defs')
		    .remove(); 

		this.__chordDefs = this.__chordContainer
		    .append('defs');
		  	
		this.__plotWithPages(dTreez);
	}
	
	groupTicks(dTreez, nodeGroup, step) {
	  var k = (nodeGroup.endAngle - nodeGroup.startAngle) / nodeGroup.value;
	  return dTreez
	      .range(0, nodeGroup.value, step)
	      .map(value => {
	      	return {value: value, angle: value * k + nodeGroup.startAngle}
	      });
	}

	handleAtomDrop(atomPath){
		var droppedAtom = this.childFromRoot(atomPath);
		if(droppedAtom instanceof Table){
			this.data.assignTableAsSource(droppedAtom);
		} 
	}
	
	__createChordMatrix(){	

		var ids = this.__uniqueNodeIds;
		var size = ids.length;

		var matrix = this.__zeros(size, size);

		var idToIndexMap = this.__idToIndexMap;

		for(var row of this.chordData){
			var sourceIndex = idToIndexMap[row[0]];
			var targetIndex = idToIndexMap[row[1]];
			var value = parseFloat(row[2]);
			matrix[sourceIndex][targetIndex] = value;
			matrix[targetIndex][sourceIndex] = value;
		}
				
		return matrix;
	}

	__zeros(numberOfRows, numberOfColumns){
		var rowArray = Array(numberOfRows)
		return Array.from(rowArray, () => new Array(numberOfColumns).fill(0));
	}

	get __uniqueNodeIds(){

		var ids = new Set();
		for(var row of this.chordData){
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
		var chordNodes = this.childrenByClass(ChordNode);
		var index = 0;
		//order defined by chordNode children has higher priority
		for(var chordNode of chordNodes){
			var id = chordNode.name;
			if(ids.includes(id)){
				map[chordNode.name] = index;
			    index++;
			}			
		}
		//derive remaining order from chord data
		for(var id of ids){
			if(map[id] === undefined){
				map[id] = index;
				index++;
			}
		}
		return map;
	}

	get chordDatum(){
		return this.__chordDatum;
	}

	get nodeGroups(){
		return this.__nodeGroups;
	}

	get chordDefs(){
		return this.__chordDefs;
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

		var chordNodes = this.childrenByClass(ChordNode);

		for(var chordNode of chordNodes){
		   var id = chordNode.name;
           var index = nodeMap[id];
           var svg = chordNode.svg;
           nodeSvgs[index]=svg;
		}
       return nodeSvgs;
	}

	__recreateChordSelection(graphSelection){
       
		graphSelection //
				.select('#' + this.name) //
				.remove();

		
		return graphSelection //
				.append('g') //
				.className('chord') //
				.onClick(()=>this.handleMouseClick());
	}

	__createCenteredContainer(chordSelection){
        var graphWidth = Length.toPx(this.graph.data.width);
		var graphHeight = Length.toPx(this.graph.data.height);

		var chordContainer = chordSelection.append('g')
		    .attr('transform','translate('+ graphWidth/2+ ',' + graphHeight/2 +')');

		this.bindString(() => this.name, chordContainer, 'id');

		return chordContainer;
	}

	__plotWithPages(dTreez) {
		for (var pageFactory of this.__pageFactories) {
			pageFactory.plot(dTreez, this.__chordContainer, null, this);
		}
	}

	get graph() {		
		if (this.parent instanceof Graph) {
			return this.parent;
		} else {
			var grandParent = this.parent.parent;
			return grandParent;
		}
	}

	addLegendContributors(legendContributors) {
		if (this.providesLegendEntry) {
			legendContributors.push(this);
		}
	}

	get providesLegendEntry() {
		return this.data.legendText.length > 0;
	}

	get legendText() {
		return this.data.legendText;
	}

	createLegendSymbolGroup(dTreez , parentSelection, symbolLengthInPx, treeView) {
		var symbolSelection = parentSelection //
				.append('g') //
				.classed('chord-legend-entry-symbol', true);

		this.line.plotLegendLine(dTreez, symbolSelection, symbolLengthInPx);
		this.symbol.plotLegendSymbol(dTreez, symbolSelection, symbolLengthInPx / 2, treeView);

		return symbolSelection;
	}

	get chordData() {

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

	createChordNode(name) {
		return this.createChild(ChordNode, name);
	}	

}
