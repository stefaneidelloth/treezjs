import ComponentAtom from './../core/component/componentAtom.js';
import VariableCodeAdaption from './variableCodeAdaption.js';
import ColumnType from './../data/column/columnType.js';

export default class Variable extends ComponentAtom {
		
	constructor(name, value) {
		super(name);
		this.value=value;		
		this.isDisableable=true;
		this.columnType = ColumnType.string;
	}	
	
    createComponentControl(tabFolder){    
     
		const page = tabFolder.append('treez-tab')
            .label('Data');

		const section = page.append('treez-section')
        	.label('Properties');   

	    const sectionContent = section.append('div'); 
	
	    sectionContent.append('treez-text-field')
	        .label('Name') 
	        .onChange(()=>this.__treeView.refresh(this))
	        .bindValue(this,()=>this.name);   
	}
    
    createVariableControl(parent, dTreez){
    	throw new Error('Must be overridden by inheriting variable class.')
    }

    createCodeAdaption(){
    	return new VariableCodeAdaption(this);
    }
    
    createRange(){    	
    	throw new Error('Must be overridden by inheriting variable class.');
    }

}