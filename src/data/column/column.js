import ComponentAtom from './../../core/component/componentAtom.js';
import ColumnType from './columnType.js';
import ColumnCodeAdaption from './columnCodeAdaption.js';

export default class Column extends ComponentAtom {

	constructor(name) {
		super(name);		
		
		this.image ='column.png';
		this.isUsingExplicitHeader = false;
		this.explicitHeader = '';
		this.legend = '';
		this.type = ColumnType.string;
		this.isNullable = true;
		this.isPrimaryKey = false;
		this.defaultValueString = 'null';
		this.isVirtual = false;
		this.isLinkedToSource = false;

		
		this.__explicitHeaderSelection = undefined;
		this.__typeSelection = undefined;
		this.__isNullableSelection = undefined;
		this.__isPrimaryKeySelection = undefined;
		this.__defaultValueSelection = undefined;
		this.__legendSelection = undefined;
	}	

	
	createComponentControl(tabFolder){    
	     
		const tab = tabFolder.append('treez-tab')
	            .label('Data');
			
		const section = tab.append('treez-section')
            .label('Data');       

        const sectionContent = section.append('div'); 

        sectionContent.append('treez-text-field')
						        	.label('Name')
						        	.nodeAttr('validator', (name)=>this.validateName(name))
						        	.onChange(()=>this.__nameChanged())
						        	.bindValue(this,()=>this.name);

		sectionContent.append('treez-check-box')
						        	.label('IsUsingExplicitHeader')
						        	.onChange(()=>this.__showOrHideExplicitHeaderTextField())
						        	.bindValue(this,()=>this.isUsingExplicitHeader);
        
        this.__explicitHeaderSelection = sectionContent.append('treez-text-field')
						        	.label('Explicit header')
						        	.bindValue(this,()=>this.explicitHeader);
        
        this.__legendSelection = sectionContent.append('treez-text-field')
        							.label('Legend')
        							.bindValue(this, ()=>this.legend);		
		
		this.__isNullableSelection = sectionContent.append('treez-check-box')
									.label('Nullable')		
									.bindValue(this, ()=>this.isNullable);
		
		this.__isPrimaryKeySelection = sectionContent.append('treez-check-box')
									.label('Primary key')		
									.bindValue(this, ()=>this.isPrimaryKey);

		this.__typeSelection = sectionContent.append('treez-enum-combo-box')
									.label('Type')
									.nodeAttr('enum', ColumnType)
									.bindValue(this, ()=>this.type);
		
		this.__defaultValueSelection = sectionContent.append('treez-text-field')
							    	.label('Default value')
							    	.bindValue(this,()=>this.defaultValueString);	

		this.__showOrHideExplicitHeaderTextField();

	 }

	createCodeAdaption() {
		return new ColumnCodeAdaption(this);
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

	__nameChanged(){
		if(this.__explicitHeaderSelection){
			this.treeView.refresh(this);
		}	
		
	}

	__showOrHideExplicitHeaderTextField(){
		if(this.__explicitHeaderSelection){
			if(this.isUsingExplicitHeader){
				this.__explicitHeaderSelection.show();
			} else {
				this.__explicitHeaderSelection.hide();
			}
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

	
	get header(){
		if(this.isUsingExplicitHeader){
			return this.explicitHeader;
		} else {
			return this.name;
		}
	}

	get numericValues() {
		var valueObjects = this.values;
		switch (this.type.name) {
		case ColumnType.integer.name:
			return this.values;
		case ColumnType.double.name:
			return this.values;
		case ColumnType.string.name:
			return valueObjects.map(element => {
				return parseFloat(element);
			});
		default:			
			throw new Error('Unknown column type ' + this.type);
		}
	}
	
		
	
	get isNumeric() {
		return this.type.isNumeric;
	}	

	get stringValues() {
		return this.values.map(element => {
			return element.toString();
		});		
	}	

	get table() {
		return this.parent.parent;		
	}

	get values() {			
		
		var rows = this.table.rows;

		var values = [];
		
		for (var row of rows) {
			var entry = row.entry(this.header);
			values.push(entry);
		}
		return values;
	}

}
