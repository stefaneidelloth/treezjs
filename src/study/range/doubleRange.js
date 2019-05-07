import VariableRange from './variableRange.js';
import DoubleVariable from './../../model/variable/field/doubleVariable.js';
import ColumnType from './../../data/column/columnType.js';

export default class DoubleRange extends VariableRange {

	constructor(name, values) {
		super(name, values);
		this.image = 'doubleRange.png';		
		this.columnType = ColumnType.double;		
	}

	createComponentControl(tabFolder){    
	     
		const page = tabFolder.append('treez-tab')
            .label('Data');		

		const section = page.append('treez-section')
        	.label('Data');   

	    const sectionContent = section.append('div'); 
	    
	    sectionContent.append('treez-model-path')
	    	.label('Variable path')
        	.nodeAttr('atomClasses', [DoubleVariable])
        	.bindValue(this, ()=>this.variablePath);	   
	    
	    sectionContent.append('treez-text-field')
	    	.label('Range')
	    	.bindValue(this, ()=>this.__rangeString);	  
				
    }	

}
