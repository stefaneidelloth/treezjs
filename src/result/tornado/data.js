import GraphicsAtom from './../graphics/graphicsAtom.js';
import Utils from './../../core/utils/utils.js';
import DataMode from './dataMode.js';
import OutputType from './outputType.js';
import SortingMode from './sortingMode.js';
import Axis from './../axis/axis.js';
import Table from './../../data/table/table.js';
import Column from './../../data/column/column.js';

export default class Data extends GraphicsAtom {
	
	constructor(tornado){
		super(tornado);		

		this.dataMode = DataMode.sensitivityProbeTable;
		this.tablePath = 'root.data.table';		

		this.leftLegendText = 'left legend text';
		this.rightLegendText = 'right legend text';		
		this.sortingMode = SortingMode.largestDifference;
		this.barFillRatio = 0.75;
		
		this.labelAxis = 'root.results.page.graph.y';
				
		this.inputBase = 'root.results.data.table.columns.inputBase';
		this.inputLabel = '';
		this.inputLeft = 'root.results.data.table.columns.inputLeft';
		this.inputRight = 'root.results.data.table.columns.inputRight';
		this.inputUnit = 'root.results.data.table.columns.unit';		
	
		this.outputAxis = 'root.results.page.graph.x';	
		this.outputType = OutputType.relativeDistance;	
		this.outputBase = 'root.results.data.table.columns.outputBase';
		this.outputLeft = 'root.results.data.table.columns.outputLeft';
		this.outputRight = 'root.results.data.table.columns.outputRight';
		this.outputUnit = '';	

		this.__tablePathSelection = undefined;
		this.__outputUnitSelection = undefined;
		this.__inputSelection = undefined;
		this.__outputSelection = undefined;		

	}

	createPage(root, tornado) {
		
		let page = root.append('treez-tab')
			.label('Data');
		
		this.__createGeneralSection(page, tornado);
		this.__createInputSection(page);
		this.__createOutputSection(page);

		this.__showOrHideUnitComponents();
		this.__showOrHideTableComponents();
	}

	assignTableAsSource(table){	
	    console.warn('Not yet implemented');	
	    /*
		var columns = table.columns;
		if(columns.length>1){
			this.xData = columns[0].treePath;
			this.yData = columns[1].treePath;			
		}
		*/		
	}	

	__createGeneralSection(page, tornado) {
		
		let section = page.append('treez-section')
			.label('General');	

		tornado.createHelpAction(section, 'result/tornado/tornado.md');		
		
		let sectionContent = section.append('div');	
		
		sectionContent.append('treez-enum-combo-box')
			.label('Data mode')
			.labelWidth('95px')
			.nodeAttr('enum', DataMode)
			.onChange(()=>this.__showOrHideTableComponents())
			.bindValue(this, ()=>this.dataMode);

		sectionContent.append('treez-enum-combo-box')
			.label('Output type')
			.labelWidth('95px')
			.nodeAttr('enum', OutputType)
			.onChange(()=>this.__showOrHideUnitComponents())
			.bindValue(this, ()=>this.outputType);

		sectionContent.append('treez-enum-combo-box')
			.label('Sorting mode')
			.labelWidth('95px')
			.nodeAttr('enum', SortingMode)
			.bindValue(this, ()=>this.sortingMode);

		sectionContent.append('treez-double')
			.label('Bar fill ratio')
			.labelWidth('95px')
			.min('0')
			.max('1')
			.bindValue(this, ()=>this.barFillRatio);
		
		this.__tablePathSelection = sectionContent.append('treez-model-path')
			.label('Table')
			.nodeAttr('atomClasses',[Table])
			.bindValue(this,()=>this.tablePath);		
		
		sectionContent.append('treez-model-path')
			.label('Output axis')
			.nodeAttr('atomClasses',[Axis])
			.bindValue(this,()=>this.outputAxis);		

		this.__outputUnitSelection = sectionContent.append('treez-text-field')
			.label('Output unit')
			.bindValue(this, ()=>this.outputUnit);

		sectionContent.append('treez-model-path')
			.label('Label axis')
			.nodeAttr('atomClasses',[Axis])
			.bindValue(this,()=>this.labelAxis);

		sectionContent.append('treez-text-field')
			.label('Left legend text')
			.bindValue(this, ()=>this.leftLegendText);
		
		sectionContent.append('treez-text-field')
			.label('Right legend text')
			.bindValue(this, ()=>this.rightLegendText);			
		
	}

	__showOrHideUnitComponents(){
		if(this.__outputUnitSelection){
			if(this.outputType.name === OutputType.relativeDistance.name){
				this.__outputUnitSelection.hide();
			} else {
				this.__outputUnitSelection.show();
			}
		}
	}
	
	__showOrHideTableComponents(){

		if(this.__tablePathSelection){
			if(this.dataMode.name === DataMode.individualColumns.name){
				this.__tablePathSelection.hide();
				this.__inputSelection.show();
				this.__outputSelection.show();	
			} else {
				this.__tablePathSelection.show();
				this.__inputSelection.hide();
				this.__outputSelection.hide();
			}	
		}			
		
	}

	__createInputSection(page) {		
		
		let section = page.append('treez-section')
			.label('Input columns');

		this.__inputSelection = section;	
		
		let sectionContent = section.append('div');
		
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
		
		let section = page.append('treez-section')
			.label('Output columns');	

		this.__outputSelection = section;
		
		let sectionContent = section.append('div');
		
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
		
		let replotListener = () => tornado.updatePlot(dTreez);
		
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

	__valuesWithColumnPath(columnPath) {

		let data = [];
		if (columnPath) {
			let column = this.childFromRoot(columnPath);
			if(!column){
				throw new Error('Could not find column "' + columnPath + '"');
			}
			data = column.values;	
		}		

		if(data.length < 1){
			console.warn('Column data for column "'+ columnPath +'" is empty.')
		}
		return data;	
	}

	__valuesWithTablePath(tablePath, columnName) {

		let data = [];
		if (tablePath) {
			let table = this.childFromRoot(tablePath);
			if(!table){
				throw new Error('Could not find table "' + tablePath + '".');
			}
			let column = table.column(columnName);
			if(!column){
				throw new Error('Could not find column "' + columnName + '" in table "' + tablePath + '".');
			}

			data = column.values;	
		}		

		if(data.length<1){
			console.warn('Left data for input of tornado is empty.')
		}
		return data;	
	}


	__checkNumberOfSensitivityValues(){
		let numberOfSensitivityValues = this.__numberOfSensitivityValuesFromSensitivityProbeTable;
			if (numberOfSensitivityValues !== 2){
				let message = 'In order to be able to derive a (single) tornato chart, the number of sensitivity values has to be 2 for each input variable. However it is ' + numberOfSensitivityValues + '.';
				throw new Error(message);
			}
	}

	get inputTableAtom(){
		let table = this.childFromRoot(this.tablePath);
		if(!table){
			throw new Error('Could not find input table "' + this.tablePath + '".');
		}
		return table;
	}

	get leftBarDataString() {

		let inputLabelData = this.inputLabelData;
		let inputLeftData = this.inputLeftData;
		let outputBaseData = this.outputBaseData;
		let outputLeftData = this.outputLeftData;
		
		let dataSize = outputBaseData.length;

		let labelAxisIsOrdinal = this.labelAxisAtom.isOrdinal;

		let isRelative = this.outputType.isRelative;

		let rowList = [];
		for (let rowIndex = 0; rowIndex < dataSize; rowIndex++) {
			
			let inputLeftValue = parseFloat('' + inputLeftData[rowIndex]);			
			let outputBaseValue = parseFloat('' +outputBaseData[rowIndex]);			
			let outputLeftValue = parseFloat('' + outputLeftData[rowIndex] );

			let difference = outputBaseValue - outputLeftValue;

			let key = labelAxisIsOrdinal
				?'"' + inputLabelData[rowIndex] + '"'
				:'' + (rowIndex + 1);

			let input = inputLeftValue;

			let value;
			let size;
			if(isRelative){
				let relativeDistance = Utils.divide(difference, outputBaseValue);

				value = Utils.multiply(100,(1-relativeDistance));
				size = Utils.multiply(100,relativeDistance);
				if (relativeDistance < 0) {
					value = 100;
					size = -size;
				}

			} else {
				value = outputLeftValue;
				size = difference;
				if (difference < 0) {
					value = outputBaseValue;
					size = -difference;
				}
			}			

			let rowString = '{key:' + key + //
					', input:' + input + //
					', value:' + value + //
					', size:' + size + //
					'}';
			rowList.push(rowString);
		}
		
		return '[' + rowList.join(',') + ']';	
		
	}	

	get rightBarDataString() {
		let inputLabelData = this.inputLabelData;
		let inputRightData = this.inputRightData;
		let outputBaseData = this.outputBaseData;
		let outputRightData = this.outputRightData;
		
		let dataSize = outputBaseData.length;

		let labelAxisIsOrdinal = this.labelAxisAtom.isOrdinal;

		let isRelative = this.outputType.isRelative;

		let rowList = [];
		for (let rowIndex = 0; rowIndex < dataSize; rowIndex++) {			

			let inputRightValue = parseFloat('' + inputRightData[rowIndex]);
			let outputBaseValue = parseFloat('' + outputBaseData[rowIndex]);
			let outputRightValue = parseFloat('' + outputRightData[rowIndex]);			

			let difference = outputRightValue - outputBaseValue;

			let key = labelAxisIsOrdinal
				?'"' + inputLabelData[rowIndex] + '"'
				:'' + (rowIndex + 1);

			let input = inputRightValue;

			let value;
			let size;
			if(isRelative){
				let relativeDistance = Utils.divide(difference, outputBaseValue);

				value = 100;
				size = Utils.multiply(100,relativeDistance);
				if (relativeDistance < 0) {
					value = Utils.multiply(100,(1+relativeDistance));
					size = -size;
				}

			} else {
				
				value = outputBaseValue;
				size = difference;
				if (difference < 0) {
					value = outputRightValue;
					size = -difference;
				}

			}			

			let rowString = '{key:' + key + //
					', input:' + input + //
					',value:' + value + //
					',size:' + size + //
					'}';
			rowList.push(rowString);
		}
		return '[' + rowList.join(',') + ']';
		
	}

	get allBarData() { //used for determining min & max output data

		let rangeBaseData = this.outputBaseData;
		let rangeLeftData = this.outputLeftData;
		let rangeRightData = this.outputRightData;
		
		let dataSize = rangeBaseData.length;

		let isRelative = this.outputType.isRelative;
		
		let allData = [];
		for (let rowIndex = 0; rowIndex < dataSize; rowIndex++) {

			let base = parseFloat(rangeBaseData[rowIndex]);
			let left = parseFloat(rangeLeftData[rowIndex]);
			let right = parseFloat(rangeRightData[rowIndex]);

			if(isRelative){

				if (left != null) {
					let relativeDistance = Utils.divide(base-left,base)
					let leftInPercent = Utils.multiply(100, 1-relativeDistance);
					allData.push(leftInPercent);
				}

				if (right != null) {
					let relativeDistance = Utils.divide(right-base,base)
					let rightInPercent = Utils.multiply(100, 1+relativeDistance);
					allData.push(rightInPercent);
				}

			} else {
				if (left != null) {
					allData.push(left);
				}

				if (right != null) {
					allData.push(right);
				}
			}
			
		}

		return allData;
	}
	

	get inputLabelData() {	
		switch(this.dataMode){
			case DataMode.individualColumns:
				return this.__valuesWithColumnPath(this.inputLabel);
			case DataMode.tornadoTable:
				return this.__valuesWithTablePath(this.tablePath, 'label');
			case DataMode.sensitivityProbeTable:
				return this.__inputLabelDataFromSensitivityProbeTable
			default:
				throw new Error('Not yet implemented DataMode ' + this.dataMode);
		}		
	}

	get __inputLabelDataFromSensitivityProbeTable(){
		return this.__inputColumnHeadersFromSensitivityProbeTable;		
	}

	get __inputColumnHeadersFromSensitivityProbeTable(){
		let table = this.inputTableAtom;
		let columnHeaders = table.headers;
		return columnHeaders.slice(0, columnHeaders.length-1);
	}

	get __probeColumnHeaderFromSensitivityProbeTable(){
		let table = this.inputTableAtom;
		let columnHeaders = table.headers;
		return columnHeaders.pop();
	}

	get __numberOfSensitivityValuesFromSensitivityProbeTable(){
		let table = this.inputTableAtom;
		let inputHeaders = this.__inputColumnHeadersFromSensitivityProbeTable;
		let numberOfInputHeaders = inputHeaders.length;
		let numberOfRows = table.rows.length;

		let numberOfSensitivityRows = numberOfRows-1;
		return numberOfSensitivityRows/numberOfInputHeaders;
	}

	get inputBaseData() {
		switch(this.dataMode){
			case DataMode.individualColumns:
				return this.__valuesWithColumnPath(this.inputBase);
			case DataMode.tornadoTable:
				return this.__valuesWithTablePath(this.tablePath, 'input_base');
			case DataMode.sensitivityProbeTable:
				return this.__inputBaseDataFromSensitivityProbeTable
			default:
				throw new Error('Not yet implemented DataMode ' + this.dataMode);
		}		
	}

	get __inputBaseDataFromSensitivityProbeTable(){
		let table = this.inputTableAtom;
		let firstRow = table.rows[0];
		let inputHeaders = this.__inputColumnHeadersFromSensitivityProbeTable;
		let baseValues = inputHeaders.map((header) => firstRow.entry(header));
		
		return baseValues;
	}

	get inputLeftData() {
		switch(this.dataMode){
			case DataMode.individualColumns:
				return this.__valuesWithColumnPath(this.inputLeft);
			case DataMode.tornadoTable:
				return this.__valuesWithTablePath(this.tablePath, 'input_left');
			case DataMode.sensitivityProbeTable:
				return this.__inputLeftDataFromSensitivityProbeTable
			default:
				throw new Error('Not yet implemented DataMode ' + this.dataMode);
		}		
	}

	get __inputLeftDataFromSensitivityProbeTable(){

		this.__checkNumberOfSensitivityValues();		

		let table = this.inputTableAtom;		
		let rows = table.rows;
		
		let inputHeaders = this.__inputColumnHeadersFromSensitivityProbeTable;

		let data = [];
		let rowIndex = 1;
		for(let columnHeader of inputHeaders){
			let row = rows[rowIndex];
			let value = row.entry(columnHeader);
			data.push(value);
			rowIndex = rowIndex+2;
		}
		
		return data;
	}

	get inputRightData() {
		switch(this.dataMode){
			case DataMode.individualColumns:
				return this.__valuesWithColumnPath(this.inputRight);
			case DataMode.tornadoTable:
				return this.__valuesWithTablePath(this.tablePath, 'input_right');
			case DataMode.sensitivityProbeTable:
				return this.inputRightDataFromSensitivityProbeTable
			default:
				throw new Error('Not yet implemented DataMode ' + this.dataMode);
		}		
	}

	get inputRightDataFromSensitivityProbeTable(){

		this.__checkNumberOfSensitivityValues();		

		let table = this.inputTableAtom;		
		let rows = table.rows;
		
		let inputHeaders = this.__inputColumnHeadersFromSensitivityProbeTable;

		let data = [];
		let rowIndex = 2;
		for(let columnHeader of inputHeaders){
			let row = rows[rowIndex];
			let value = row.entry(columnHeader);
			data.push(value);
			rowIndex = rowIndex+2;
		}
		
		return data;
	}

	get outputBaseData() {
		switch(this.dataMode){
			case DataMode.individualColumns:
				return this.__valuesWithColumnPath(this.outputBase);
			case DataMode.tornadoTable:
				return this.__valuesWithTablePath(this.tablePath, 'output_base');
			case DataMode.sensitivityProbeTable:
				return this.__outputBaseDataFromSensitivityProbeTable
			default:
				throw new Error('Not yet implemented DataMode ' + this.dataMode);
		}	
	}

	get __outputBaseDataFromSensitivityProbeTable(){
		let table = this.inputTableAtom;		
		let rows = table.rows;
		let firstRow = rows[0];		
		let probeHeader = this.__probeColumnHeaderFromSensitivityProbeTable;
		let otuputBaseValue = firstRow.entry(probeHeader);

		let inputHeaders = this.__inputColumnHeadersFromSensitivityProbeTable;
		let numberOfInputHeaders = inputHeaders.length;

		let baseData = Array(numberOfInputHeaders).fill(otuputBaseValue);
		return baseData;
	}

	get outputLeftData() {
		switch(this.dataMode){
			case DataMode.individualColumns:
				return this.__valuesWithColumnPath(this.outputLeft);
			case DataMode.tornadoTable:
				return this.__valuesWithTablePath(this.tablePath, 'output_left');
			case DataMode.sensitivityProbeTable:
				return this.__outputLeftDataFromSensitivityProbeTable
			default:
				throw new Error('Not yet implemented DataMode ' + this.dataMode);
		}
	}

	get __outputLeftDataFromSensitivityProbeTable(){
		this.__checkNumberOfSensitivityValues();		

		let table = this.inputTableAtom;		
		let rows = table.rows;
		
		let probeHeader = this.__probeColumnHeaderFromSensitivityProbeTable;
		let inputHeaders = this.__inputColumnHeadersFromSensitivityProbeTable;

		let data = [];
		let rowIndex = 1;
		for(let columnHeader of inputHeaders){
			let row = rows[rowIndex];
			let value = row.entry(probeHeader);
			data.push(value);
			rowIndex = rowIndex+2;
		}
		
		return data;
	}

	get outputRightData() {
		switch(this.dataMode){
			case DataMode.individualColumns:
				return this.__valuesWithColumnPath(this.outputRight);
			case DataMode.tornadoTable:
				return this.__valuesWithTablePath(this.tablePath, 'output_right');
			case DataMode.sensitivityProbeTable:
				return this.__outputRightDataFromSensitivityProbeTable
			default:
				throw new Error('Not yet implemented DataMode ' + this.dataMode);
		}
	}

	get __outputRightDataFromSensitivityProbeTable(){
		this.__checkNumberOfSensitivityValues();		

		let table = this.inputTableAtom;		
		let rows = table.rows;
		
		let probeHeader = this.__probeColumnHeaderFromSensitivityProbeTable;
		let inputHeaders = this.__inputColumnHeadersFromSensitivityProbeTable;

		let data = [];
		let rowIndex = 2;
		for(let columnHeader of inputHeaders){
			let row = rows[rowIndex];
			let value = row.entry(probeHeader);
			data.push(value);
			rowIndex = rowIndex+2;
		}
		
		return data;
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
