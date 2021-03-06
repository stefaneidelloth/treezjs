import Variable from './../variable.js';
import Quantity from './../quantity.js';
import QuantityRange from './../range/quantityRange.js';

export default class QuantityVariable extends Variable {
	
	constructor(name, quantity){
		super(name, (quantity
						?quantity
						:new Quantity(0.0,'1')
					));		
		
		this.image='quantityVariable.png';
	}		
	
	set value(quantity){
		super.value = quantity;
		this.__number = quantity.number;
		this.__unit = quantity.unit;
	}

	get number(){
		return this.value.number;
	}
	
	set number(number){		
		this.value.number = number;
	}
	
	get unit(){
		return this.value.unit;
	}

	set unit(unit){		
		this.value.unit = unit;
	}
	
	createVariableControl(parent, dTreez){
		
		var label = parent.append('treez-text-label')
			.value(this.name);
		
		var container = parent.append('div');		   
		
		var numberField = container.append('treez-double')
			.label('number:')
			.attr('label-width','45px')
			.attr('content-width','60px')	
			.attr('inline', true)		
			.style('display','inline')			
			.bindValue(this, ()=>this.number);
		
		var unitField = container.append('treez-text-field')
			.label('&nbsp;&nbsp;unit:')
			.attr('label-width','45px')
			.attr('content-width','40px')
			.attr('inline', true)		
			.style('display','inline')
			.bindValue(this, ()=>this.unit);    	
    }
	
	createRange(name){
    	return new QuantityRange(name);
    }

    get helpPath(){
    	return 'variable/field/quantityVariable.md';
    }

}