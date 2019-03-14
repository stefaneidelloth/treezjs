import ComponentAtom from './../../core/component/componentAtom.js';
import ColumnType from './columnType.js';

export default class Column extends ComponentAtom {

	constructor(name) {
		super(name);		
		
		this.image ='column.png';
		
		this.header = name;
		this.legend = '';
		this.type = ColumnType.String;
		this.isNullable = false;
		this.isPrimaryKey = false;
		this.defaultValueString = '';
		this.isVirtual = false;
		this.isLinkedToSource = false;

		this.__headerSelection = undefined;
		this.__typeSelection = undefined;
		this.__isNullableSelection = undefined;
		this.__isPrimaryKeySelection = undefined;
		this.__defaultValueSelection = undefined;
		this.__legendSelection = undefined;
	}	

	copy() {
		//TODO
	}
	
	 createComponentControl(tabFolder){    
	     
		const tab = tabFolder.append('treez-tab')
	            .label('Data');
			
		const section = tab.append('treez-section')
            .label('Data');       

        const sectionContent = section.append('div'); 
        
        this.__headerSelection = sectionContent.append('treez-text-field')
						        	.label('header')
						        	.bindValue(this,()=>this.header);
        
        this.__legendSelection = sectionContent.append('treez-text-field')
        							.label('Legend')
        							.bindValue(this, ()=>this.legend);

		this.__typeSelection = sectionContent.append('treez-enum-combo-box')
									.label('Type')
									.nodeAttr('options', ColumnType)
									.bindValue(this, ()=>this.type);
		
		this.__isNullableSelection = sectionContent.append('treez-check-box')
									.label('Nullable')		
									.bindValue(this, ()=>this.isNullable);
		
		this.__isPrimaryKeySelection = sectionContent.append('treez-check-box')
									.label('Primary key')		
									.bindValue(this, ()=>this.isPrimaryKey);
		
		this.__defaultValueSelection = sectionContent.append('treez-text-field')
							    	.label('Default value')
							    	.bindValue(this,()=>this.defaultValueString);	

	 }

	

	afterCreateControlAdaptionHook() {
		if (this.isLinkedToSource) {
			this.__disableAttributes();
		}

		if (this.isVirtual) {
			this.__isPrimaryKeySelection.enable();
			this.__defaultValueSelection.disable();
		} else {
			this.__isPrimaryKeySelection.enable();
			this.__defaultValueSelection.enable();
		}
	}

	__disableAttributes() {

		this.__headerSeleciton.disable();
		this.__typeSelection.disable();
		this.__isNullableSelection.disable();
		if (!isVirtual) {
			this.__isPrimaryKeySelection.disabled();
			this.__defaultValueSelection.disabled();
		}
		this.__legendSelection.disabled();

	}

	
	get values() {			
		
		var rows = this.table.rows;

		var values = [];
		
		for (var row of rows) {
			var entry = row.getEntry(this.header);
			values.push(entry);
		}
		return values;
	}

	get numericValues() {
		var valueObjects = this.values;
		switch (this.type) {
		case ColumnType.Integer:
			return this.values;
		case ColumnType.Double:
			return this.values;
		case ColumnType.String:
			return valueObjects.map(element => {
				return parseFloat(element);
			});
		default:			
			throw new Error('Unknown column type ' + this.type);
		}
	}
	
	get stringValues() {
		return this.values.map(element => {
			return element.toString();
		});		
	}	
	
	get isNumeric() {
		return this.type.isNumeric;
	}		

	get table() {
		return this.parent.parent;		
	}

}
