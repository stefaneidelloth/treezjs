import VariableRange from './variableRange.js';
import QuantityVariable from './../field/quantityVariable.js';
import ColumnType from './../../data/column/columnType.js';

export default class QuantityRange extends VariableRange {

	constructor(name, values) {
		super(name, values);
		this.image = 'quantityRange.png';		
		this.columnType = ColumnType.double;
		this.unit = '1';
	}
	
	get values(){
		var numbers =  eval(this.rangeString);
		return numbers.map((number)=>new Quantity(number, this.unit));
	}

	set values(array){		
		var numberStrings = array.map(quantity => ('' + quantity.number));
		
		this.__rangeString = '[' + numberStrings.join(', ') + ']';		
	}

	createComponentControl(tabFolder){    
	     
		const page = tabFolder.append('treez-tab')
            .label('Data');		

		const section = page.append('treez-section')
        	.label('Data'); 
        	
        this.createHelpAction(section, 'variable/range/' + this.atomType + '.md');   

	    const sectionContent = section.append('div'); 
	    
	    sectionContent.append('treez-model-path')
	    	.label('Variable path')
        	.nodeAttr('atomClasses', [QuantityVariable])
        	.bindValue(this, ()=>this.variablePath);
	    
	    sectionContent.append('treez-text-field')
	    	.label('Number range')
	    	.bindValue(this, ()=>this.__rangeString);	
	    
	    sectionContent.append('treez-text-field')
	    	.label('Unit')
	    	.bindValue(this, ()=>this.unit);	    
				
    }	
	
	createVariableControl(sectionContent, dTreez){
		
		sectionContent.append('treez-text-label')
			.label(this.name);
	
	    sectionContent.append('treez-text-field')
	    	.label('Number range')
	    	.bindValue(this, ()=>this.__rangeString);	
    
	    sectionContent.append('treez-text-field')
	    	.label('Unit')
	    	.bindValue(this, ()=>this.unit);
		
    	
    }

}
