import PagedGraphicsAtom from './../graphics/pagedGraphicsAtom.js';
import AddChildAtomTreeViewAction from './../../core/treeView/addChildAtomTreeViewAction.js';
import Data from './data.js';
import Links from './links.js';
import Graph from './../graph/graph.js';
import ChordNode from './chordNode.js';

export default class Chord extends PagedGraphicsAtom {

	constructor(name){
		super(name);
		this.image = 'chord.png';
		this.__chordSelection = undefined;		
	}
	
	createPageFactories() {

		var factories = [];
		
		this.data = Data.create(this);
		factories.push(this.data);	

		this.links = Links.create(this);
		factories.push(this.links);		
		
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

		//remove old group if it already exists
		graphSelection //
				.select('#' + this.name) //
				.remove();

		//create new group
		this.__chordSelection = graphSelection //
				.append('g') //
				.className('chord') //
				.onClick(()=>this.handleMouseClick());
		
		this.bindString(()=>this.name, this.__chordSelection, 'id');
		
		this.updatePlot(dTreez);

		return this.__chordSelection;
	}

	updatePlot(dTreez) {		
		this.__plotWithPages(dTreez);
	}

	__plotWithPages(dTreez) {
		for (var pageFactory of this.__pageFactories) {
			pageFactory.plot(dTreez, this.__chordSelection, null, this);
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
