import VariableRange from './variableRange.js';
import StringItemVariable from './../../model/variable/field/stringItemVariable.js';

/**
 * Represents a variable range for String values. The parent must by a Study (e.g. Sweep)
 */
export default class StringItemRange extends VariableRange {
	
	constructor(name, values) {
		super(name, values);
		this.image = 'stringItemRange.png';	
		this.__stringItemList = [];
		this.__stringItemListSelection = undefined;
	}
	
	createComponentControl(tabFolder){    
	     
		const page = tabFolder.append('treez-tab')
            .label('Data');		

		const section = page.append('treez-section')
        	.label('Data');   

	    const sectionContent = section.append('div'); 
	    
	    sectionContent.append('treez-model-path')
	    	.label('Variable path')
        	.nodeAttr('atomClasses', [StringItemVariable])
        	.onChange(() => this.__variablePathChanged())
        	.bindValue(this, () => this.variablePath);
	   
	    this.__stringItemListSelection = sectionContent.append('treez-string-item-list')
	    	.label('Range')
	    	.nodeAttr('options', this.options)
	    	.bindValue(this, ()=>this.__stringItemList);	
				
    }	
	
	__variablePathChanged(){
		if(this.__stringItemListSelection){
			this.__stringItemListSelection.nodeAttr('options', this.options);
		}
	}
	
	get values(){
		return this.__stringItemList;
	}

	set values(array){
		this.__stringItemList = array;		
	}
	
	get options(){
		if(!this.variablePath){
			return [];
		}
		
		var variableAtom = this.childFromRoot(this.variablePath);
		return variableAtom.options;
	}

}
