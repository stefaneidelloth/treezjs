

export default class SelectionManager {

	constructor(table, dTreez){
		this.__table = table;

		this.__isSelecting = false;
		this.__ctrlIsPressed = false;
		this.__startRowIndex = undefined;
		this.__startCellIndex = undefined;
		this.__startHeaderIndex = undefined;

		this.__selectedCells = [];
		this.__highlightedColumns = [];
		this.__highlightedRows = [];
	}

	cellClicked(event, value){
		this.__isSelecting = true;
		this.__updateCtrlState(event);
		
		if(!this.__ctrlIsPressed){
			this.resetSelectionAndHighlighting();
		}

		var cell = event.srcElement.parentNode;	
			
		var cellIndex = cell.cellIndex;

		this.__selectCell(cell);
		this.__highlightColumn(cellIndex);	
	}

	cellMouseDown(event, value){
        this.__isSelecting = true;
		this.__updateCtrlState(event);

		var cell = event.srcElement.parentNode;		
		this.__startCellIndex = cell.cellIndex;

		var row = cell.parentNode;
		this.__startRowIndex = row.rowIndex-1;
	}

	cellMouseUp(event, value){
		this.__isSelecting = false;
		this.__updateCtrlState(event);
		this.__startRowIndex = undefined;
		this.__startCellIndex = undefined;
	}

	cellMouseOver(event, value){
		if(!this.__isSelecting){
			return;
		}

		this.resetSelectionAndHighlighting();

		var currentCell = event.srcElement.parentNode;	
		var currentRow = currentCell.parentNode;
		var table = currentRow.parentNode;
		    
		var currentCellIndex = currentCell.cellIndex;
		var currentRowIndex = currentRow.rowIndex-1;

		var rowStart = this.__startRowIndex;
		var rowEnd = currentRowIndex;
		if (currentRowIndex < this.__startRowIndex) {
			rowStart = currentRowIndex;
			rowEnd = this.__startRowIndex;
		} 

		var cellStart = this.__startCellIndex;
		var cellEnd = currentCellIndex;
		if (currentCellIndex < this.__startCellIndex) {
			cellStart = currentCellIndex;
			cellEnd = this.__startCellIndex;
		}   

		if(cellEnd===0){
			cellEnd = currentRow.childNodes.length-1;
		}    

		for (var rowIndex = rowStart; rowIndex <= rowEnd; rowIndex++) {	
		    var row = table.childNodes[rowIndex];
		    this.highlightRow(rowIndex);		
			for (var cellIndex = cellStart; cellIndex <= cellEnd; cellIndex++) {
				this.__highlightColumn(cellIndex);
				var cell = row.childNodes[cellIndex];
				this.__selectCell(cell);
			}        
		}

	}

	headerClicked(event, value){
		this.resetSelectionAndHighlighting();
		var th = event.srcElement.parentNode;
		var tr = th.parentNode;
		var thead = tr.parentNode;
		var table = thead.parentNode;

		var cellIndex = th.cellIndex;
		this.__highlightColumn(cellIndex);
		this.__selectColumn(cellIndex, table);
	}

	headerMouseDown(event, value){
        this.__isSelecting = true;
		this.__updateCtrlState(event);

		var header = event.srcElement.parentNode;		
		this.__startHeaderIndex = header.cellIndex;		
	}

	headerMouseUp(event, value){
		this.__isSelecting = false;
		this.__updateCtrlState(event);	
		this.__startHeaderIndex = undefined;
	}

	headerMouseOver(event, value){
		if(!this.__isSelecting){
			return;
		}

		this.resetSelectionAndHighlighting();

		var source = event.srcElement;
	    var th = source;
	    if(th.constructor.name !== 'HTMLTableCellElement'){
	    	th = source.parentNode;
	    }
       
		var tr = th.parentNode;	
		var thead = tr.parentNode;
		var table = thead.parentNode;
		    
		var currentCellIndex = th.cellIndex;		
		
		var cellStart = this.__startHeaderIndex;
		var cellEnd = currentCellIndex;
		if (currentCellIndex < cellStart) {
			cellStart = currentCellIndex;
			cellEnd = this.__startHeaderIndex;
		}       

				
		for (var cellIndex = cellStart; cellIndex <= cellEnd; cellIndex++) {
			this.__highlightColumn(cellIndex);
			this.__selectColumn(cellIndex, table);			
		}  

	}

	rowClicked(event, row){
		this.__isSelecting=false;
		this.highlightRow(row.index);
		var td =  event.srcElement.parentNode;
		if(td.cellIndex === 0){
			var tr = td.parentNode;		
		    this.__selectRow(tr);
		}	
		
	}

	

	__selectRow(rowElement){
		var numberOfColumns = rowElement.childNodes.length;
		for (var cellIndex = 1; cellIndex < numberOfColumns; cellIndex++) {				
			var cell = rowElement.childNodes[cellIndex];
			this.__selectCell(cell);
		} 
	}

	__selectColumn(cellIndex, table){
		var tbody = table.childNodes[1];
		for(var row of tbody.childNodes){
			var cell = row.childNodes[cellIndex];
			this.__selectCell(cell);
		}
	}

	highlightRow(index){
		this.__highlightedRows.push(index);

		this.tableSelection //
			.selectAll('tbody tr:nth-child(' + (index+1) + ')') //
			.classed('highlighted', true);
	}

	__unHighlightRow(index){

		this.tableSelection //
			.selectAll('tbody tr:nth-child(' + (index+1) + ')') //
			.classed('highlighted', false);
	}

	__selectCell(cell){
		cell.classList.add('selected');
		this.__selectedCells.push(cell);
	}

	__highlightColumn(index){

		if(index === undefined){
			return;
		}

		this.__highlightedColumns.push(index);

		this.tableSelection //
			.select('thead th:nth-child(' + (index+1) + ')') //
			.classed('highlighted', true);

		this.tableSelection //
			.selectAll('tbody td:nth-child(' + (index+1) + ')') //
			.classed('highlighted', true);
	}

	__unHighlightColumn(index){

		if(index === undefined){
			return;
		}

		this.tableSelection //
			.select('thead th:nth-child(' + (index+1) + ')') //
			.classed('highlighted', false);

		this.tableSelection //
			.selectAll('tbody td:nth-child(' + (index+1) + ')') //
			.classed('highlighted', false);
	}

	resetSelectionAndHighlighting(){
		this.__unselectCells();
		this.__unHighlightColumns();
		this.__unHighlightRows();

	}

	__unselectCells(){
		for(var cell of this.__selectedCells){
			cell.classList.remove('selected');
		}
		this.__selectedCells = [];
	}

	__unHighlightColumns(){
		for(var columnIndex of this.__highlightedColumns){
			this.__unHighlightColumn(columnIndex);
		}
		this.__highlightedColumns = [];
	}

	__unHighlightRows(){
		for(var rowIndex of this.__highlightedRows){
			this.__unHighlightRow(rowIndex);
		}
		this.__highlightedRows = [];
	}

	__updateCtrlState(event){
		if(event.ctrlKey){
			this.__ctrlIsPressed = true;
		} else {
			this.__ctrlIsPressed = false;
		}
	}

	get tableSelection(){
		return this.__table.tableSelection;
	}

	get highlightedRowIndices(){
		return this.__highlightedRows;
	}

	get dTreez(){
		return this.__table.dTreez;
	}


}