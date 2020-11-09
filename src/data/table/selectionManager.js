

export default class SelectionManager {

	constructor(table, dTreez){
		this.__table = table;

		this.__isSelecting = false;
		this.__ctrlIsPressed = false;

		this.__selectedCells = [];
		this.__highlightedColumns = [];
		this.__highlightedRows = [];
	}

	cellClicked(event, value){
		this.__isSelecting = true;
		this.__updateCtrlState(event);
		var cell = event.srcElement.parentNode;
		if(!this.__ctrlIsPressed){
			this.resetSelectionAndHighlighting();
		}

		this.__selectCell(cell);
		this.__highlightColumn(index);

	}

	cellMouseUp(event, value){
		this.__isSelecting = false;
		this.__updateCtrlState(event);
	}

	cellMouseOver(event, value){

	}

	rowClicked(event, row){
		this.highlightRow(row.index);
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

		this.__highlightedColumns.push(index);

		this.tableSelection //
			.select('thead th:nth-child(' + (index+1) + ')') //
			.classed('highlighted', true);

		this.tableSelection //
			.selectAll('tbody td:nth-child(' + (index+1) + ')') //
			.classed('highlighted', true);
	}

	__unHighlightColumn(index){

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