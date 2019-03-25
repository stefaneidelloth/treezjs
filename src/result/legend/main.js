import GraphicsAtom from './../graphics/graphicsAtom.js';

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
	
		this.marginSize = this.__horizontalSpacingInPx;
	
		this.numberOfColumns = '1';
	
		this.keyLength = '25';
	
		this.isSwappingSymbol = false;
	
		this.isHidden = false;
	
		this.__dTreez = undefined;
	
		this.__legend = legend;
	
		this.__graph = legend.parent;
	
		this.__legendSelection = undefined;
	
		this.__contentSelection = undefined;
	
		this.__rectSelection = unefined;
		
		this.__positionReferenceSelection = undefined;
		this.__horizontalPositionSeleciton = undefined;
		this.__verticalPositionSelection = undefined;
	}
	
	createPage(root) {

		Page mainPage = root.createPage("main");

		Section main = mainPage.createSection("main");

		positionReferenceBox = main.createEnumComboBox(positionReference, this, PositionReference.GRAPH);
		positionReferenceBox.setLabel("Position reference");

		horizontalPositionBox = main.createEnumComboBox(horizontalPosition, this, HorizontalPosition.RIGHT);
		horizontalPositionBox.setLabel("Horizontal position");

		verticalPositionBox = main.createEnumComboBox(verticalPosition, this, VerticalPosition.TOP);
		verticalPositionBox.setLabel("Vertical position");

		main.createIntegerVariableField(manualHorizontalPosition, this, 0) //
				.setLabel("Manual horizontal position");

		main.createIntegerVariableField(manualVerticalPosition, this, 0) //
				.setLabel("Manual vertical position");

		main.createIntegerVariableField(marginSize, this, HORIZONTAL_SPACING_IN_PX)//
				.setLabel("Margin size");

		main.createIntegerVariableField(numberOfColumns, this, 1)//
				.setLabel("Number of columns");

		final int defaultKeyLength = 25;
		main.createIntegerVariableField(keyLength, this, defaultKeyLength) //
				.setLabel("Key length");

		main.createCheckBox(swapSymbol, this).setLabel("Swap symbol");

		main.createCheckBox(hide, this);

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
		
		legendSelection //
				.select(".legend-content") //
				.remove();

		var contentSelection = legendSelection //
				.append("g") //
				.classed("legend-content", true);

		this.__createLegendEntries();
		this.__updateRectSize();
		this.__updateLegendPosition();
	}

	

	__updateRectSize() {
		BoundingBox bounds = contentSelection.node().getBBox();
		Integer margin = marginSize.get();
		if (margin == null) {
			margin = 0;
		}

		Double contentWidth = bounds.getWidth();
		Double contentHeight = bounds.getHeight();

		boolean contentIsEmpty = contentWidth.equals(0.0) || contentHeight.equals(0.0);
		if (contentIsEmpty) {
			rectSelection.attr("width", 0);
			rectSelection.attr("height", 0);
		} else {
			double rectWidth = contentWidth + 2 * margin;
			double rectHight = bounds.getHeight() + 2 * margin;

			rectSelection.attr("width", rectWidth);
			rectSelection.attr("height", rectHight);
		}

	}

	__updateLegendPosition() {
		PositionReference positionReferenceEnum = positionReferenceBox.get();
		HorizontalPosition horizontalPositionEnum = horizontalPositionBox.get();
		VerticalPosition verticalPositionEnum = verticalPositionBox.get();

		boolean isManualHorizontalPosition = horizontalPositionEnum.isManual();
		if (isManualHorizontalPosition) {
			applyManualHorizontalPosition(positionReferenceEnum);
		} else {
			applyAutomaticHorizontalPosition(horizontalPositionEnum, positionReferenceEnum);
		}

		boolean isManualVerticalPosition = verticalPositionEnum.isManual();
		if (isManualVerticalPosition) {
			applyManualVerticalPosition(positionReferenceEnum);
		} else {
			applyAutomaticVerticalPosition(verticalPositionEnum, positionReferenceEnum);
		}
	}

	__listenForChanges(dTreez) {

		AbstractGraphicsAtom.bindDisplayToBooleanAttribute("hideGraph", legendSelection, hide);

		Consumer replotLegend = () -> {
			legend.updatePlotWithD3(d3);
		};

		positionReference.addModificationConsumer("replotGraph", () -> {
			convertManualPositions();
			replotLegend.consume();
		});
		horizontalPosition.addModificationConsumer("replotGraph", replotLegend);
		verticalPosition.addModificationConsumer("replotGraph", replotLegend);

		manualHorizontalPosition.addModificationConsumer("replotGraph", replotLegend);
		manualVerticalPosition.addModificationConsumer("replotGraph", replotLegend);
		marginSize.addModificationConsumer("replotGraph", replotLegend);
		numberOfColumns.addModificationConsumer("replotGraph", replotLegend);
		keyLength.addModificationConsumer("replotGraph", replotLegend);

		swapSymbol.addModificationConsumer("replotGraph", replotLegend);
	}

	__createLegendEntries() {
		List<LegendContributor> legendContributors = getLegendContributors();
		List<Selection> legendEntrySelections = createLegendEntries(legendContributors);
		setLegendEntryPositions(legendEntrySelections);
	}

	__createLegendEntries(List<LegendContributor> legendContributors) {
		removeOldLegendEntries();
		List<Selection> legendEntrySelections = new ArrayList<>();
		for (LegendContributor contributor : legendContributors) {
			Selection legendEntrySelection = createLegendEntry(contributor);
			legendEntrySelections.add(legendEntrySelection);
		}
		return legendEntrySelections;
	}

	__removeOldLegendEntries() {
		contentSelection //
				.selectAll(".legend-entry") //
				.remove();
	}

	__createLegendEntry(contributor) {

		int symbolLengthInPx = keyLength.get();

		Selection entrySelection = contentSelection //
				.append("g") //
				.classed("legend-entry", true);

		Selection symbolSelection = contributor.createLegendSymbolGroup(d3, entrySelection, symbolLengthInPx, this);
		Selection labelSelection = createLegendLabel(entrySelection, contributor);

		boolean swap = swapSymbol.get();
		if (swap) {
			positionLabelBeforeSymbol(symbolSelection, labelSelection);
		} else {
			positionSymbolBeforeLabel(symbolSelection, labelSelection);
		}

		return entrySelection;
	}

	__createLegendLabel(Selection entrySelection, LegendContributor contributor) {
		String legendText = contributor.getLegendText();
		Selection labelSelection = entrySelection //
				.append("text") //
				.attr("id", "text") //
				.classed("legend-text", true)
				.text(legendText);

		legend.text.formatText(labelSelection, this);

		return labelSelection;
	}

	__positionSymbolBeforeLabel(Selection symbolSelection, Selection labelSelection) {

		BoundingBox symbolBounds = symbolSelection.node().getBBox();
		BoundingBox labelBounds = labelSelection.node().getBBox();
		double symbolHeight = symbolBounds.getHeight();
		double symbolMinY = symbolBounds.getMinY();
		double symbolWidth = symbolBounds.getWidth();
		double symbolMinX = symbolBounds.getMinX();

		double labelHeight = labelBounds.getHeight();
		double labelMinY = labelBounds.getMinY();

		double maxHeight = Math.max(symbolHeight, labelHeight);

		double symbolX = 0 - symbolMinX;
		double symbolY = maxHeight / 2 - symbolHeight / 2 - symbolMinY;
		symbolSelection.attr("transform", "translate(" + symbolX + "," + symbolY + ")");

		double labelX = symbolWidth + HORIZONTAL_SPACING_IN_PX;
		double labelY = maxHeight / 2 - labelHeight / 2 - labelMinY;
		labelSelection.attr("transform", "translate(" + labelX + "," + labelY + ")");
	}

	__positionLabelBeforeSymbol(Selection symbolSelection, Selection labelSelection) {

		BoundingBox symbolBounds = symbolSelection.node().getBBox();
		BoundingBox labelBounds = labelSelection.node().getBBox();
		double symbolHeight = symbolBounds.getHeight();
		double symbolMinX = symbolBounds.getMinX();
		double symbolMinY = symbolBounds.getMinY();

		double labelHeight = labelBounds.getHeight();
		double labelMinY = labelBounds.getMinY();
		double labelWidth = labelBounds.getWidth();

		double maxHeight = Math.max(symbolHeight, labelHeight);

		double labelX = 0;
		double labelY = maxHeight / 2 - labelHeight / 2 - labelMinY;
		labelSelection.attr("transform", "translate(" + labelX + "," + labelY + ")");

		double symbolX = labelWidth + HORIZONTAL_SPACING_IN_PX - symbolMinX;
		double symbolY = maxHeight / 2 - symbolHeight / 2 - symbolMinY;
		symbolSelection.attr("transform", "translate(" + symbolX + "," + symbolY + ")");
	}

	__setLegendEntryPositions(List<Selection> legendEntrySelections) {
		int numberOfLegendEntries = legendEntrySelections.size();
		int numOfColumns = numberOfColumns.get();
		int numberOfEntriesPerColumn = numberOfLegendEntries / numOfColumns;
		if (numberOfEntriesPerColumn == 0) {
			numberOfEntriesPerColumn = 1;
		}

		double[] columnWidths = getColumnWidths(legendEntrySelections, numOfColumns, numberOfEntriesPerColumn);
		double rowHeight = getMaxEntryHeight(legendEntrySelections);
		int margin = marginSize.get();

		int columnIndex = 0;
		int rowIndexInColumn = 0;
		int x = margin;
		int y0 = margin;

		for (Selection legendEntry : legendEntrySelections) {

			BoundingBox entryBounds = legendEntry.node().getBBox();
			double entryHeight = entryBounds.getHeight();
			double entryMinY = entryBounds.getMinY();
			double y = y0 + rowHeight / 2 - entryHeight / 2 - entryMinY;

			legendEntry.attr("transform", "translate(" + x + "," + y + ")");
			rowIndexInColumn++;
			if (rowIndexInColumn < numberOfEntriesPerColumn) {
				y0 += rowHeight + VERTICAL_SPACING_IN_PX;
			} else {
				x += columnWidths[columnIndex] + HORIZONTAL_SPACING_IN_PX;
				y0 = margin;
				columnIndex++;
				rowIndexInColumn = 0;
			}
		}
	}

	__getColumnWidths(
			List<Selection> entrySelections,
			int numberOfColumns,
			int numberOfEntriesPerColumn) {

		double[] columnWidths = new double[numberOfColumns];

		int columnIndex = 0;
		int rowIndex = 0;
		columnWidths[columnIndex] = 0;
		for (Selection entrySelection : entrySelections) {

			if (rowIndex >= numberOfEntriesPerColumn) {
				rowIndex = 0;
				columnIndex++;
				columnWidths[columnIndex] = 0;
			}

			BoundingBox bounds = entrySelection.node().getBBox();
			double width = bounds.getWidth();
			if (width > columnWidths[columnIndex]) {
				columnWidths[columnIndex] = width;
			}
			rowIndex++;
		}

		return columnWidths;
	}

	__getMaxEntryHeight(List<Selection> legendEntrySelections) {
		double maxHeight = 0;
		for (Selection legendEntry : legendEntrySelections) {
			BoundingBox entryBounds = legendEntry.node().getBBox();
			double height = entryBounds.getHeight();
			if (height > maxHeight) {
				maxHeight = height;
			}
		}
		return maxHeight;
	}

	get __legendContributors() {
		List<LegendContributor> legendContributors = new ArrayList<>();
		List<AbstractAtom<?>> graphChildren = graph.getChildAtoms();
		for (AbstractAtom<?> graphChild : graphChildren) {
			boolean isLegendContributorProvider = graphChild instanceof LegendContributorProvider;
			if (isLegendContributorProvider) {
				LegendContributorProvider provider = (LegendContributorProvider) graphChild;
				provider.addLegendContributors(legendContributors);
			}
		}
		return legendContributors;
	}

	__convertManualPositions() {
		int x = manualHorizontalPosition.get();
		int y = manualVerticalPosition.get();

		Double leftGraphMargin = Length.toPx(graph.data.leftMargin.get());
		Double topGraphMargin = Length.toPx(graph.data.topMargin.get());

		boolean referencesPage = positionReferenceBox.get().isPage();
		if (referencesPage) {
			int pageX = x + leftGraphMargin.intValue();
			manualHorizontalPosition.set(pageX);

			int pageY = y + topGraphMargin.intValue();
			manualVerticalPosition.set(pageY);
		} else {
			int graphX = x - leftGraphMargin.intValue();
			manualHorizontalPosition.set(graphX);

			int pageY = y - topGraphMargin.intValue();
			manualVerticalPosition.set(pageY);
		}
	}

	__applyManualHorizontalPosition(PositionReference positionReference) {
		int x = manualHorizontalPosition.get();
		setXPosition(positionReference, x);
	}

	__applyAutomaticHorizontalPosition(
			HorizontalPosition horizontalPosition,
			PositionReference positionReference) {
		int x;
		switch (horizontalPosition) {
		case CENTRE:
			x = getHorizontalPositionForCentreAlignment(positionReference);
			break;
		case LEFT:
			x = MARGIN_AROUND_LEGEND_IN_PX;
			break;
		case MANUAL:
			throw new IllegalStateException("This method must not be called in manual mode");
		case RIGHT:
			x = getHorizontalPositionForRightAlignment(positionReference);
			break;
		default:
			String message = "The position '" + horizontalPosition + "' is not known.";
			throw new IllegalStateException(message);
		}
		setXPosition(positionReference, x);
	}

	__getHorizontalPositionForCentreAlignment(PositionReference positionReference) {
		int xRightBorder = getRightBorderX(positionReference);
		int rectWidth = Length.toPx(rectSelection.attr("width")).intValue();
		int x = xRightBorder / 2 - rectWidth / 2;
		return x;
	}

	__getHorizontalPositionForRightAlignment(PositionReference positionReference) {
		int xRightBorder = getRightBorderX(positionReference);
		int rectWidth = Length.toPx(rectSelection.attr("width")).intValue();
		int x = xRightBorder - MARGIN_AROUND_LEGEND_IN_PX - rectWidth;
		return x;
	}

	__getRightBorderX(PositionReference positionReference) {
		int xRightBorder;
		boolean isPageReference = positionReference.isPage();
		if (isPageReference) {
			org.treez.results.atom.page.Page page = (org.treez.results.atom.page.Page) graph.getParentAtom();
			xRightBorder = Length.toPx(page.width.get()).intValue();
		} else {
			xRightBorder = Length.toPx(graph.data.width.get()).intValue();
		}
		return xRightBorder;
	}

	__setXPosition(PositionReference positionReference, int x) {
		Transform oldTransform = d3.transform(legendSelection.attr("transform"));
		Double oldY = oldTransform.translate().get(1, Double.class);

		boolean isPageReference = positionReference.isPage();
		if (isPageReference) {
			Double graphMargin = Length.toPx(graph.data.leftMargin.get());
			int pageX = x - graphMargin.intValue();
			legendSelection.attr("transform", "translate(" + pageX + "," + oldY + ")");
		} else {
			legendSelection.attr("transform", "translate(" + x + "," + oldY + ")");
		}
	}

	__applyManualVerticalPosition(PositionReference positionReference) {
		int y = manualVerticalPosition.get();
		setYPosition(positionReference, y);
	}

	__applyAutomaticVerticalPosition(
			VerticalPosition verticalPosition,
			PositionReference positionReference) {
		int y;
		switch (verticalPosition) {
		case BOTTOM:
			y = getVerticalPositionForBottomAlignment(positionReference);
			break;
		case CENTRE:
			y = getVerticalPositionForCentreAlignment(positionReference);
			break;
		case MANUAL:
			throw new IllegalStateException("This method must not be called in manual mode");
		case TOP:
			y = MARGIN_AROUND_LEGEND_IN_PX;
			break;
		default:
			String message = "The position '" + verticalPosition + "' is not known.";
			throw new IllegalStateException(message);
		}
		setYPosition(positionReference, y);
	}

	__getVerticalPositionForBottomAlignment(PositionReference positionReference) {
		int yBottomBorder = getBottomBorderY(positionReference);
		int rectHeight = Length.toPx(rectSelection.attr("height")).intValue();
		int y = yBottomBorder - MARGIN_AROUND_LEGEND_IN_PX - rectHeight;
		return y;
	}

	__getVerticalPositionForCentreAlignment(PositionReference positionReference) {
		int yBottomBorder = getBottomBorderY(positionReference);
		int rectHeight = Length.toPx(rectSelection.attr("height")).intValue();
		int y = yBottomBorder / 2 - rectHeight / 2;
		return y;
	}

	__getBottomBorderY(PositionReference positionReference) {
		int yBottomBorder;
		boolean isPageReference = positionReference.isPage();
		if (isPageReference) {
			org.treez.results.atom.page.Page page = (org.treez.results.atom.page.Page) graph.getParentAtom();
			yBottomBorder = Length.toPx(page.height.get()).intValue();
		} else {
			yBottomBorder = Length.toPx(graph.data.height.get()).intValue();
		}
		return yBottomBorder;
	}

	__setYPosition(PositionReference positionReference, int y) {

		Transform oldTransform = d3.transform(legendSelection.attr("transform"));
		Double oldX = oldTransform.translate().get(0, Double.class);

		boolean isPageReference = positionReference.isPage();
		if (isPageReference) {
			Double graphMargin = Length.toPx(graph.data.topMargin.get());
			int pageY = y - graphMargin.intValue();
			legendSelection.attr("transform", "translate(" + oldX + "," + pageY + ")");
		} else {
			legendSelection.attr("transform", "translate(" + oldX + "," + y + ")");
		}
	}

	handleDrag(final Object context, final Object d, final int index) {

		Transform oldTransform = d3.transform(legendSelection.attr("transform"));
		Double oldX = oldTransform.translate().get(0, Double.class);
		Double oldY = oldTransform.translate().get(1, Double.class);

		Coords delta = d3.eventAsDCoords();
		Double dX = delta.x();
		Double dY = delta.y();

		Double x = oldX + dX;
		Double y = oldY + dY;

		if (!x.equals(oldX)) {
			setNewManualXPosition(x);
		}

		if (!y.equals(oldY)) {
			setNewManualYPosition(y);
		}

		legendSelection //
				.attr("transform", "translate(" + x + "," + y + ")");

	}
	
	handleDragStart(final Object context, final Object d, final int index) {
		//not used here
	}

	handleDragEnd(final Object context, final Object d, final int index) {
		//not used here
	}

	__setNewManualXPosition(Double x) {
		horizontalPosition.set(HorizontalPosition.MANUAL);
		Integer intValue = x.intValue();

		boolean isPageReference = positionReferenceBox.get().isPage();
		if (isPageReference) {
			Double leftGraphMargin = Length.toPx(graph.data.leftMargin.get());
			intValue += leftGraphMargin.intValue();
		}

		manualHorizontalPosition.set(intValue);
	}

	__setNewManualYPosition(Double y) {
		verticalPosition.set(VerticalPosition.MANUAL);
		Integer intValue = y.intValue();

		boolean isPageReference = positionReferenceBox.get().isPage();
		if (isPageReference) {
			Double topGraphMargin = Length.toPx(graph.data.topMargin.get());
			intValue += topGraphMargin.intValue();
		}

		manualVerticalPosition.set(intValue);
	}

	


}
