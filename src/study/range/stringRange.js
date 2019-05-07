import VariableRange from './variableRange.js';
import StringVariable from './../../model/variable/field/stringVariable.js';

/**
 * Represents a variable range for String values. The parent must by a Study (e.g. Sweep)
 */
export default class StringRange extends VariableRange {
	
	constructor(name, values) {
		super(name, values);
		this.image = 'stringRange.png';	
		this.__stringList = [];
	}
	
	createComponentControl(tabFolder){    
	     
		const page = tabFolder.append('treez-tab')
            .label('Data');		

		const section = page.append('treez-section')
        	.label('Data');   

	    const sectionContent = section.append('div'); 
	    
	    sectionContent.append('treez-model-path')
	    	.label('Variable path')
        	.nodeAttr('atomClasses', [StringVariable])
        	.bindValue(this, ()=>this.variablePath);
	   
	    sectionContent.append('treez-string-list')
	    	.label('Range')
	    	.bindValue(this, ()=>this.__stringList);   
				
    }
	
	get values(){
		return this.__stringList;
	}

	set values(array){
		this.__stringList = array;		
	}

}
