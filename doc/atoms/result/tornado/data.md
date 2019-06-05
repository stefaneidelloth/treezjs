import GraphicsAtom from './../graphics/graphicsAtom.js';
import DataMode from './dataMode.js';
import SortingMode from './sortingMode.js';
import Axis from './../axis/axis.js';
import Table from './../../data/table/table.js';
import Column from './../../data/column/column.js';

export default class Data extends GraphicsAtom {
	
	constructor(){
		super();		

		this.dataMode = DataMode.table;
		this.tablePath = 'root.data.table';		

		this.leftLegendText = 'left legend text';
		this.rightLegendText = 'right legend text';		
		this.sortingMode = SortingMode.largestDifference;
		this.barFillRatio = '0.75';
		
		this.labelAxis = 'root.results.page.graph.y';
				
		this.inputBase = 'root.results.data.table.columns.inputBase';
		this.inputLabel = '';
		this.inputLeft = 'root.results.data.table.columns.inputLeft';
		this.inputRight = 'root.results.data.table.columns.inputRight';
		this.inputUnit = 'root.results.data.table.columns.unit';		
	
		this.outputAxis = 'root.results.page.graph.x';		
		this.outputBase = 'root.results.data.table.columns.outputBase';
		this.outputLeft = 'root.results.data.table.columns.outputLeft';
		this.outputRight = 'root.results.data.table.columns.outputRight';
		this.outputUnit = '';			

	}

	createPage(root) {
		
		var page = root.append('treez-tab')
			.label('Data');
		
		this.__createGeneralSection(page);
		this.__createInputSection(page);
		this.__createOutputSection(page);

	}

	__createGeneralSection(page) {
		
		var section = page.append('treez-section')
			.label('General');	
		
		var sectionContent = section.append('div');	
		
		sectionContent.append('treez-enum-combo-box')
			.label('Data mode')
			.nodeAttr('options', DataMode)
			.onChange(()=>this.__dataModeChanged())
			.bindValue(this, ()=>this.dataMode);
		
		sectionContent.append('treez-model-path')
			.label('Table')
			.nodeAttr('atomClasses',[Table])
			.bindValue(this,()=>this.tablePath);		
		
		sectionContent.append('treez-model-path')
			.label('Output axis')
			.nodeAttr('atomClasses',[Axis])
			.bindValue(this,()=>this.outputAxis);

		sectionContent.append('treez-model-path')
			.label('Label axis')
			.nodeAttr('atomClasses',[Axis])
			.bindValue(this,()=>this.labelAxis);

		sectionContent.append('treez-text-field')
			.label('Unit')
			.bindValue(this, ()=>this.outputUnit);

		sectionContent.append('treez-enum-combo-box')
			.label('Sorting mode')
			.nodeAttr('options', SortingMode)			
			.bindValue(this, ()=>this.sortingMode);

		sectionContent.append('treez-text-field')
			.label('Left legend text')
			.bindValue(this, ()=>this.leftLegendText);
		
		sectionContent.append('treez-text-field')
			.label('Right legend text')
			.bindValue(this, ()=>this.rightLegendText);

		sectionContent.append('treez-text-field')
			.label('Bar fill ratio')
			.bindValue(this, ()=>this.barFillRatio);
		
	}
	
	__dataModeChanged(){
		
		//TODO
		//dataModeBox.createEnableTarget('enableTablePath', DataMode.TABLE, 'data.general.tablePath');
		//dataModeBox.createDisableTarget('disableInputColumns', DataMode.TABLE, 'data.input');
		//dataModeBox.createDisableTarget('disableOutputColumns', DataMode.TABLE, 'data.output');
	}

	__createInputSection(page) {		
		
		var section = page.append('treez-section')
			.label('Input columns');	
		
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-model-path')
			.label('Label')
			.nodeAttr('atomClasses',[Column])
			.bindValue(this,()=>this.inputLabel);
		
		sectionContent.append('treez-model-path')
			.label('Base')
			.nodeAttr('atomClasses',[Column])
			.bindValue(this,()=>this.inputBase);
		
		sectionContent.append('treez-model-path')
			.label('Left')
			.nodeAttr('atomClasses',[Column])
			.bindValue(this,()=>this.inputLeft);
		
		sectionContent.append('treez-model-path')
			.label('Right')
			.nodeAttr('atomClasses',[Column])
			.bindValue(this,()=>this.inputRight);
		
		sectionContent.append('treez-model-path')
			.label('Unit')
			.nodeAttr('atomClasses',[Column])
			.bindValue(this,()=>this.inputUnit);	

	}

	__createOutputSection(page) {			
		
		var section = page.append('treez-section')
			.label('Output columns');	
		
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-model-path')
			.label('Base')
			.nodeAttr('atomClasses',[Column])
			.bindValue(this,()=>this.outputBase);
		
		sectionContent.append('treez-model-path')
			.label('Left')
			.nodeAttr('atomClasses',[Column])
			.bindValue(this,()=>this.outputLeft);
		
		sectionContent.append('treez-model-path')
			.label('Right')
			.nodeAttr('atomClasses',[Column])
			.bindValue(this,()=>this.outputRight);		

	}

	plot(dTreez, parentSelection, rectSelection, tornado) {
		
		var replotListener = () => tornado.updatePlot(dTreez);
		
		this.addListener(()=>this.inputLabel, replotListener);
		this.addListener(()=>this.inputBase, replotListener);
		this.addListener(()=>this.inputLeft, replotListener);
		this.addListener(()=>this.inputUnit, replotListener);
		this.addListener(()=>this.labelAxis, replotListener);
		
		this.addListener(()=>this.outputBase, replotListener);
		this.addListener(()=>this.outputLeft, replotListener);
		this.addListener(()=>this.outputRight, replotListener);
		this.addListener(()=>this.outputUnit, replotListener);
		this.addListener(()=>this.outputAxis, replotListener);
		
		this.addListener(()=>this.leftLegendText, replotListener);
		this.addListener(()=>this.rightLegendText, replotListener);
		this.addListener(()=>this.sortingMode, replotListener);
		this.addListener(()=>this.barFillRatio, replotListener);		

		return parentSelection;
	}

	__getValuesWithColumnPath(dataPath) {
		if (!dataPath) {
			return [];
		}
		var dataColumn = this.childFromRoot(dataPath);
		if(!dataColumn){
			throw new Error('Could not find column "' + dataPath + '"');
		}
		return dataColumn.values;		
	}

	get leftBarDataString() {
		var inputLabelData = this.inputLabelData;
		var inputLeftData = this.inputLeftData;
		var outputBaseData = this.outputBaseData;
		var outputLeftData = this.outputLeftData;
		
		var dataSize = outputBaseData.length;

		var labelAxisIsOrdinal = this.labelAxis.isOrdinal;

		var rowList = [];
		for (var rowIndex = 0; rowIndex < dataSize; rowIndex++) {

			
			var inputLeftValue = parseFloat('' + inputLeftData[rowIndex]);			
			var outputBaseValue = parseFloat('' +outputBaseData[rowIndex]);			
			var outputLeftValue = parseFloat('' + outputLeftData[rowIndex] );

			var difference = outputBaseValue - outputLeftValue;

			var position = outputLeftValue;
			var size = difference;
			if (difference < 0) {
				position = outputBaseValue;
				size = -difference;
			}

			var inputValue;
			if (labelAxisIsOrdinal) {
				inputValue = '"' + inputLabelData[rowIndex] + '"';
			} else {
				inputValue = '' + (rowIndex + 1);
			}

			var rowString = '{key:' + inputValue + //
					', input:' + inputLeftValue + //
					', value:' + position + //
					', size:' + size + //
					'}';
			rowList.push(rowString);
		}
		
		return '[' + rowList.join(',') + ']';		
	}

	get rightBarDataString() {
		var inputLabelData = this.inputLabelData;
		var inputRightData = this.inputRightData;
		var outputBaseData = this.outputBaseData;
		var outputRightData = this.outputRightData;
		
		var dataSize = outputBaseData.length;

		var labelAxisIsOrdinal = this.labelAxis.isOrdinal;

		var rowList = [];
		for (var rowIndex = 0; rowIndex < dataSize; rowIndex++) {

			

			var inputRightValue = parseFloat('' + inputRightData[rowIndex]);
			var outputBaseValue = parseFloat('' + outputBaseData[rowIndex]);
			var outputRightValue = parseFloat('' + outputRightData[rowIndex]);			

			var difference = outputRightValue - outputBaseValue;
			var position = outputBaseValue;
			var size = difference;
			if (difference < 0) {
				position = outputRightValue;
				size = -difference;
			}

			var key;
			if (labelAxisIsOrdinal) {
				key = '"' + inputLabelData[rowIndex] + '"';
			} else {
				key = '' + (rowIndex + 1);
			}

			var rowString = '{key:' + key + //
					', input:' + inputRightValue + //
					',value:' + position + //
					',size:' + size + //
					'}';
			rowList.push(rowString);
		}
		return '[' + rowList.join(',') + ']';
		
	}

	get allBarData() {

		var rangeBaseData = this.outputBaseData;
		var rangeLeftData = this.outputLeftData;
		var rangeRightData = this.outputRightData;
		
		var dataSize = rangeBaseData.length;
		
		var allData = [];
		for (var rowIndex = 0; rowIndex < dataSize; rowIndex++) {

			var base = parseFloat(rangeBaseData[rowIndex]);
			if (base != null) {
				allData.push(base);
			}

			var left = parseFloat(rangeLeftData[rowIndex]);
			if (left != null) {
				allData.push(left);
			}

			var right = parseFloat(rangeRightData[rowIndex]);
			if (right != null) {
				allData.push(right);
			}
		}

		return allData;
	}
	

	get inputLabelData() {		
		return this.__getValuesWithColumnPath(this.inputLabel);
	}

	get inputBaseData() {
		return this.__getValuesWithColumnPath(this.inputBase);
	}

	get inputLeftData() {
		return this.__getValuesWithColumnPath(this.inputLeft);
	}

	get inputRightData() {
		return this.__getValuesWithColumnPath(this.inputRight);
	}

	get outputBaseData() {
		return this.__getValuesWithColumnPath(this.outputBase);
	}

	get outputLeftData() {
		return this.__getValuesWithColumnPath(this.outputLeft);
	}

	get outputRightData() {
		return this.__getValuesWithColumnPath(this.outputRight);
	}

	

	get __tornado(){
		return this.parent;
	}	

	get inputScale() {
		return this.labelAxisAtom
			?this.labelAxisAtom.scale
			:null;		
	}

	get outputScale() {
		return this.outputAxisAtom
		?this.outputAxisAtom.scale
		:null;
	}

	get dataSize() {
		return this.inputBaseData.length;		
	}

	get labelAxisAtom() {		
		if (!this.labelAxis) {
			return null;
		}
		return this.__tornado.childFromRoot(this.labelAxis);		
	}

	get outputAxisAtom() {		
		if (!this.outputAxis) {
			return null;
		}
		return this.__tornado.childFromRoot(this.outputAxis);		
	}	

}
