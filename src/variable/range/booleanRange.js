import VariableRange from './variableRange.js';
import BooleanVariable from './../field/booleanVariable.js';

export default class BooleanRange extends VariableRange {
	
	constructor(name, values){
		super(name, values);
		this.image = 'booleanRange.png';
		this.__rangeString = 'true & false'
		this.columnType = ColumnType.integer;
	}
	
	get values(){		
		if(this.__rangeString === 'true & false'){
			return [true, false];
		} else {
			return [false, true];
		}		
	}

	set values(array){
		if(array[0] === true){
			this.__rangeString = 'true & false';
		} else {
			this.__rangeString = 'false & true';
		}			
	}
	
	createComponentControl(tabFolder){    
	     
		const page = tabFolder.append('treez-tab')
            .label('Data');		

		const section = page.append('treez-section')
        	.label('Data');   

	    const sectionContent = section.append('div'); 
	    
	    sectionContent.append('treez-model-path')
	    	.label('Variable path')
        	.nodeAttr('atomClasses', [BooleanVariable])
        	.bindValue(this, ()=>this.variablePath);		
		
		sectionContent.append('treez-combo-box')
			.label('Range')
			.nodeAttr('options', ['true & false', 'false & true'])
			.bindValue(this, ()=>this.__rangeString); 
				
    }
	
	createVariableControl(sectionContent, dTreez){
		
		sectionContent.append('treez-combo-box')
			.label(this.name)
			.nodeAttr('options', ['true & false', 'false & true'])
			.bindValue(this, ()=>this.__rangeString); 
    	
    }

}
