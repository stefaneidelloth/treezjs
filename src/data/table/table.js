
import ComponentAtom from './../../core/component/componentAtom.js';
import ColumnFolder from './../column/columnFolder.js';
import TreeViewAction from './../../core/treeview/treeViewAction.js';
import AddChildAtomTreeViewAction from './../../core/treeview/addChildAtomTreeViewAction.js';
import TableSource from './tableSource.js';
import Row from './../row/row.js';

export default class Table extends ComponentAtom {
	
	constructor(name) {	
		super(name);
		this.image='table.png';	
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
		this.__COLUMN_SEPARATOR = ';';
		this.__ROW_SEPARATOR = '\n';
	}

	copy() {
		//TODO
	}
	
	createControlAdaption(parent, treeView) {

		const self = this;
		self.__treeView = treeView;		
		
		parent.selectAll('div').remove();
		parent.selectAll('treez-tab-folder').remove();	

		const tableContainer = parent.append('div')
			.className('treez-table-container'); //css styles for table are defined in src/views/propertyView.css
		
		
		if (this.isLinkedToSource) {
			if (!this.hasColumns) {
				this.reload();
			}
		}		
		
		var columnsExist = this.headers.length > 0;
		if (columnsExist) {
			this.__createTableControl(tableContainer, treeView);			
		} else {
			tableContainer.text('This table does not contain any column yet.');			
		} 		
	}		

	createContextMenuActions(parentSelection, treeView) {

        let actions = [];

        actions.push(new AddChildAtomTreeViewAction(
							ColumnFolder,
							'columns',
							'columns.png',
							parentSelection,
							this,
							treeView
					 ));	
        
        actions.push(new TreeViewAction(				
							'Delete',
							'delete.png',
							treeView,
							() => this.delete(treeView)
					 ));      

		return actions;
	}	
	
	createColumn(header, type) {
		this.__initializeColumns();
		this.getColumns().createColumn(header, type);
	}

	createColumnFolder(name) {
		return this.createChild(ColumnFolder, name);
	}

	createTableSource(name) {
		return this.createChild(TableSource, name);		
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
			return this.getColumns().checkHeaders(expectedHeaders);
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

		var headers = this.headers;		

		for (var columnIndex = 0; columnIndex < headers.length; columnIndex++) {
			var header = headers[columnIndex];
			var value = dataArray[columnIndex];
			row.setEntryUnchecked(header, value);
		}
		this.addRow(row);
		return row;
	}

	addRows(dataMatrix) {
		for (var rowIndex = 0; rowIndex < dataMatrix.length; rowIndex++) {
			this.creatRow(dataMatrix[rowIndex]);
		}
		return this;
	}
	
	resetCache() {
		this.__isCaching = false;
	}	
	
	toString() {

		var allDataString = '';
		
		var headers = this.getHeaders();
		var numberOfColumns = headers.length;

		for (var row of this.__rows) {			
			for (var columnIndex = 0; columnIndex < numberOfColumns - 1; columnIndex++) {
				var header = headers[columnIndex];
				var entry = row.getEntryAsString(header);
				allDataString = allDataString + entry + COLUMN_SEPARATOR;
			}
			
			var lastHeader = headers[numberOfColumns - 1];
			var lastEntry = row.getEntryAsString(header);
			allDataString = allDataString + lastEntry + ROW_SEPARATOR;
		}
		return allDataString;
	}
	
	__createTableControl(parent, treeView){
		
		this.__createToolbar(parent, treeView);
		this.__createTableView(parent, treeView);
		this.__createPagination(parent, treeView);
		
	}	
	
	__createToolbar(parent, treeView){
		
		var toolbar = parent.append('div')
							.className('treez-table-toolbar');		
		
		this.__createAddButton(toolbar, treeView);

		this.__createDeleteButton(toolbar, treeView);

		this.__createUpButton(toolbar, treeView);

		this.__createDownButton(toolbar, treeView);

		this.__createColumnWidthButton(toolbar, treeView);
	}
	
	__createTableView(parent, treeView){
		
		var tableSelection = parent.append('table')
									.className('treez-table');
		
		var displayColumns = [{header:'&nbsp;'}].concat(this.columns);
				
		tableSelection.append('thead')			
			.append('tr')
	        .selectAll('th')
	        .data(displayColumns).enter()
	        .append('th')	       
	        .html((column)=>{	        	
	        	return column.header;
	        });
		
		var headers = this.headers;
	   
	    tableSelection.append('tbody')
	        .selectAll('tr')
	        .data(this.pagedRows).enter()
	        .append('tr')	       
	        .selectAll('td')
	        .data(function(row, index) {
	        	var displayRow = [index+1].concat(row.values);
	        	return displayRow;	        		            	            
	        })
	        .enter()
	        .append('td')	       
	        .html((cellValue)=>{	        	
	        	return cellValue;
	        })	       
		
	}
	
	__createPagination(parent, treeView){
		var pagination = parent.append('div')
								.className('treez-table-pagination');
		
		pagination.append('span')
			.text('Rows ')
			
		pagination.append('treez-text-label')
			.bindValue(this, ()=>this.__firstRowIndex);
		
		pagination.append('span')
			.text('...')
			
		pagination.append('treez-text-label')
			.bindValue(this, ()=>this.__lastRowIndex);
		
		pagination.append('span')
		.text(' of ')
		
		pagination.append('treez-text-label')
			.bindValue(this, ()=>this.__numberOfRows);
		
		pagination.append('span')
		.text('   Page ')
		
		pagination.append('input')
			.attr('type','button')
			.className('treez-table-first-button')
			.title('First')
			.onClick(()=>this.__firstPage());
		
		pagination.append('input')
			.attr('type','button')
			.className('treez-table-previous-button')
			.title('Previous')
			.onClick(()=>this.__previousPage());
		
		pagination.append('treez-text-field')
			.attr('width', '40px')
			.bindValue(this, ()=>this.__pageIndex);
		
		pagination.append('input')
			.attr('type','button')
			.className('treez-table-next-button')
			.title('First')
			.onClick(()=>this.__nextPage());
	
		pagination.append('input')
			.attr('type','button')
			.className('treez-table-last-button')
			.title('Previous')
			.onClick(()=>this.__lastPage());
		
		pagination.append('span')
		.text(' of ')
		
		pagination.append('treez-text-label')
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
	
	
	
	
	
	__addRow(){
		
	}
	
	__deleteRow(){
		
	}
	
	__moveRowUp(){
		
	}
	
	__moveRowDown(){
		
	}
	
	__optimizeColumnWidth(){
		
	}
	
	
	__createColumnFolderIfNotExist() {
		if(!this.getColumnFolder()){
			this.createColumnFolder();
		}		
	}

	__reload() {
		this.__resetCache();
		this.__loadTableStructureIfLinkedToSource();
		this.__refresh();
	}

	__loadTableStructureIfLinkedToSource() {
		if (this.isLinkedToSource) {
			this.__loadTableStructureFromSource();
		}
	}

	__loadTableStructureFromSource() {
		var tableSource = this.getTableSource();
		var sourceType = tableSource.type;

		switch(sourceType){
			case TableSourceType.sqLite:
				this.__deleteColumnsIfExist();
				var tableStructure = this.__readTableStructureForSqLiteTable(tableSource);
				this.__createColumns(tableStructure);
				break;
			case TableSourceType.mySql:
				this.deleteColumnsIfExist();
				var tableStructure = this.__readTableStructureForMySqlTable(tableSource);
				this.__createColumns(tableStructure);
				break;
			default:
				throw new Error('Not yet implemented for source type ' + sourceType);
		}		

	}

	__deleteColumnsIfExist() {
		removeChildrenByClass(Columns);		
	}

	__readTableStructureForSqLiteTable(tableSource) {
		var sqLiteFilePath = tableSource.filePath;
		var password = tableSource.password;

		var isUsingCustomQuery = tableSource.isUsingCustomQuery;
		if (isUsingCustomQuery) {
			var customQuery = tableSource.customQuery;
			var jobId = tableSource.jobId;
			var tableStructure = SqLiteImporter.readTableStructureWithCustomQuery(sqLiteFilePath, password, customQuery, jobId);
			return tableStructure;
		} else {
			var tableName = tableSource.tableName;
			var tableStructure = SqLiteImporter.readTableStructure(sqLiteFilePath, password, tableName);
			return tableStructure;
		}

	}

	__readTableStructureForMySqlTable(tableSource) {
		var host = tableSource.host;
		var port = tableSource.port;
		var schema = tableSource.schema;
		var url = host + ":" + port + "/" + schema;

		var user = tableSource.user;
		var password = tableSource.password;

		var isUsingCustomQuery = tableSource.isUsingCustomQuery;
		if (isUsingCustomQuery) {			
			return  MySqlImporter.readTableStructureWithCustomQuery(url, user, password, tableSource.customQuery, tableSource.jobId);			
		} else {			
			return  MySqlImporter.readTableStructure(url, user, password, tableSource.tableName);			
		}
	}

	__createColumns(columnBlueprints) {
		var columns = this.createColumns('columns');
		for (var columnBlueprint of columnBlueprints) {
			columns.createColumn(columnBlueprint);
		}
	}

	__readRowFromTableSource(tableSource, rowIndex) {		
		switch(tableSource.type){
			case TableSourceType.SQLITE:
				return this.__readRowFromSqLiteTable(tableSource, rowIndex);
				break;
			case TableSourceType.MYSQL:
				return this.__readRowFromMySqlTable(tableSource, rowIndex);
				break;
			default:
				throw new Error('not yet implemented for source type ' + tableSource.type);			
		};		
	}

	__readRowFromSqLiteTable(tableSource, rowIndex) {
		var sqLiteFilePath = tableSource.filePath;

		var password = tableSource.password;
		var jobId = tableSource.jobId;

		var isUsingCustomQuery = tableSource.isUsingCustomQuery;
		if (isUsingCustomQuery) {
			var customQuery = tableSource.customQuery;
			return SqLiteImporter.readRowWithCustomQuery(sqLiteFilePath, password, customQuery, jobId, rowIndex, this);			
		} else {
			return SqLiteImporter.readRow(sqLiteFilePath, password, tableSource.tableName, tableSource.isFilteringForJob, jobId, rowIndex, this);			
		}
	}

	__readRowFromMySqlTable(tableSource, rowIndex) {
		var host = tableSource.host;
		var port = tableSource.port;
		var schema = tableSource.schema;
		var url = host + ":" + port + "/" + schema;

		var user = tableSource.user;
		var password = tableSource.password;

		var jobId = tableSource.jobId;

		var isUsingCustomQuery = tableSource.isUsingCustomQuery;
		if (isUsingCustomQuery) {
			var customQuery = tableSource.customQuery;
			return MySqlImporter.readRowWithCustomQuery(url, user, password, customQuery, jobId, rowIndex, this);
			
		} else {			
			return MySqlImporter.readRow(url, user, password, tableSource.tableName, tableSource.isFilteringForJob, jobId, rowIndex, this);			
		}
	}
	
	//#end region
	
	
	//#region ACCESSORS	

	get headers() {
		return this.columnFolder.headers;
	}

	get columnFolder() {

		try {
			return this.getChildByClass(ColumnFolder);			
		} catch (error) {

			if (this.isLinkedToSource) {
				this.reload();
				try {
					return this.getChildByClass(ColumnFolder);					
				} catch (error) {
					throw new Error('Could not get colunFolder of table "' + this.name + '"');
				}
			}
			throw new Error('Could not get columnFolder of table "' + this.name + '"');
		}
	}	

	columnType(columnHeader) {
		if (this.isLinkedToSource) {			
			return DatabasePageResultLoader.getColumnType(this.tableSource, columnHeader);
		} else {
			return this.columnFolder.columnType(columnHeader);			
		}
	}

	columnLegend(columnHeader) {
		return this.columnFolder.columnLegend(columHeader);
	}	

	row(rowIndex) {

		if (this.isLinkedToSource) {
			var tableSource = this.getTableSource();
			return this.__readRowFromTableSource(tableSource, rowIndex);
		} else {
			return this.getRows().get(rowIndex);
		}
	}	

	setColumn(header, columnData) {

		var associatedClass = this.columnType(header).getAssociatedClass();

		
		for (var rowIndex = 0; rowIndex < columnData.length; rowIndex++) {
			var value = columnData[rowIndex];
						
			if (rowIndex >= this.__rows.length) {				
				this.addEmptyRow();
			} 
			
			var currentRow = this.__rows[rowIndex];
						
			currentRow.setEntry(header, value);
		}
		return this;
	}	

	get rows() {		
		return this.__rows;
	}

	set rows(rows) {
		this.__rows = rows;
		return this;
	}

	get pagedRows() {
		if (this.__pagedRows) {
			return this.__pagedRows;
		} else {
			return this.__rows;
		}
	}

	set pagedRows(pagedRows) {
		this.__pagedRows = pagedRows;
		return this;
	}

	get rowIndexOffset() {
		return this.__rowIndexOffset;
	}

	isEditable(header) {
		return true;
	}

	getColumnDataClass(columnHeader) {
		var columnType = this.getColumnType(columnHeader);
		return columnType.getAssociatedClass();		
	}

	set rowIndexOffset(rowIndexOffset) {
		this.__rowIndexOffset = rowIndexOffset;
		return this;
	}

	get rowSeparator() {
		return this.__ROW_SEPARATOR;
	}

	get columnSeparator() {
		return this.__COLUMN_SEPARATOR;
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
			return this.columnFolder.hasColumns();
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
	
}
