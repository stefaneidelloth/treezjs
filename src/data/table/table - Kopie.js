
import ComponentAtom from './../../core/component/componentAtom.js';
import ColumnFolder from './../column/columnFolder.js';
import Column from './../column/column.js';
import TreeViewAction from './../../core/treeView/treeViewAction.js';
import AddChildAtomTreeViewAction from './../../core/treeView/addChildAtomTreeViewAction.js';
import TableSource from './tableSource.js';
import TableCodeAdaption from './tableCodeAdaption.js';
import Row from './../row/row.js';
import Treez from './../../treez.js';
import SelectionManager from './selectionManager.js';
import Xlsx from './../../core/utils/xlsx.js';
import Utils from './../../core/utils/utils.js';

import TableConnection from './tableConnection.js';

export default class Table extends ComponentAtom {

	static createFromJson(jsonString){
		//Expects json in a format that corresponds to
		//format of pandas DataFrame.to_json(), e.g.
		//'{"x":{"0":0,"1":2},"y":{"0":0,"1":1}}'
		//or
		//R dataframe format, e.g.
		//"{"x":[0,2],"y":[0,1]}"
		//Single values are also allowed, e.g. 
		//'0'.
		//
		//#If you face memory issues, this method could be improved
		//#to support a different data format, e.g. with "split" mode:
		//#df.to_json(orient="split")
		

		var table = new Table();

		var jsonResult = undefined;
		try{
			jsonResult = JSON.parse(jsonString);
		} catch(error){
			table.createColumn('value');
			table.createRow([jsonString]);
			return table;   				
		}   			
		

		if(jsonResult instanceof Object){
			var columnNames = Object.keys(jsonResult);

			columnNames.forEach(columnName=>{
				table.createColumn(columnName);
			});       

			var firstEntry = jsonResult[columnNames[0]];
            if(firstEntry instanceof Array){
            	//R dataframe format
                for(var rowIndex=0; rowIndex < firstEntry.length; rowIndex++){
                    var rowValues = [];
                    for(var columnName of columnNames){
                        var entry = jsonResult[columnName][rowIndex];
                        rowValues.push(entry);
                    }
                    table.createRow(rowValues);
                }
            } else {
            	//Python Pandas dataframe format
                var rowIndices = Object.keys(firstEntry);

                for(var rowIndex of rowIndices){
                    var rowValues = [];
                    for(var columnName of columnNames){
                        var entry = jsonResult[columnName][rowIndex];
                        rowValues.push(entry);
                    }
                    console.log(rowValues);
                    table.createRow(rowValues);
                }
            }
			
			return table;
		} else {
			table.createColumn('value');
			table.createRow([jsonResult]);
			return table;
		}  
		
	}

	constructor(name) {
		super(name);
		this.image='table.png';
		this.isExpanded=false;
		this.__rows = [];
		this.__pagedRows = undefined;
		this.__rowIndexOffset = 0;

		this.__firstRowIndex = 1;
		this.__lastRowIndex = 1;
		this.__numberOfRows = 1;

		this.__pageIndex = 1;
		this.__numberOfPages = 1;
		this.__maxNumberOfRowsPerPage = 1000;

		this.__isCaching = false;
		this.__columnSeparator = ';';
		this.__rowSeparator = '\n';

		this.__selectionManager = new SelectionManager(this);

		this.__tableSelection = undefined;
	}

	async createComponentControl(tabFolder){

		const page = tabFolder.append('treez-tab')
			.label('Table');

		const section = page.append('treez-section')
    		.label('Table');

    	this.createHelpAction(section, 'data/table/table.md');

		const sectionContent = section.append('div');

		const tableContainer = sectionContent.append('div')
		    .on('dragover', event => event.preventDefault())
		    .on('drop', event => this.handleDrop(event, this.treeView)) 
		    .on('dragenter', event => event.preventDefault())
		    .on('dragstart', event => event.preventDefault())
		    .on('paste', event => this.__handleContainerPaste(event, this.treeView))
			.className('treez-table-container'); //css styles for table are defined in src/views/propertyView.css
        

		if (this.isLinkedToSource) {
			if (!this.hasColumns) {
				await this.__reload();
			}
		}

		var columnsExist = this.columnNames.length > 0;
		if (columnsExist) {
			await this.__createTableControl(tableContainer, this.treeView);
		} else {
			this.__createEmptyTableControl(tableContainer, this.treeView);					
		}

	}

	async __handleContainerPaste(event, treeView){
		if(event.srcElement.className.includes('treez-table')){
			this.handlePaste(event, treeView);
		}		
	}

	async handleFileDrop(file, treeView){		
		var data = await Xlsx.readFile(file);
        this.__importData(data);
        treeView.refresh(); 
	}

	async handleItemsDrop(dataTransferItems, treeView){
		
		var data = [];
		for(var item of dataTransferItems){
			await new Promise((resolve,reject)=>{
				item.getAsString(text => {					
					var rows = text.split('\n');
					for(var row of rows){
						var separator = ';';
						if(!row.includes(separator)){
							separator = '\t';
						}
						var entries = row.split(separator);
						data.push(entries);
					}	
					resolve();		    
				});		
			})	
		}
        this.__importData(data);
        treeView.refresh(); 
	}

	createContextMenuActions(selection, parentSelection, treeView) {

        let actions = [];

        actions.push(new AddChildAtomTreeViewAction(
							ColumnFolder,
							'columns',
							'columnFolder.png',
							parentSelection,
							this,
							treeView
					 ));

		actions.push(new AddChildAtomTreeViewAction(
							TableSource,
							'tableSource',
							'tableSource.png',
							parentSelection,
							this,
							treeView
					 ));

        actions.push(new TreeViewAction(
							'Delete',
							'delete.png',
							this,
							treeView,
							() => this.delete(treeView)
					 ));

		return actions;
	}

	createCodeAdaption(){
		return new TableCodeAdaption(this);
	}

	createColumn(name, type) {
		this.__createColumnFolderIfNotExist();
		return this.columnFolder.createColumn(name, type);
	}

	createColumnFolder(name) {
		return this.createChild(ColumnFolder, name);
	}

	__createColumnFolderIfNotExist() {
		if(!this.columnFolder){
			this.createColumnFolder();
		}
		return this.columnFolder;
	}

	createTableSource(name) {
		return this.createChild(TableSource, name);
	}

	createColumnsFromBlueprints(columnBlueprints) {
		this.__createColumnFolderIfNotExist()
		var columnFolder = this.columnFolder;
		for (var columnBlueprint of columnBlueprints) {
			columnFolder.createColumnWithBlueprint(columnBlueprint);
		}
	}

	deleteColumnsIfExist() {
		this.removeChildrenByClass(ColumnFolder);
	}

	addColumn(newColumn) {
		this.__createColumnsIfNotExist();
		var columns = this.getColumns();
		columns.addChild(newColumn);
	}


	deleteAllRows() {
		this.__rows = [];
		return this;
	}

	checkHeaders(expectedHeaders) {
		try {
			return this.columnFolder.checkHeaders(expectedHeaders);
		} catch (error) {
			return false;
		}
	}

	addRow(row) {
		this.__rows.push(row);
		return this;
	}

	addEmptyRow() {
		this.__rows.push(new Row(this));
		return this;
	}

	createRow(dataArray) {
		var row = new Row(this);

		var columnNames = this.columnNames;

		for (var columnIndex = 0; columnIndex < columnNames.length; columnIndex++) {
			var columnName = columnNames[columnIndex];
			var value = dataArray[columnIndex];
			row.setEntryUnchecked(columnName, value);
		}
		this.addRow(row);
		return row;
	}

	

	addRows(dataMatrix) {
		for (var rowIndex = 0; rowIndex < dataMatrix.length; rowIndex++) {
			this.createRow(dataMatrix[rowIndex]);
		}
		return this;
	}

	__resetCache() {
		this.__isCaching = false;
	}

	toString() {

		var allDataString = '';

		var columnNames = this.columnNames;
		var numberOfColumns = columnNames.length;

		for (var row of this.__rows) {
			for (var columnIndex = 0; columnIndex < numberOfColumns - 1; columnIndex++) {
				var columnName = columnNames[columnIndex];
				var entry = row.entryAsString(columnName);
				allDataString = allDataString + entry + this.columnSeparator;
			}

			var lastColumnName = columnNames[numberOfColumns - 1];
			var lastEntry = row.entryAsString(lastColumnName);
			allDataString = allDataString + lastEntry + this.rowSeparator;
		}
		return allDataString;
	}

	async __createTableControl(parent, treeView){

		this.__createToolbar(parent, treeView);

		const tableContent = parent.append('div')
			.className('treez-table-content');
		await this.__createTableView(tableContent, treeView);

		this.__createPagination(parent, treeView);

	}

	__createEmptyTableControl(parent, treeView){
		this.__createToolbarForEmptyTable(parent, treeView);
		parent.append('div')
		    .text('This table does not contain any column yet.');
	}

	__createToolbar(parent, treeView){

		var fileToolbar = parent.append('div')
							.className('treez-table-toolbar');

		this.__createOpenButton(fileToolbar, treeView);
		this.__createSaveButton(fileToolbar, treeView);
		this.__createUploadButton(fileToolbar, treeView);
		this.__createDownloadButton(fileToolbar, treeView);

		var toolbar = parent.append('div')
							.className('treez-table-toolbar');

		this.__createAddButton(toolbar, treeView);
		this.__createDeleteButton(toolbar, treeView);
		this.__createUpButton(toolbar, treeView);
		this.__createDownButton(toolbar, treeView);
		//this.__createColumnWidthButton(toolbar, treeView);
	}

	__createToolbarForEmptyTable(parent, treeView){
		var fileToolbar = parent.append('div')
							.className('treez-table-toolbar');

		this.__createOpenButton(fileToolbar, treeView);		
		this.__createUploadButton(fileToolbar, treeView);
	}

	async __createTableView(parent, treeView){

		var tableSelection = parent.append('table')
									.className('treez-table');

		this.__tableSelection = tableSelection;

		var displayColumns = [{header:'&emsp;'}].concat(this.columns);

		tableSelection.append('thead')
			.append('tr')
	        .selectAll('th')
	        .data(displayColumns).enter()
			.append('th')			
			.onClick((event, value)=> this.__selectionManager.headerClicked(event, value))
			.onMouseDown((event, value) => this.__selectionManager.headerMouseDown(event, value))
	        .onMouseUp((event, value) => this.__selectionManager.headerMouseUp(event, value))
	        .onMouseOver((event, value) => this.__selectionManager.headerMouseOver(event, value))
	        .on('dragenter', event => event.preventDefault())
	        .on('dragstart', event => event.preventDefault())
			.append('div')
	        .html((column)=>{
	        	return column.header;
			})
			.title((column)=>{
	        	return column.legend;
			});

	    await this.__recreateTableBody();

	}

	async __recreateTableBody(){

		this.__tableSelection
			.selectAll('tbody')
			.remove();

		var pagedRows = await this.pagedRows();

		this.__tableSelection.append('tbody')
	        .selectAll('tr')
	        .data(pagedRows).enter()
	        .append('tr')
	        .onClick((event, value) => this.__selectionManager.rowClicked(event, value))
	        .selectAll('td')
	        .data(function(row, index) {
	        	var displayRow = [index+1].concat(row.values);
	        	return displayRow;
	        })
	        .enter()
	        .append('td')
	        .append('div')
	        .attr('contenteditable',true)
	        .html((cellValue)=>{
	        	return cellValue;
	        })
	        .onInput((event, value) => this.__cellInput(event, value))
	        .onClick((event, value) => this.__selectionManager.cellClicked(event, value))
	        .onMouseDown((event, value) => this.__selectionManager.cellMouseDown(event, value))
	        .onMouseUp((event, value) => this.__selectionManager.cellMouseUp(event, value))
	        .onMouseOver((event, value) => this.__selectionManager.cellMouseOver(event, value));
	}

	__cellInput(event, value){		

		var contentDiv = event.srcElement;

		var value = contentDiv.innerText;

		var td = contentDiv.parentNode;
		var oneBasedColumnIndex = td.cellIndex;
		
		var tr = td.parentNode;
		var oneBasedRowIndex = tr.rowIndex;

		this.__cellValueChanged(oneBasedRowIndex-1, oneBasedColumnIndex-1, value);
	}

	__cellValueChanged(rowIndex, columnIndex, value){
		let row = this.row(rowIndex);
		let columnName = this.columnNames[columnIndex];
		row.setEntry(columnName, value);
	}

	__createPagination(parent, treeView){
		var pagination = parent.append('div')
								.className('treez-table-pagination');

		pagination.append('treez-text-field')
			.label('Rows per page')
			.contentWidth('40px')
			.attr('inline','')
			.bindValue(this, ()=>this.__maxNumberOfRowsPerPage);


		var rowInfo = pagination.append('span')
			.className('treez-table-pagination-row-info');

		rowInfo.append('span')
			.text('Rows ')

		rowInfo.append('treez-text-label')
			.bindValue(this, ()=>this.__firstRowIndex);

		rowInfo.append('span')
			.text('...')

		rowInfo.append('treez-text-label')
			.bindValue(this, ()=>this.__lastRowIndex);

		rowInfo.append('span')
			.text(' of ')

		rowInfo.append('treez-text-label')
			.bindValue(this, ()=>this.__numberOfRows);

		var pageControl = pagination.append('span')
			.className('treez-table-pagination-page-info');

		pageControl.append('span')
			.html('&nbsp;&nbsp;&nbsp;Page&nbsp;')

		pageControl.append('input')
			.attr('type','button')
			.className('treez-table-first-button')
			.title('First')
			.onClick(()=>this.__firstPage());

		pageControl.append('input')
			.attr('type','button')
			.className('treez-table-previous-button')
			.title('Previous')
			.onClick(()=>this.__previousPage());

		pageControl.append('treez-text-field')
			.contentWidth('40px')
			.attr('inline','')
			.bindValue(this, ()=>this.__pageIndex);

		pageControl.append('input')
			.attr('type','button')
			.className('treez-table-next-button')
			.title('Next')
			.onClick(()=>this.__nextPage());

		pageControl.append('input')
			.attr('type','button')
			.className('treez-table-last-button')
			.title('Last')
			.onClick(()=>this.__lastPage());

		pageControl.append('span')
			.text(' of ')

		pageControl.append('treez-text-label')
			.bindValue(this, ()=>this.__numberOfPages);


	}

	__firstPage(){

	}

	__previousPage(){

	}

	__nextPage(){

	}

	__lastPage(){

	}

	__createAddButton(toolbar, treeView){
		toolbar.append('input')
			.attr('type','button')
			.className('treez-table-add-button')
			.title('Add')
			.onClick(()=>this.__addRow());
	}

	__createDeleteButton(toolbar, treeView){
		toolbar.append('input')
			.attr('type','button')
			.className('treez-table-delete-button')
			.title('Delete')
			.onClick(()=>this.__deleteRow());
	}

	__createUpButton(toolbar, treeView){
		toolbar.append('input')
			.attr('type','button')
			.className('treez-table-up-button')
			.title('Move up')
			.onClick(()=>this.__moveRowUp());
	}

	__createDownButton(toolbar, treeView){
		toolbar.append('input')
			.attr('type','button')
			.className('treez-table-down-button')
			.title('Move down')
			.onClick(()=>this.__moveRowDown());
	}

	__createColumnWidthButton(toolbar, treeView){
		toolbar.append('input')
			.attr('type','button')
			.className('treez-table-width-button')
			.title('Optimize column width')
			.onClick(()=>this.__optimizeColumnWidth());
	}

    __createOpenButton(toolbar, treeView){
        toolbar.append('input')
			.attr('type','button')
			.className('treez-table-open-button')
			.title('Open')
			.onClick(()=>this.__open(treeView));
    }

	__createSaveButton(toolbar, treeView){
        toolbar.append('input')
			.attr('type','button')
			.className('treez-table-save-button')
			.title('Save')
			.onClick(()=>this.__save());
    }
    
	__createUploadButton(toolbar, treeView){
        toolbar.append('input')
			.attr('type','button')
			.className('treez-table-upload-button')
			.title('Upload')
			.onClick(()=>this.__upload(treeView));
    }
    
	__createDownloadButton(toolbar, treeView){
        toolbar.append('input')
			.attr('type','button')
			.className('treez-table-download-button')
			.title('Download')
			.onClick(()=>this.__download());
    }

    __open(treeView){
        window.treezTerminal.browseFile()
	     .then(async (file)=>{
		    if(file){	
	           var data = await Xlsx.readFile(file);
               this.__importData(data);	
               treeView.refresh();   
		    }  
	  }); 
    }

    __save(){
    	window.treezTerminal.inputDialog('export.csv','Save as...')
    	    .then(async (filePath) => {
    	    	if(filePath){
    	    	    var blob = await Xlsx.createBlob(filePath, this.data);
    	    	    window.treezTerminal.saveBlob(filePath, blob);
    	    	}
    	});
    }   

    __upload(treeView){
    	const element = document.createElement('input');
		element.type = 'file';
		element.onchange = async (event) => {
			var file = event.srcElement.files[0];
			document.body.removeChild(element);
			if(file){
				var data = await Xlsx.readFile(file);
                this.__importData(data);
                treeView.refresh();   
			}			
		};
		document.body.appendChild(element);		
		element.click(); 
    }

    __download(){
    	window.treezTerminal.inputDialog('export.csv','File name:')
    	    .then(async (filePath) => {
    	    	if(filePath){
    	    	    Xlsx.downloadFile(filePath, this.data);
    	    	}
    	});    	    	
    }    

    __importData(data){
    	this.clear();
    	var firstRow = data.shift();
    	if(firstRow){
    		var isHeaderRow = this.__isHeaderRow(firstRow);
			if(isHeaderRow){
				this.__createColumnsFromHeaders(firstRow);
			} else {
				this.__createColumnsByNumber(firstRow.length);
				this.createRow(firstRow);
			}
			for(var row of data){
				this.createRow(row);
			}
    	}
    	
    }

    __isHeaderRow(rowData){
    	for(var value of rowData){
    		if (!Utils.isString(value)){
    			return false;
    		}
    	}
    	return true;
    }

    __createColumnsFromHeaders(headers){
        for(var header of headers){
        	var columnName = header.replace(/ /g,'').trim();
        	columnName = Utils.firstToLowerCase(columnName);
        	var column = this.createColumn(columnName);
        	column.legend = header;
        }
    }

    __createColumnsByNumber(numberOfColumns){
        for(var index=0; index<numberOfColumns;index++){        	
        	var columnName =  Utils.numberToLetters(index);     	
        	this.createColumn(columnName);        	
        }
    }

    clear(){
    	this.__rows = [];
    	var columnFolder = this.childByClass(ColumnFolder);
    	if(columnFolder){
    		columnFolder.clear();
    	}    	
    }

	__addRow(){
		var rowIndices = this.__selectionManager.highlightedRowIndices;
		if(rowIndices.length < 1){
			this.addEmptyRow();
		} else {
			var rowIndex = rowIndices[0];
			var selectedRow = this.__rows[rowIndex];
			this.createRow(selectedRow.values);
		}

		this.__recreateTableBody();

	}

	__deleteRow(){
		var rowIndices = this.__selectionManager.highlightedRowIndices;
		if(rowIndices.length < 1){
			alert('Please select a row to be deleted before using the Delete action.');
			return;
		} else {
			var rowIndex = rowIndices[0];
			this.__rows.splice(rowIndex,1);
			this.__selectionManager.resetSelectionAndHighlighting();
		}

		this.__recreateTableBody();
	}

	__moveRowUp(){
		var rowIndices = this.__selectionManager.highlightedRowIndices;
		if(rowIndices.length < 1){
			alert('Please select a row to be moved up before using the Move up action.');
			return;
		} else {
			var rowIndex = rowIndices[0];
			var tempRow = this.__rows[rowIndex];
			if(rowIndex > 0){
				this.__rows[rowIndex] = this.__rows[rowIndex-1];
				this.__rows[rowIndex-1] = tempRow;
				this.__selectionManager.resetSelectionAndHighlighting();
				this.__selectionManager.highlightRow(rowIndex-1);
			} else {
				this.__rows.splice(0, 1);
				this.__rows.push(tempRow);
				this.__selectionManager.resetSelectionAndHighlighting();
				this.__selectionManager.highlightRow(this.__rows.length-1);
			}

		}

		this.__recreateTableBody();
	}

	__moveRowDown(){
		var rowIndices = this.__selectionManager.highlightedRowIndices;
		if(rowIndices.length < 1){
			alert('Please select a row to be moved down before using the Move down action.');
			return;
		} else {
			var rowIndex = rowIndices[0];
			var tempRow = this.__rows[rowIndex];
			var lastIndex = this.__rows.length -1;
			if(rowIndex < lastIndex){
				this.__rows[rowIndex] = this.__rows[rowIndex+1];
				this.__rows[rowIndex+1] = tempRow;
				this.__selectionManager.resetSelectionAndHighlighting();
				this.__selectionManager.highlightRow(rowIndex+1);
			} else {
				this.__rows.pop();
				this.__rows.splice(0,0,tempRow);
				this.__selectionManager.resetSelectionAndHighlighting();
				this.__selectionManager.highlightRow(0);
			}

		}

		this.__recreateTableBody();
	}

	__optimizeColumnWidth(){

	}


	async __reload() {
		this.__resetCache();
		await this.__loadTableStructureIfLinkedToSource();		
	}

	async __loadTableStructureIfLinkedToSource() {
		if (this.isLinkedToSource) {
			await TableConnection.loadTableStructureFromSource(this, this.tableSource);
		}
	}	

	column(name){
		return this.columnFolder.column(name);
	}

	columnType(columnName) {
		if (this.isLinkedToSource) {
			return DatabasePageResultLoader.columnType(this.tableSource, columnName);
		} else {
			return this.columnFolder.type(columnName);
		}
	}

	columnDataClass(columnName) {
		var columnType = this.columnType(columnName);
		return columnType.getAssociatedClass();
	}

	columnLegend(columnHeader) {
		return this.columnFolder.columnLegend(columHeader);
	}

	async row(rowIndex) {

		if (this.isLinkedToSource) {			
			return await TableConnection.readRowFromTableSource(this.tableSource, rowIndex);
		} else {
			return this.__rows[rowIndex];
		}
	}

	setColumnValues(columnName, columnData) {

		var associatedClass = this.columnType(columnName).getAssociatedClass();


		for (var rowIndex = 0; rowIndex < columnData.length; rowIndex++) {
			var value = columnData[rowIndex];

			if (rowIndex >= this.__rows.length) {
				this.addEmptyRow();
			}

			var currentRow = this.__rows[rowIndex];

			currentRow.setEntry(columnName, value);
		}
		return this;
	}

	getColumnValues(columnName){
		return this.__rows.map(row=>row.entry(columnName));
	}

	isEditable(columnName) {
		return true;
	}

	async pagedRows() {
		if (this.__pagedRows) {
			return this.__pagedRows;
		} else {
			return await this.rows();
		}
	}

	setPagedRows(pagedRows) {
		this.__pagedRows = pagedRows;
		return this;
	}

	get rows() { //todo paged vs cached vs total rows
		if (this.isLinkedToSource) {			
			return await TableConnection.readRowsFromTableSource(this, this.tableSource);
		} else {
			return this.__rows;
		}		
	}

	setRows(rows) {
		this.__rows = rows;
		return this;
	}



	//#end region


	//#region ACCESSORS

	get headers() {
		try{
			return this.columnFolder.headers;
		} catch (error){
			return [];
		}
	}


	get columnNames() {
		try{
			return this.columnFolder.names;
		} catch (error){
			return [];
		}
	}

	get columnFolder() {

		try {
			return this.childByClass(ColumnFolder);
		} catch (error) {

			if (this.isLinkedToSource) {
				this.__reload();
				try {
					return this.childByClass(ColumnFolder);
				} catch (error) {
					return null;
				}
			}
			return null;
		}
	}

	get data(){
		var data = [this.headers];
		var rows = this.rows;
		for(var row of rows){
            data.push(row.values);
		}
		return data;
	}	

	get rowIndexOffset() {
		return this.__rowIndexOffset;
	}


	set rowIndexOffset(rowIndexOffset) {
		this.__rowIndexOffset = rowIndexOffset;
		return this;
	}

	get rowSeparator() {
		return this.__rowSeparator;
	}

	get columnSeparator() {
		return this.__columnSeparator;
	}

	get isCaching() {
		return this.__isCaching;
	}

	set isCaching(isCaching) {
		this.__isCaching = isCaching;
	}


	get isLinkedToSource() {
		return this.tableSource
			?true
			:false;
	}

	get hasColumns(){
		try {
			return this.columnFolder.hasColumns;
		} catch (error) {
			return false;
		}
	}

	get columns(){
		try {
			return this.columnFolder.columns;
		} catch (error) {
			return [];
		}
	}

	get numberOfColumns() {
		try {
			return this.columnFolder.numberOfColumns;
		} catch (error) {
			return 0;
		}
	}

	get tableSelection(){
		return this.__tableSelection;
	}

	get tableSource(){
		return this.childByClass(TableSource);
	}

	get dTreez(){
		return this.__treeView.dTreez;
	}

}
