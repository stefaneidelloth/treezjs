import ComponentAtom from './../core/component/componentAtom.js';
import VariableCodeAdaption from './variableCodeAdaption.js';
import ColumnType from './../data/column/columnType.js';

export default class Variable extends ComponentAtom {
		
	constructor(name, value) {
		super(name);
		this.value = value;		
		this.isDisableable = true;
		this.columnType = ColumnType.string;
		this.__nameSelection = undefined;
	}	

	clone(){
		return new this.constructor(this.name, this.value);
	}
	
    createComponentControl(tabFolder){    
     
		const page = tabFolder.append('treez-tab')
            .label('Data');

		const section = page.append('treez-section')
        	.label('Properties'); 

		this.createHelpAction(section, this.helpPath);       	  

	    const sectionContent = section.append('div'); 
	
	    this.__nameSelection = sectionContent.append('treez-text-field')
	        .label('Name') 
	        .nodeAttr('validator', (name)=>this.validateName(name))
	        .onChange(()=>this.__nameChanged())	       
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

    __nameChanged(){
    	if(this.__nameSelection){
    		this.treeView.refresh(this);
    	}
    }

	//should be overridden by inheriting classes
    get helpPath(){
    	return undefined;
    }

}