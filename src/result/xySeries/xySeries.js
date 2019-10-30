import GraphicsAtom from './../graphics/graphicsAtom.js';
import Table from './../../data/table/table.js';
import Axis from './../axis/axis.js';
import ColorBrewer from './../../components/colorMap/colorBrewer.js';
import Xy from './../xy/xy.js';
import Legend from './../legend/legend.js';

export default class XySeries extends GraphicsAtom {

	constructor(name){
		super(name);
		this.image = 'xySeries.png';		
		this.isRunnable=true;
		
		this.sourceTable = '';	
		this.domainLabel = '';	
		this.rangeLabel = '';	
		//this.colorMap = ColorMap.blue;	
		this.isHidden = false;		
		
		this.__seriesGroupSelection;
	}	

	createComponentControl(tabFolder){  		
	     
		const page = tabFolder.append('treez-tab')
			.label('Page'); 
		
		const section = page.append('treez-section')
    		.label('XySeries');		
		
		section.append('treez-section-action')
			.image('run.png')
			.label('Build XySeries')
			.addAction(()=> this.execute(this.__treeView)
					.catch(error => {
					   	console.error('Could not build XySeries  "' + this.name + '"!', error);            					   
				   })
			)			
		
		var sectionContent = section.append('div');

		sectionContent.append('treez-model-path')
			.label('Source table')
			.nodeAttr('atomClasses',[Table])
			.bindValue(this, ()=>this.sourceTable);
		
		sectionContent.append('treez-text-field')
			.label('Domain label')			
			.bindValue(this, ()=>this.domainLabel);

		sectionContent.append('treez-text-field')
			.label('Range label')			
			.bindValue(this, ()=>this.rangeLabel);

		/*
		sectionContent.append('treez-color-map')
			.label('Color map')			
			.bindValue(this, ()=>this.colorMap);
		*/

		sectionContent.append('treez-check-box')
			.label('IsHidden')			
			.bindValue(this, ()=>this.isHidden);		

	}

	addLegendContributors(legendContributors) {		
		for (var child of this.children) {			
			if (child.addLegendContributors) {				
				child.addLegendContributors(legendContributors);
			}
		}
	}

	execute(treeView) {		
		
		if (this.sourceTable) {
			var foundSourceTable = this.childFromRoot(this.sourceTable);

			var domainAxis = this.__updateDomainAxis(foundSourceTable);
			var rangeAxis = this.__updateRangeAxis(foundSourceTable);
			this.removeAllChildren();
			this.__createNewXyChildren(this.sourceTable, domainAxis, rangeAxis);
			this.__createLegendForParentGraphIfNotExists();
		} else {
			console.warn('The xy series "' + this.name + '" has no source table.');
		}
	}

	plot(dTreez, graphSelection, treeView) {
		this.treeView = treeView;

		//remove old series group if it already exists
		graphSelection.select('#' + this.name) //
					  .remove();

		//create new series group
		this.__seriesGroupSelection = graphSelection //
				.append('g') //
				.onClick(() => this.handleMouseClick());
		
		this.bindString(()=>this.name, this.__seriesGroupSelection,'id');
		
		this.bindBooleanToNegatingDisplay(()=>this.isHidden, this.__seriesGroupSelection);		

		this.updatePlot(dTreez);

		return graphSelection;
	}

	updatePlot(dTreez) {

		for (var child of this.children) {			
			if (child instanceof Xy) {			
				child.plot(dTreez, this.__seriesGroupSelection, null, this.__treeView);
			}
		}
	}

	createXy(name) {
		return this.createChild(Xy, name);		
	}	

	__createLegendForParentGraphIfNotExists() {
		var graph = this.parent;
		var legend = graph.childByClass(Legend);
		if(!legend){
			legend = new Legend('legend');
			graph.addChild(legend);
		}			

	}

	__createNewXyChildren(sourceTablePath, domainAxis, rangeAxis) {
		var foundSourceTable = this.childFromRoot(sourceTablePath);
		var numberOfColumns = foundSourceTable.numberOfColumns;
		var numberOfPlots = numberOfColumns - 1;

		var smallMapSize = 10;
		var largeMapSize = 20;

		var colorMapSize = smallMapSize;
		if (numberOfPlots > smallMapSize) {
			colorMapSize = largeMapSize;
		}
		if (numberOfPlots > largeMapSize) {
			var message = 'XySeries only supports up to ' + largeMapSize + ' plots. It cant create ' + numberOfPlots + ' plots.';
			throw new Error(message);
		}

		var seriesColors = ColorBrewer.Category[colorMapSize]; 

		var columnFolder = foundSourceTable.columnFolder;
		var columnFolderName = columnFolder.name;
		var columnHeaders = columnFolder.headers;
		var domainColumnName = columnHeaders[0];
		for (var rangeColumnIndex = 1; rangeColumnIndex <= numberOfPlots; rangeColumnIndex++) {
			var rangeColumnName = columnHeaders[rangeColumnIndex];
			var rangeColumn = columnFolder.column(rangeColumnName);
			var rangeLegend = rangeColumn.header + ' (' + rangeColumn.legend + ')';
			var color = seriesColors[rangeColumnIndex - 1];
			this.__createNewXyChild(sourceTablePath, columnFolderName, domainAxis, domainColumnName, rangeAxis, rangeColumnName, rangeLegend, color);
		}
	}

	__updateDomainAxis(sourceTable) {
		var axisList = this.__allAxisFromParentGraph();

		var domainAxis;
		if (axisList.length > 0) {
			domainAxis = axisList[0];
			var domainAxisLimits = this.__domainLimits(sourceTable);
			domainAxis.data.min = domainAxisLimits[0];
			domainAxis.data.max = domainAxisLimits[1];
		} else {
			var graph = this.parent;
			domainAxis = graph.createAxis('xAxis');
		}

		domainAxis.data.label = this.domainLabel;

		return domainAxis;
	}

	__domainLimits(sourceTable) {
		var columnFolder = sourceTable.columnFolder;
		var numberOfColumns = columnFolder.numberOfColumns;
		if (numberOfColumns > 0) {
			var domainColumn = sourceTable.columnFolder.columnByIndex(0);
			var domainValues = domainColumn.numericValues;
			return this.__limits(domainValues, Number.MAX_VALUE, Number.MIN_VALUE); 
		} else {
			return [0, 1];			
		}

	}

	__limits(domainValues, initialMin, initialMax) {

		if (domainValues.length < 1) {
			return [0, 1];			
		}

		var min = initialMin;
		var max = initialMax;
		for (var value of domainValues) {
			if (value < min) {
				min = value;
			}

			if (value > max) {
				max = value;
			}
		}
		return [min, max];		
	}

	__updateRangeAxis(sourceTable) {
		var axisList = this.__allAxisFromParentGraph();
		var rangeAxis;
		if (axisList.length > 1) {
			rangeAxis = axisList[1];

		} else {
			var graph = this.parent;
			rangeAxis = graph.createAxis('yAxis');

			rangeAxis.data.direction = Direction.vertical;
			var rangeAxisLimits = this.__rangeLimits(sourceTable);
			rangeAxis.data.min = rangeAxisLimits[0];
			rangeAxis.data.max = rangeAxisLimits[1];
		}

		rangeAxis.data.label = this.rangeLabel;
		return rangeAxis;
	}

	__rangeLimits(sourceTable) {		
		var numberOfColumns = sourceTable.numberOfColumns;
		if (numberOfColumns > 1) {
			var limits = [ Number.MAX_VALUE, Number.MIN_VALUE ]; 
			for (var columnIndex = 1; columnIndex < numberOfColumns; columnIndex++) {
				var rangeColumn = sourceTable.getColumnByIndex(columnIndex);
				var rangeValues = rangeColumn.numericValues;
				limits = this.__limits(rangeValues, limits[0], limits[1]);
			}
			return limits;
		} else {
			return [0, 1];			
		}
	}

	__allAxisFromParentGraph() {
		var graph = this.parent;
		return graph.childrenByClass(Axis);		
	}

	__createNewXyChild(
			 sourceTablePath,
			 columnFolderName,
			 domainAxis,
			 domainColumnName,
			 rangeAxis,
			 rangeColumnName,
			 rangeLegend,
			 color) {

		var xy = new Xy(rangeColumnName);		
		xy.data.xAxis = domainAxis.treePath;		
		xy.data.xData = sourceTablePath + '.' + columnFolderName + '.' + domainColumnName;		
		xy.data.yAxis = rangeAxis.treePath;	
		xy.data.yData = sourceTablePath + '.' + columnFolderName + '.' + rangeColumnName;
		xy.data.legendText = rangeLegend;
		xy.line.color = color;
		xy.symbol.fillColor = color;
		xy.symbol.isHiddenLine = true;

		this.addChild(xy);

	}

	

}
