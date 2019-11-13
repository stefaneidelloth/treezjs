import GraphicsAtom from './../graphics/graphicsAtom.js';
import PositionReference from './positionReference.js';
import HorizontalPosition from './horizontalPosition.js';
import VerticalPosition from './verticalPosition.js';
import Length from './../graphics/length.js';

export default class Main extends GraphicsAtom {
	
	constructor(){
		super();
		
		this.__dTreez = undefined;

		this.__marginAroundLegendInPx = 20;
		this.__horizontalSpacingInPx = 10;
		this.__verticalSpacingInPx = 5;

		this.__legendSelection = undefined;
		this.__contentSelection = undefined;
		this.__rectSelection = undefined;
		
		this.__positionReferenceSelection = undefined;
		this.__horizontalPositionSelection = undefined;
		this.__verticalPositionSelection = undefined;


	
		this.positionReference = PositionReference.graph;	
		this.horizontalPosition = HorizontalPosition.right;	
		this.verticalPosition = VerticalPosition.top;
	
		this.isManualHorizontalPosition = false;	
		this.isManualVerticalPosition = false;

		this.manualHorizontalPosition = 0;
		this.manualVerticalPosition = 0;
	
		this.marginSize = this.__horizontalSpacingInPx;
	
		this.numberOfColumns = 1;
	
		this.keyLength = 25;
	
		this.isSwappingSymbol = false;
	
		this.isHidden = false;		
	}
	
	createPage(root, legend) {

		 var page = root.append('treez-tab')
			.label('Main');

		let section = page.append('treez-section')
			.label('Main');

		legend.createHelpAction(section, 'result/legend/legend.md');
	
		var sectionContent = section.append('div');

		let leftWidth = '175px';

		let replotLegend = () => {
				legend.updatePlot(this.__dTreez);
		};
	

		this.__positionReferenceSelection = sectionContent.append('treez-enum-combo-box')
			.label('Position reference')
			.labelWidth(leftWidth)
			.nodeAttr('enum',PositionReference)
			.onChange(() => {
				this.__convertManualPositions();
				replotLegend();
			})
			.bindValue(this, ()=>this.positionReference);

		this.__horizontalPositionSelection = sectionContent.append('treez-enum-combo-box')
			.label('Horizontal position')
			.labelWidth(leftWidth)
			.nodeAttr('enum',HorizontalPosition)
			.onChange(replotLegend)
			.bindValue(this, ()=>this.horizontalPosition);

		this.__verticalPositionSelection = sectionContent.append('treez-enum-combo-box')
			.label('Vertical position')
			.labelWidth(leftWidth)
			.nodeAttr('enum',VerticalPosition)
			.onChange(replotLegend)
			.bindValue(this, ()=>this.verticalPosition);		


		this.__manualHorizontalPositionSelection = sectionContent.append('treez-integer')
			.label('Manual horizontal position')
			.labelWidth(leftWidth)			
			.onChange(replotLegend)
			.bindValue(this, ()=>this.manualHorizontalPosition);

		this.__manualVerticalPositionSelection = sectionContent.append('treez-integer')
			.label('Manual vertical position')
			.labelWidth(leftWidth)
			.onChange(replotLegend)
			.bindValue(this, ()=>this.manualVerticalPosition);

		this.__marginSizeSelection = sectionContent.append('treez-integer')
			.label('Margin size')
			.labelWidth(leftWidth)
			.onChange(replotLegend)
			.bindValue(this, ()=>this.marginSize);

		this.__numberOfColumnsSelection = sectionContent.append('treez-integer')
			.label('Number of columns')
			.labelWidth(leftWidth)
			.onChange(replotLegend)
			.bindValue(this, ()=>this.numberOfColumns);

		this.__keyLengthSelection = sectionContent.append('treez-integer')
			.label('Key length')
			.labelWidth(leftWidth)
			.onChange(replotLegend)
			.bindValue(this, ()=>this.keyLength);

		this.__isSwappingSymbolSelection = sectionContent.append('treez-check-box')
			.label('IsSwappingSymbol')
			.contentWidth(leftWidth)
			.onChange(replotLegend)
			.bindValue(this, ()=>this.isSwappingSymbol);

		sectionContent.append('treez-check-box')			
			.label('IsHidden')
			.contentWidth(leftWidth)
			.bindValue(this, ()=>this.isHidden);

	}

	plot(dTreez,  legendSelection, rectSelection, legend) {

		this.__dTreez = dTreez;
		this.__legendSelection = legendSelection;
		this.__rectSelection = rectSelection;
		

		//TODO
		//Drag drag = this.__dTreez.behavior().drag().onDrag(this);
		//legendSelection.call(drag);

		this.__replotLegendContentAndUpdateRect();

		this.bindBooleanToNegatingDisplay(()=>this.isHidden, this.__legendSelection);

		return legendSelection;
	}
	
	refresh() {
		this.__replotLegendContentAndUpdateRect();
	}
	

	__replotLegendContentAndUpdateRect() {
		this.__legendSelection //
				.select('.legend-content') //
				.remove();

		this.__contentSelection = this.__legendSelection //
				.append('g') //
				.classed('legend-content', true);

		let legendEntrySelections = this.__createLegendEntries(this.__legendContributors);
		this.__setLegendEntryPositions(legendEntrySelections);

		this.__updateRectSize();
		this.__updateLegendPosition();
	}

	

	__updateRectSize() {

		let margin = this.marginSize;
		if (!margin) {
			margin = 0;
		}
		let bounds = this.__contentSelection.node().getBBox();
		let contentWidth = bounds.width;
		let contentHeight = bounds.height;

		let contentIsEmpty = contentWidth == 0 || contentHeight == 0;
		if (contentIsEmpty) {
			this.__rectSelection.attr('width', 0);
			this.__rectSelection.attr('height', 0);
		} else {
			let rectWidth = contentWidth + 2 * margin;
			let rectHight = contentHeight + 2 * margin;

			this.__rectSelection.attr('width', rectWidth);
			this.__rectSelection.attr('height', rectHight);
		}
	}

	__updateLegendPosition() {
		if (this.horizontalPosition.isManual) {
			this.__applyManualHorizontalPosition();
		} else {
			this.__applyAutomaticHorizontalPosition();
		}

		if (this.verticalPosition.isManual) {
			this.__applyManualVerticalPosition();
		} else {
			this.__applyAutomaticVerticalPosition();
		}
	}

	

	__createLegendEntries(legendContributors) {
		this.__removeOldLegendEntries();
		let legendEntrySelections = [];
		for (var contributor of legendContributors) {
			var legendEntrySelection = this.__createLegendEntry(contributor);
			legendEntrySelections.push(legendEntrySelection);
		}
		return legendEntrySelections;
	}

	__removeOldLegendEntries() {
		this.__contentSelection //
				.selectAll('.legend-entry') //
				.remove();
	}

	__createLegendEntry(contributor) {

		let symbolLengthInPx = this.keyLength;

		let entrySelection = this.__contentSelection //
				.append('g') //
				.classed('legend-entry', true);

		let symbolSelection = contributor.createLegendSymbolGroup(this.__dTreez, entrySelection, symbolLengthInPx, this);
		let labelSelection = this.__createLegendLabel(entrySelection, contributor);

		if (this.isSwappingSymbol) {
			this.__positionLabelBeforeSymbol(symbolSelection, labelSelection);
		} else {
			this.__positionSymbolBeforeLabel(symbolSelection, labelSelection);
		}

		return entrySelection;
	}

	__createLegendLabel(entrySelection, contributor) {
		let legendText = contributor.legendText;
		let labelSelection = entrySelection //
				.append('text') //
				.attr('id', 'text') //
				.classed('legend-text', true) //
				.text(legendText);

		this.parent.text.formatText(labelSelection, this);

		return labelSelection;
	}

	__positionSymbolBeforeLabel(symbolSelection, labelSelection) {

		let symbolBounds = symbolSelection.node().getBBox();
		let labelBounds = labelSelection.node().getBBox();
		let symbolHeight = symbolBounds.height;
		let symbolMinY = symbolBounds.y;
		let symbolWidth = symbolBounds.width;
		let symbolMinX = symbolBounds.x;

		let labelHeight = labelBounds.height;
		let labelMinY = labelBounds.y;

		let maxHeight = Math.max(symbolHeight, labelHeight);

		let symbolX = 0 - symbolMinX;
		let symbolY = maxHeight / 2 - symbolHeight / 2 - symbolMinY;
		symbolSelection.attr('transform', 'translate(' + symbolX + ',' + symbolY + ')');

		let labelX = symbolWidth + this.__horizontalSpacingInPx;
		let labelY = maxHeight / 2 - labelHeight / 2 - labelMinY;
		labelSelection.attr('transform', 'translate(' + labelX + ',' + labelY + ')');
	}

	__positionLabelBeforeSymbol(symbolSelection, labelSelection) {

		let symbolBounds = symbolSelection.node().getBBox();
		let labelBounds = labelSelection.node().getBBox();
		let symbolHeight = symbolBounds.height;
		let symbolMinX = symbolBounds.x;
		let symbolMinY = symbolBounds.y;

		let labelHeight = labelBounds.height;
		let labelMinY = labelBounds.y;
		let labelWidth = labelBounds.width;

		let maxHeight = Math.max(symbolHeight, labelHeight);

		let labelX = 0;
		let labelY = maxHeight / 2 - labelHeight / 2 - labelMinY;
		labelSelection.attr('transform', 'translate(' + labelX + ',' + labelY + ')');

		let symbolX = labelWidth + this.__horizontalSpacingInPx - symbolMinX;
		let symbolY = maxHeight / 2 - symbolHeight / 2 - symbolMinY;
		symbolSelection.attr('transform', 'translate(' + symbolX + ',' + symbolY + ')');
	}

	__setLegendEntryPositions(legendEntrySelections) {
		let numberOfLegendEntries = legendEntrySelections.length;
		let numOfColumns = this.numberOfColumns;
		let numberOfEntriesPerColumn = numberOfLegendEntries / numOfColumns;
		if (numberOfEntriesPerColumn == 0) {
			numberOfEntriesPerColumn = 1;
		}

		let columnWidths = this.__columnWidths(legendEntrySelections, numOfColumns, numberOfEntriesPerColumn);
		let rowHeight = this.__maxEntryHeight(legendEntrySelections);
		let margin = this.marginSize;

		let columnIndex = 0;
		let rowIndexInColumn = 0;
		let x = margin;
		let y0 = margin;

		for (let legendEntry of legendEntrySelections) {

			let entryBounds = legendEntry.node().getBBox();
			let entryHeight = entryBounds.height;
			let entryMinY = entryBounds.y;
			let y = y0 + rowHeight / 2 - entryHeight / 2 - entryMinY;

			legendEntry.attr('transform', 'translate(' + x + ',' + y + ')');
			rowIndexInColumn++;
			if (rowIndexInColumn < numberOfEntriesPerColumn) {
				y0 += rowHeight + this.__verticalSpacingInPx
			} else {
				x += columnWidths[columnIndex] + this.__horizontalSpacingInPx;
				y0 = margin;
				columnIndex++;
				rowIndexInColumn = 0;
			}
		}
	}

	__columnWidths(entrySelections, numberOfColumns, numberOfEntriesPerColumn) {

		let columnWidths = [0];

		let columnIndex = 0;
		let rowIndex = 0;
		columnWidths[columnIndex] = 0;
		for (var entrySelection of entrySelections) {

			if (rowIndex >= numberOfEntriesPerColumn) {
				rowIndex = 0;
				columnIndex++;
				columnWidths[columnIndex] = 0;
			}

			let bounds = entrySelection.node().getBBox();
			let width = bounds.width;
			if (width > columnWidths[columnIndex]) {
				columnWidths[columnIndex] = width;
			}
			rowIndex++;
		}

		return columnWidths;
	}

	__maxEntryHeight(legendEntrySelections) {
		let maxHeight = 0;
		for (var legendEntry of legendEntrySelections) {
			let entryBounds = legendEntry.node().getBBox();
			let height = entryBounds.height;
			if (height > maxHeight) {
				maxHeight = height;
			}
		}
		return maxHeight;
	}

	

	__convertManualPositions() {
		let x = this.manualHorizontalPosition;
		let y = this.manualVerticalPosition;

		let leftGraphMargin = Length.toPx(this.__graph.data.leftMargin);
		let topGraphMargin = Length.toPx(this.__graph.data.topMargin);
		
		if (this.positionReference.isPage) {
			let pageX = x + Math.floor(leftGraphMargin);
			this.manualHorizontalPosition = pageX;

			let pageY = y + Math.floor(topGraphMargin);
			this.manualVerticalPosition = pageY;
		} else {
			let graphX = x - Math.floor(leftGraphMargin);
			this.manualHorizontalPosition = graphX;

			let pageY = y - Math.floor(topGraphMargin);
			this.manualVerticalPosition = pageY;
		}
	}

	__applyManualHorizontalPosition() {		
		this.__setXPosition(this.manualHorizontalPosition);
	}

	__applyAutomaticHorizontalPosition() {
		let x;
		switch (this.horizontalPosition) {
		case HorizontalPosition.centre:
			x = this.__horizontalPositionForCentreAlignment;
			break;
		case HorizontalPosition.left:
			x = this.__marginAroundLegendInPx;
			break;
		case HorizontalPosition.manual:
			throw new Error('This method must not be called in manual mode');
		case HorizontalPosition.right:
			x = this.__horizontalPositionForRightAlignment;
			break;
		default:
			let message = 'The position "' + this.horizontalPosition + '" is not known.';
			throw new Error(message);
		}
		this.__setXPosition(x);
	}

	

	__setXPosition(x) {
		let oldTransform = this.__dTreez.transform(this.__legendSelection.attr('transform'));
		let oldY = oldTransform.translateY;
		
		if (this.positionReference.isPage) {
			let graphMargin = Length.toPx(this.__graph.data.leftMargin);
			let pageX = x - Math.floor(graphMargin);
			this.__legendSelection.attr('transform', 'translate(' + pageX + ',' + oldY + ')');
		} else {
			this.__legendSelection.attr('transform', 'translate(' + x + ',' + oldY + ')');
		}
	}

	__applyManualVerticalPosition() {		
		this.__setYPosition(this.manualVerticalPosition);
	}

	__applyAutomaticVerticalPosition() {
		let y;
		switch (this.verticalPosition) {
		case VerticalPosition.bottom:
			y = this.__verticalPositionForBottomAlignment;
			break;
		case VerticalPosition.centre:
			y = this.__verticalPositionForCentreAlignment;
			break;
		case VerticalPosition.manual:
			throw new Error('This method must not be called in manual mode');
		case VerticalPosition.top:
			y = this.__marginAroundLegendInPx;
			break;
		default:
			let message = 'The position "' + this.verticalPosition + '" is not known.';
			throw new Error(message);
		}
		this.__setYPosition(y);
	}	

	__setYPosition(y) {

		let oldTransform = this.__dTreez.transform(this.__legendSelection.attr('transform'));
		let oldX = oldTransform.translateX;
		
		if (this.positionReference.isPage) {
			let graphMargin = Length.toPx(this.__graph.data.topMargin);
			let pageY = y - Math.floor(graphMargin);
			this.__legendSelection.attr('transform', 'translate(' + oldX + ',' + pageY + ')');
		} else {
			this.__legendSelection.attr('transform', 'translate(' + oldX + ',' + y + ')');
		}
	}

	handleDrag(context, d, index) {

		let oldTransform = this.__dTreez.transform(this.__legendSelection.attr('transform'));
		let oldX = oldTransform.translateX;
		let oldY = oldTransform.translateY;

		let delta = this.__dTreez.eventAsDCoords();
		let dX = delta.x();
		let dY = delta.y();

		let x = oldX + dX;
		let y = oldY + dY;

		if (!x.equals(oldX)) {
			this.setNewManualXPosition(x);
		}

		if (!y.equals(oldY)) {
			this.setNewManualYPosition(y);
		}

		this.__legendSelection //
				.attr('transform', 'translate(' + x + ',' + y + ')');

	}
	
	handleDragStart(context, d, index) {
		//not used here
	}

	handleDragEnd(context, d, index) {
		//not used here
	}

	__setNewManualXPosition(x) {
		this.horizontalPosition = HorizontalPosition.manual;
		let intValue = Math.floor(x);
		
		if (this.positionReference.isPage) {
			let leftGraphMargin = Length.toPx(this.__graph.data.leftMargin);
			intValue += Math.floor(leftGraphMargin);
		}

		this.manualHorizontalPosition = intValue;
	}

	__setNewManualYPosition(y) {
		this.verticalPosition = VerticalPosition.manual;
		
		let intValue = Math.floor(y);
		
		if (this.positionReference.isPage) {
			let topGraphMargin = Length.toPx(this.__graph.data.topMargin);
			intValue += Math.floor(topGraphMargin);
		}

		this.manualVerticalPosition = intValue;
	}

	get __legendContributors() {
		let legendContributors = [];		
		for (var graphChild of this.__graph.children) {
			let isLegendContributor = graphChild.addLegendContributors !== undefined;
			if (isLegendContributor) {				
				graphChild.addLegendContributors(legendContributors);
			}
		}
		return legendContributors;
	}

	get __graph(){
		return this.parent.parent;
	}

	get __page(){
		return this.__graph.parent;
	}

	get __bottomBorderY() {
		let yBottomBorder;		
		if (this.positionReference.isPage) {			
			yBottomBorder = Math.floor(Length.toPx(this.__page.height));
		} else {
			yBottomBorder = Math.floor(Length.toPx(this.__graph.data.height));
		}
		return yBottomBorder;
	}

	get __horizontalPositionForCentreAlignment() {
		let xRightBorder = this.__rightBorderX;
		let rectWidth = Math.floor(Length.toPx(this.__rectSelection.attr('width')));
		let x = xRightBorder / 2 - rectWidth / 2;
		return x;
	}

	get __horizontalPositionForRightAlignment() {
		let xRightBorder = this.__rightBorderX;
		let rectWidth = Math.floor(Length.toPx(this.__rectSelection.attr('width')));
		let x = xRightBorder - this.__marginAroundLegendInPx - rectWidth;
		return x;
	}

	get __rightBorderX() {
		let xRightBorder;		
		if (this.positionReference.isPage) {			
			xRightBorder = Math.floor(Length.toPx(this.__page.width));
		} else {
			xRightBorder = Math.floor(Length.toPx(this.__graph.data.width));
		}
		return xRightBorder;
	}

	get __verticalPositionForBottomAlignment() {
		let yBottomBorder = this.__bottomBorderY;
		let rectHeight = Math.floor(Length.toPx(this.__rectSelection.attr('height')));
		let y = yBottomBorder - this.__marginAroundLegendInPx - rectHeight;
		return y;
	}

	get __verticalPositionForCentreAlignment() {
		let yBottomBorder = this.__bottomBorderY;
		let rectHeight = Math.floor(Length.toPx(this.__rectSelection.attr('height')));
		let y = yBottomBorder / 2 - rectHeight / 2;
		return y;
	}


}
