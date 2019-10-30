import ComponentAtom from './../../core/component/componentAtom.js';
import AddChildAtomTreeViewAction from './../../core/treeView/addChildAtomTreeViewAction.js';
import Column from './column.js';

export default class ColumnFolder extends ComponentAtom {

	constructor(name) {
		if(!name){
			name='columns';
		}
		super(name);	
		this.image = 'columnFolder.png';			
	}

	
	createComponentControl(tabFolder){    
	     
		const page = tabFolder.append('treez-tab')
			.label('Data'); 
		
		const section = page.append('treez-section')
    		.label('Columns');
	
		section.append('treez-text-label')
			.value('This is a folder for all columns of the table.');		
	}	
	
	extendContextMenuActions(actions, parentSelection, treeView) {	

		actions.push(new AddChildAtomTreeViewAction(
				Column,
				'column',
				'column.png',
				parentSelection,
				this,
				treeView));			

		return actions;
	}

	get columns(){
		return this.childrenByClass(Column);
	}

	
	get headers() {
		var headers = [];
		for (var column of this.columns) {			
			var header = column.header;				
			if (header) {
				headers.push(header);
			} else {
				throw new Error('Could not read header for column "' + column.name + '"');
			}
		}
		return headers;
	}

	checkHeaders(expectedHeaders) {
		var existingHeaders = this.headers;
		var hasSameLength = (expectedHeaders.length == existingHeaders.length);
		if (!hasSameLength) {
			var message = 'The given number of columns is ' + expectedHeaders.length
					+ ' and the expected numboer of columns is ' + existingHeaders.lengths + '.';
			console.warn(message);
			return false;
		}

		for (var index = 0; index < expectedHeaders.length; index++) {
			var isEqualHeader = expectedHeaders[index] === existingHeaders[index];
			if (!isEqualHeader) {
				return false;
			}
		}
		return true;

	}
	
	column(header) {
		try {
			return this.child(header);			
		} catch (error) {
			throw new Error('Could not get column "' + header + '".');
		}
	}

	type(header) {
		return this.column(header).type;
	}

	legend(header) {
		return this.column(header).legend;
	}	

	columnByIndex(columnIndex) {
	
		if (this.children.length > columnIndex) {
			return this.children[columnIndex];
			
		} else {
			var message = 'The table only has ' + this.children.length + ' columns and the index ' + columnIndex
					+ ' is invalid.';
			throw new Error(message);
		}

	}

	get hasColumns() {			
		return this.columns.length > 0;		
	}

	get numberOfColumns() {
		return this.columns.length;		
	}

	createColumn(name, type, legend, isLinkedToSource, isVirtual) {
		 var column = this.createChild(Column, name);
		 
		 if(type!==undefined){
			 column.type = type;
		 }
		 
		 if(legend!==undefined){
			 column.legend = legend;
		 }
		 
		 if(isLinkedToSource!==undefined){
			 column.isLinkedToSource = isLinkedToSource;
		 }
		 
		 if(isVirtual!==undefined){
			 column.isVirtual = isVirtual;
		 }
		 
		 return column;
	}

	createColumnWithBlueprint(blueprint) {
		
		
		var column = this.createColumn(blueprint.name, blueprint.type, blueprint.legend, blueprint.isLinkedToSource, blueprint.isVirtual);
		if (!blueprint.isVirtual) {
			column.isNullable = blueprint.isNullable;
			column.isPrimaryKey = blueprint.isPrimaryKey;
		}
		
		column.defaultValueString = blueprint.defaultValue === null
										?'null'
										:'' + blueprint.defaultValue;
		

		return column;
	}	

}
