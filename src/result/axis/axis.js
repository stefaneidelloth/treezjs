export default class Axis extends GraphicsPropertiesPage {

	
	constructor(name, direction) {
		super(name);
		this.image = 'axis.png';
		
		this.data = undefined;
		this.axisLine= undefined;
		this. majorTicks= undefined;
		this.minorTicks= undefined;
		this.tickLabels= undefined;
		this. axisLabel= undefined;

		this.__axisSelection= undefined;		
		this.__quantitativeScaleBuilder = new QuantitativeScaleBuilder(this);
		this.__ordinalScaleBuilder = new OrdinalScaleBuilder();
		
		//TODO data?
		data.direction = direction;
	}

	createPropertyPageFactories() {

		this.data = new Data();
		this.propertyPageFactories.add(this.data);

		this.axisLine = new AxisLine();
		this.propertyPageFactories.add(this.axisLine);

		this.majorTicks = new MajorTicks();
		this.propertyPageFactories.add(this.majorTicks);

		this.minorTicks = new MinorTicks();
		this.propertyPageFactories.add(this.minorTicks);

		this.tickLabels = new TickLabels();
		propertyPageFactories.add(this.tickLabels);

		this.axisLabel = new AxisLabel();
		propertyPageFactories.add(this.axisLabel);

	}

	

	plot(dTreez, graphSelection, graphRectSelection, treeView) {
		
		this.__dTreez = dTreez;
		this.__treeView = treeView;
		
		this.__removeOldAxisGroupIfAlreadyExists(graphSelection);
		this.__createNewAxisGroup(graphSelection);
		this.__updatePlot(dTreez);
		return graphSelection;
	}

	__removeOldAxisGroupIfAlreadyExists(graphSelection) {
		graphSelection //
				.select('#' + name) //
				.remove(); //
	}

	__createNewAxisGroup(graphSelection) {
		axisSelection = graphSelection //
				.append('g') //
				.className('axis') //
				.onClick(this);
		bindNameToId(axisSelection);
	}

	updatePlot(dTreez) {
		this.__plotPageModels(dTreez);
	}

	update() {
		if (this.__dTreez) {
			this.__updatePlot(this.__dTreez);
		}
	}

	plotPageModels(dTreez) {
		this.__propertyPageFactories.forEach(pageFactory=>{
			this.axisSelection = pageModel.plotWithD3(dTreez, this.axisSelection, null, this);
		});
		
	}

	createScale(graphWidthInPx, graphHeightInPx) {

		var scaleFactory = this.__dTreez //
				.scale();

		var axisMode = this.__getAxisMode();
		switch (axisMode) {
		case QUANTITATIVE:
			this.__quantitativeScaleBuilder.createScale(scaleFactory, this.graphWidthInPx, this.graphHeightInPx);
			break;
		case ORDINAL:
			this.__ordinalScaleBuilder.createScale(scaleFactory, this.isHorizontal, this.graphWidthInPx, this.graphHeightInPx);
			break;
		//case TIME:
		//	throw new IllegalStateException("not yet implemented");
		default:
			throw new Error('not yet implemented');
		}
	}

	includeDataForAutoScale(dataForAutoScale) {
		this.__quantitativeScaleBuilder.includeDomainValuesForAutoScale(dataForAutoScale);
	}

	clearDataForAutoScale() {
		this.__quantitativeScaleBuilder.clearDataForAutoScale();
	}

	includeOrdinalValuesForAutoScale(ordinalValues) {
		this.__ordinalScaleBuilder.includeDomainValuesForAutoScale(ordinalValues);
	}

	//#end region

	//#region ACCESSORS

	getAxisMode() {
		return this.data.mode;
	}

	getScale() {

		var axisMode = this.getAxisMode();
		switch (axisMode) {
		case QUANTITATIVE:
			return this.__quantitativeScaleBuilder.getScale();
		case ORDINAL:
			return this.__ordinalScaleBuilder.getScale();
		//case TIME:
		//	throw new IllegalStateException("not yet implemented");
		default:
			throw new Error('not yet implemented');
		}
	}

	getNumberOfValues() {
		var axisMode = getAxisMode();
		switch (axisMode) {
		case QUANTITATIVE:
			throw new Error('not yet implemented');
		case ORDINAL:
			return this.__ordinalScaleBuilder.getNumberOfValues();
		//case TIME:
		//	throw new IllegalStateException("not yet implemented");
		default:
			throw new Error('not yet implemented');
		}
	}

	isQuantitative() {
		return this.data.isQuantitative;
		
	}

	isOrdinal() {
		return this.data.isOrdinal;
	}

	isHorizontal() {
		var direction = data.direction;
		return direction.isHorizontal;
	}

	getQuantitativeLimits() {

		if (this.isQuantitative()) {
			var min = data.min;
			var isAutoMin = data.autoMin;
			if (isAutoMin) {
				min = this.__quantitativeScaleBuilder.getAutoMinValue();
			}

			var max = data.max;
			var isAutoMax = data.autoMax;
			if (isAutoMax) {
				max = this.__quantitativeScaleBuilder.getAutoMaxValue();
			}

			return [min, max];
		} else {
			var numberOfValues = 0.0 + this.getNumberOfValues();
			return [1.0, numberOfValues];
		}
	}

	//#end region

}
