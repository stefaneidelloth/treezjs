import GraphicsAtom from './../graphics/graphicsAtom.js';
import PositionReference from './positionReference.js';
import HorizontalPosition from './horizontalPosition.js';
import VerticalPosition from './verticalPosition.js';

export default class Main extends GraphicsAtom {
	
	constructor(legend){
		super();

		this.__marginAroundLegendInPx = 20;
		this.__horizontalSpacingInPx = 10;
		this.__verticalSpacingInPx = 5;
	
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

	
		this.__dTreez = undefined;
	
		this.__legend = legend;
	
		this.__graph = legend.parent;
	
		this.__legendSelection = undefined;
		this.__contentSelection = undefined;
		this.__rectSelection = undefined;
		
		this.__positionReferenceSelection = undefined;
		this.__horizontalPositionSelection = undefined;
		this.__verticalPositionSelection = undefined;
	}
	
	createPage(root) {

		 var page = root.append('treez-tab')
			.label('Data');

		 var section = page.append('treez-section')
			.label('Data');
	
		var sectionContent = section.append('div');

		this.__positionReferenceSelection = sectionContent.append('treez-enum-combo-box')
			.label('Position reference')
			.nodeAttr('enum',PositionReference)
			.bindValue(this, ()=>this.positionReference);

		this.__horizontalPositionSelection = sectionContent.append('treez-enum-combo-box')
			.label('Horizontal position')
			.nodeAttr('enum',HorizontalPosition)
			.bindValue(this, ()=>this.horizontalPosition);

		this.__verticalPositionSelection = sectionContent.append('treez-enum-combo-box')
			.label('Vertical position')
			.nodeAttr('enum',VerticalPosition)
			.bindValue(this, ()=>this.verticalPosition);

		sectionContent.append('treez-integer')
			.label('Manual horizontal position')
			.bindValue(this, ()=>this.manualHorizontalPosition);

		sectionContent.append('treez-integer')
			.label('Manual vertical position')
			.bindValue(this, ()=>this.manualVerticalPosition);

		sectionContent.append('treez-integer')
			.label('Margin size')
			.bindValue(this, ()=>this.marginSize);

		sectionContent.append('treez-integer')
			.label('Number of columns')
			.bindValue(this, ()=>this.numberOfColumns);

		sectionContent.append('treez-integer')
			.label('Key length')
			.bindValue(this, ()=>this.keyLength);

		sectionContent.append('treez-check-box')
			.label('Is swapping symbol')
			.bindValue(this, ()=>this.isSwappingSymbol);

		sectionContent.append('treez-check-box')
			.label('Is hidden')
			.bindValue(this, ()=>this.isHidden);

	}

	plot(dTreez,  legendSelection, rectSelection, legend) {

		this.__dTreez = dTreez;
		this.__legendSelection = legendSelection;
		this.__rectSelection = rectSelection;
		this.__legend = legend;
		this.__graph = legend.parent;

		//TODO
		//Drag drag = d3.behavior().drag().onDrag(this);
		//legendSelection.call(drag);

		this.__replotLegendContentAndUpdateRect();

		this.__listenForChanges(dTreez);

		return legendSelection;
	}
	
	refresh() {
		this.__replotLegendContentAndUpdateRect();
	}
	

	__replotLegendContentAndUpdateRect() {
		this.__legendSelection //
				.select('.legend-content') //
				.remove();

		var contentSelection = this.__legendSelection //
				.append('g') //
				.classed('legend-content', true);

		let legendEntrySelections = this.__createLegendEntries(this.__legendContributors);
		this.setLegendEntryPositions(legendEntrySelections);

		this.__updateRectSize();
		this.__updateLegendPosition();
	}

	

	__updateRectSize() {

		let margin = this.marginSize;
		if (!margin) {
			margin = 0;
		}
		let bounds = this.__contentSelection.node().getBBox();
		let contentWidth = bounds.getWidth();
		let contentHeight = bounds.getHeight();

		let contentIsEmpty = contentWidth.equals(0.0) || contentHeight.equals(0.0);
		if (contentIsEmpty) {
			rectSelection.attr('width', 0);
			rectSelection.attr('height', 0);
		} else {
			let rectWidth = contentWidth + 2 * margin;
			let rectHight = bounds.getHeight() + 2 * margin;

			rectSelection.attr('width', rectWidth);
			rectSelection.attr('height', rectHight);
		}
	}

	__updateLegendPosition() {
		if (this.horizontalPosition.isManual()) {
			this.__applyManualHorizontalPosition();
		} else {
			this.__applyAutomaticHorizontalPosition();
		}

		if (this.verticalPosition.isManual()) {
			this.__applyManualVerticalPosition();
		} else {
			this.__applyAutomaticVerticalPosition();
		}
	}

	__listenForChanges(dTreez) {

		this.bindDisplayToBooleanAttribute('hideGraph', this.__legendSelection, this.isHidden);

		let replotLegend = () => {
			this.__legend.updatePlotWithD3(dTreez);
		};

		this.__positionReferenceSelection.onChange(() => {
			this.__convertManualPositions();
			this.replotLegend();
		});

		this.__horizontalPositionSelection.onChange(replotLegend);
		this.__verticalPositionSelection.onChange(replotLegend);

		this.__manualHorizontalPositionSelection.onChange(replotLegend);
		this.__manualVerticalPositionSelection.onChange(replotLegend);
		this.__marginSizeSelection.onChange(replotLegend);
		this.__numberOfColumnsSelection.onChange(replotLegend);
		this.__keyLengthSelection.onChange(replotLegend);

		this.__isSwappingSymbolSelection.onChange(replotLegend);
	}


	__createLegendEntries(legendContributors) {
		this.__removeOldLegendEntries();
		let legendEntrySelections = [];
		for (var contributor in legendContributors) {
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

		let symbolSelection = contributor.createLegendSymbolGroup(d3, entrySelection, symbolLengthInPx, this);
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

		this.__legend.text.formatText(labelSelection, this);

		return labelSelection;
	}

	__positionSymbolBeforeLabel(symbolSelection, labelSelection) {

		let symbolBounds = symbolSelection.node().getBBox();
		let labelBounds = labelSelection.node().getBBox();
		let symbolHeight = symbolBounds.getHeight();
		let symbolMinY = symbolBounds.getMinY();
		let symbolWidth = symbolBounds.getWidth();
		let symbolMinX = symbolBounds.getMinX();

		let labelHeight = labelBounds.getHeight();
		let labelMinY = labelBounds.getMinY();

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
		let symbolHeight = symbolBounds.getHeight();
		let symbolMinX = symbolBounds.getMinX();
		let symbolMinY = symbolBounds.getMinY();

		let labelHeight = labelBounds.getHeight();
		let labelMinY = labelBounds.getMinY();
		let labelWidth = labelBounds.getWidth();

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
			let entryHeight = entryBounds.getHeight();
			let entryMinY = entryBounds.getMinY();
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
			let width = bounds.getWidth();
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
			let height = entryBounds.getHeight();
			if (height > maxHeight) {
				maxHeight = height;
			}
		}
		return maxHeight;
	}

	get __legendContributors() {
		let legendContributors = [];		
		for (var graphChild of this.__graph.children) {
			let isLegendContributorProvider = graphChild instanceof LegendContributorProvider;
			if (isLegendContributorProvider) {				
				graphChild.addLegendContributors(legendContributors);
			}
		}
		return legendContributors;
	}

	__convertManualPositions() {
		let x = this.manualHorizontalPosition;
		let y = this.manualVerticalPosition;

		let leftGraphMargin = Length.toPx(this.__graph.data.leftMargin);
		let topGraphMargin = Length.toPx(this.__graph.data.topMargin);

		let referencesPage = this.positionReference.isPage;
		if (referencesPage) {
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

	__applyManualHorizontalPosition(positionReference) {
		let x = this.manualHorizontalPosition;
		this.setXPosition(positionReference, x);
	}

	__applyAutomaticHorizontalPosition(horizontalPosition, positionReference) {
		let x;
		switch (horizontalPosition) {
		case HorizontalPosition.centre:
			x = this.__horizontalPositionForCentreAlignment(positionReference);
			break;
		case HorizontalPosition.left:
			x = this.__marginAroundLegendInPx;
			break;
		case HorizontalPosition.manual:
			throw new Error('This method must not be called in manual mode');
		case HorizontalPosition.right:
			x = this.__horizontalPositionForRightAlignment(positionReference);
			break;
		default:
			let message = 'The position "' + horizontalPosition + '" is not known.';
			throw new Error(message);
		}
		this.setXPosition(positionReference, x);
	}

	__horizontalPositionForCentreAlignment(positionReference) {
		let xRightBorder = this.rightBorderX(positionReference);
		let rectWidth = Math.floor(Length.toPx(this.__rectSelection.attr('width')));
		let x = xRightBorder / 2 - rectWidth / 2;
		return x;
	}

	__horizontalPositionForRightAlignment(positionReference) {
		let xRightBorder = this.rightBorderX(positionReference);
		let rectWidth = Math.floor(Length.toPx(this.__rectSelection.attr('width')));
		let x = xRightBorder - this.__marginAroundLegendInPx - rectWidth;
		return x;
	}

	__rightBorderX(positionReference) {
		let xRightBorder;		
		if (positionReference.isPage) {
			let page = this.__graph.parentAtom;
			xRightBorder = Math.floor(Length.toPx(page.width));
		} else {
			xRightBorder = Math.floor(Length.toPx(this.__graph.data.width));
		}
		return xRightBorder;
	}

	__setXPosition(positionReference, x) {
		let oldTransform = d3.transform(this.__legendSelection.attr('transform'));
		let oldY = oldTransform.translate().get(1);

		
		if (positionReference.isPage) {
			let graphMargin = Length.toPx(this.__graph.data.leftMargin);
			let pageX = x - Math.floor(graphMargin);
			this.__legendSelection.attr('transform', 'translate(' + pageX + ',' + oldY + ')');
		} else {
			this.__legendSelection.attr('transform', 'translate(' + x + ',' + oldY + ')');
		}
	}

	__applyManualVerticalPosition(positionReference) {
		let y = this.manualVerticalPosition;
		this.setYPosition(positionReference, y);
	}

	__applyAutomaticVerticalPosition(verticalPosition, 
			 positionReference) {
		let y;
		switch (verticalPosition) {
		case VerticalPosition.bottom:
			y = this.verticalPositionForBottomAlignment(positionReference);
			break;
		case VerticalPosition.centre:
			y = this.verticalPositionForCentreAlignment(positionReference);
			break;
		case VerticalPosition.manual:
			throw new Error('This method must not be called in manual mode');
		case TOP:
			y = this.__marginAroundLegendInPx;
			break;
		default:
			let message = 'The position "' + verticalPosition + '" is not known.';
			throw new Error(message);
		}
		this.setYPosition(positionReference, y);
	}

	__verticalPositionForBottomAlignment(positionReference) {
		let yBottomBorder = this.bottomBorderY(positionReference);
		let rectHeight = Math.floor(Length.toPx(rectSelection.attr('height')));
		let y = yBottomBorder - this.__marginAroundLegendInPx - rectHeight;
		return y;
	}

	__verticalPositionForCentreAlignment(positionReference) {
		let yBottomBorder = this.bottomBorderY(positionReference);
		let rectHeight = Math.floor(Length.toPx(this.__rectSelection.attr('height')));
		let y = yBottomBorder / 2 - rectHeight / 2;
		return y;
	}

	__bottomBorderY(positionReference) {
		let yBottomBorder;		
		if (positionReference.isPage) {
			let page = this.__graph.parentAtom;
			yBottomBorder = Math.floor(Length.toPx(page.height));
		} else {
			yBottomBorder = Math.floor(Length.toPx(graph.data.height));
		}
		return yBottomBorder;
	}

	__setYPosition(positionReference, y) {

		let oldTransform = d3.transform(this.__legendSelection.attr('transform'));
		let oldX = oldTransform.translate().get(0);
		
		if (positionReference.isPage) {
			let graphMargin = Length.toPx(this.__graph.data.topMargin);
			let pageY = y - Math.floor(graphMargin);
			legendSelection.attr('transform', 'translate(' + oldX + ',' + pageY + ')');
		} else {
			legendSelection.attr('transform', 'translate(' + oldX + ',' + y + ')');
		}
	}

	handleDrag(context, d, index) {

		let oldTransform = d3.transform(this.__legendSelection.attr('transform'));
		let oldX = oldTransform.translate().get(0);
		let oldY = oldTransform.translate().get(1);

		let delta = d3.eventAsDCoords();
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


}
