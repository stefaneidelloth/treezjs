import VariableRange from './variableRange.js';
import IntegerVariable from './../../model/variable/field/integerVariable.js';
import ColumnType from './../../data/column/columnType.js';

export default class IntegerRange extends VariableRange {

	constructor(name, values) {
		super(name, values);
		this.image = 'integerRange.png';		
		this.columnType = ColumnType.integer;
	}

	createComponentControl(tabFolder){    
	     
		const page = tabFolder.append('treez-tab')
            .label('Data');		

		const section = page.append('treez-section')
        	.label('Data');   

	    const sectionContent = section.append('div'); 
	    
	    sectionContent.append('treez-model-path')
	    	.label('Variable path')
        	.nodeAttr('atomClasses', [IntegerVariable])
        	.bindValue(this, ()=>this.variablePath);

	    //TODO apply source model path as origin and use
	    //relative model paths
	    
	    sectionContent.append('treez-text-field')
	    	.label('Range')
	    	.bindValue(this, ()=>this.rangeString);	 
	    
	    sectionContent.append('treez-check-box')
	    	.label('Enable')
	    	.bindValue(this, ()=>this.isEnabled);
				
    }	

}
