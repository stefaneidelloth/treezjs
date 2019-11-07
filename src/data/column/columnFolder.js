import ComponentAtom from './../../core/component/componentAtom.js';
import AddChildAtomTreeViewAction from './../../core/treeView/addChildAtomTreeViewAction.js';
import Utils from './../../core/utils/utils.js';
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

    	this.createHelpAction(section, 'data/column/columnFolder.md');		
	
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

	

	checkHeaders(expectedHeaders) {
		var existingHeaders = this.headers;
		var hasSameLength = (expectedHeaders.length == existingHeaders.length);
		if (!hasSameLength) {
			var message = 'The given number of columns is ' + expectedHeaders.length
					+ ' and the expected number of columns is ' + existingHeaders.lengths + '.';
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
	
	column(name) {
		try {
			return this.child(name);			
		} catch (error) {
			throw new Error('Could not get column with name "' + name + '".');
		}
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

	legend(name) {
		return this.column(name).legend;
	}
	

	type(name) {
		return this.column(name).type;
	}	

	get columns(){
		return this.childrenByClass(Column);
	}

	get names() {
		return this.columns.map((column=>column.name));		
	}
	
	get headers() {
		return this.columns.map((column=>column.header));	
	}	

	get hasColumns() {			
		return this.columns.length > 0;		
	}

	get numberOfColumns() {
		return this.columns.length;		
	}

	createColumn(name, type, legend, isLinkedToSource, isVirtual) {
		 var column = this.createChild(Column, name);
		 
		 if(type !== undefined){
			 column.type = type;
		 }
		 
		 if(legend === undefined){
			 column.legend = name;
		 } else {
		 	column.legend = legend;
		 }
		 
		 if(isLinkedToSource !== undefined){
			 column.isLinkedToSource = isLinkedToSource;
		 }
		 
		 if(isVirtual !== undefined){
			 column.isVirtual = isVirtual;
		 }
		 
		 return column;
	}

	createColumnWithBlueprint(blueprint) {
		
		var columnName = blueprint.name;
		var validationState = this.validateName(columnName);
		if(!validationState.isValid){
			columnName = Utils.convertNameThatMightIncludeSpacesToCamelCase(columnName);
			validationState = this.validateName(columnName);
			if(!validationState.isValid){
				let message = 'The column header "' + blueprint.name + '" could not be converted to a valid column name.';
				throw new Error(message);
			}
		}

		var column = this.createColumn(columnName, blueprint.type, blueprint.legend, blueprint.isLinkedToSource, blueprint.isVirtual);
		if (!blueprint.name === columnName){
			column.isUsingExplicitHeader = true;
			column.explicitHeader = blueprint.name;
		}

		if (!blueprint.isVirtual) {
			column.isNullable = blueprint.isNullable;
			column.isPrimaryKey = blueprint.isPrimaryKey;
		}
		
		column.defaultValueString = (blueprint.defaultValue === null || blueprint.defaultValue === undefined)
										?'null'
										:'' + blueprint.defaultValue;
		

		return column;
	}	

}
