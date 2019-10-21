import GraphicsAtom from './../graphics/graphicsAtom.js';
import Table from './../../data/table/table.js';
import Axis from './../axis/axis.js';

export default class XySeries extends GraphicsAtom {

	constructor(name){
		super(name);
		this.image = 'xySeries.png';		
		this.isRunnable=true;
		
		this.sourceTable = '';	
		this.domainLabel = '';	
		this.rangeLabel = '';	
		this.colorMap = ColorMap.blue;	
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

		sectionContent.append('treez-color-map')
			.label('Color map')			
			.bindValue(this, ()=>this.colorMap);

		sectionContent.append('treez-check-box')
			.label('IsHidden')			
			.bindValue(this, ()=>this.isHidden);		

	}

	addLegendContributors(legendContributors) {		
		for (var child of children) {			
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
			this.__removeAllChildren();
			this.__createNewXyChildren(sourceTablePath, domainAxis, rangeAxis);
			this.__createLegendForParentGraphIfNotExists();
		} else {
			console.warn('The xy series "' + this.name + '" has no source table.');
		}
	}

	__createLegendForParentGraphIfNotExists() {
		var graph = this.parent;
		try {
			graph.childByClass(Legend);
		} catch (error) {
			var legend = new Legend('legend');
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

		var seriesColors = ColorBrewer.Category.get(colorMapSize); //TODO

		var columnFolder = foundSourceTable.columnFolder;
		var columnFolderName = columnFolder.name;
		var columnHeaders = columnFolder.headers;
		var domainColumnName = columnHeaders[0];
		for (var rangeColumnIndex = 1; rangeColumnIndex <= numberOfPlots; rangeColumnIndex++) {
			var rangeColumnName = columnHeaders[rangeColumnIndex];
			var rangeColumn = columnFolder.column(rangeColumnName);
			var rangeLegend = rangeColumn.header;
			var color = seriesColors[rangeColumnIndex - 1];
			this.__createNewXyChild(sourceTablePath, columnsName, domainAxis, domainColumnName, rangeAxis, rangeColumnName, rangeLegend, color);
		}
	}

	__updateDomainAxis(sourceTable) {
		var axisList = this.__getAllAxisFromParentGraph();

		var domainAxis;
		if (axisList.length > 0) {
			domainAxis = axisList[0];
			var domainAxisLimits = this.__getDomainLimits(sourceTable);
			domainAxis.data.min = domainAxisLimits[0];
			domainAxis.data.max = domainAxisLimits[1];
		} else {
			var graph = this.parent;
			domainAxis = graph.createAxis('xAxis');
		}

		domainAxis.data.label = this.domainLabel;

		return domainAxis;
	}

	getDomainLimits(sourceTable) {
		var columnFolder = sourceTable.columnFolder;
		var numberOfColumns = columnFolder.numberOfColumns;
		if (numberOfColumns > 0) {
			var domainColumn = sourceTable.columnfolder.getColumnByIndex(0);
			var domainValues = domainColumn.numericValues;
			return this.__getLimits(domainValues, Double.MAX_VALUE, Double.MIN_VALUE); //TODO
		} else {
			return [0, 1];			
		}

	}

	__getLimits(domainValues, initialMin, initialMax) {

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
		var axisList = this.__getAllAxisFromParentGraph();
		var rangeAxis;
		if (axisList.length > 1) {
			rangeAxis = axisList[1];

		} else {
			var graph = this.parent;
			rangeAxis = graph.createAxis('yAxis');

			rangeAxis.data.direction = Direction.vertical;
			var rangeAxisLimits = this.__getRangeLimits(sourceTable);
			rangeAxis.data.min = rangeAxisLimits[0];
			rangeAxis.data.max = rangeAxisLimits[1];
		}

		rangeAxis.data.label = this.rangeLabel;
		return rangeAxis;
	}

	__getRangeLimits(sourceTable) {		
		var numberOfColumns = sourceTable.numberOfColumns;
		if (numberOfColumns > 1) {
			var limits = [ Number.MAX_VALUE, Number.MIN_VALUE ]; //TODO
			for (var columnIndex = 1; columnIndex < numberOfColumns; columnIndex++) {
				var rangeColumn = sourceTable.getColumnByIndex(columnIndex);
				var rangeValues = rangeColumn.numericValues;
				limits = this.__getLimits(rangeValues, limits[0], limits[1]);
			}
			return limits;
		} else {
			return [0, 1];			
		}
	}

	__getAllAxisFromParentGraph() {
		var graph = this.parent;
		return graph.childrenByClass(Axis);		
	}

	createNewXyChild(
			 sourceTablePath,
			 columnsName,
			 domainAxis,
			 domainColumnName,
			 rangeAxis,
			 rangeColumnName,
			 rangeLegend,
			 color) {

		var xy = new Xy(rangeColumnName);		
		xy.data.xAxis = domainAxis.treePath;		
		xy.data.xData = sourceTablePath + '.' + columnsName + '.' + domainColumnName;		
		xy.data.yAxis = rangeAxis.treePath;	
		xy.data.yData = sourceTablePath + '.' + columnsName + '.' + rangeColumnName;
		xy.data.legendText = this.rangeLegend;
		xy.line.color = color;
		xy.symbol.fillColor = color;
		xy.symbol.isHiddenLine = true;

		this.addChild(xy);

	}

	plot(dTreez, graphSelection, treeView) {
		this.treeView = treeView;

		//remove old series group if it already exists
		graphSelection.select('#' + name) //
					  .remove();

		//create new series group
		seriesGroupSelection = graphSelection //
				.append('g') //
				.onClick(() => this.handleMouseClick());
		
		this.bindString(()=>this.name, seriesGroupSelection,'id');
		
		this.bindBooleanToNegatingDisplay(()=>this.isHidden, seriesGroupSelection);		

		this.updatePlot(d3);

		return graphSelection;
	}

	updatePlot(dTreez) {

		for (var child of children) {			
			if (child instanceof Xy) {			
				child.plot(dTreez, seriesGroupSelection, null, this.__treeView);
			}
		}
	}

	createXy(name) {
		return this.createChild(Xy, name);		
	}	

}
