//* wraps d3 to have a clear interface
//* adds additional functionality

import DTreezSelection from './dTreezSelection.js'
import DTreezEvent from './dTreezEvent.js';
 
export default class DTreez {
	
	constructor(d3){
		this.__d3 = d3;
		this.event = new DTreezEvent(d3);
	}

	axisLeft(scale){
		return this.__d3.axisLeft(scale);
	}

	axisRight(scale){
		return this.__d3.axisRight(scale);
	}

	axisTop(scale){
		return this.__d3.axisTop(scale);
	}

	axisBottom(scale){
		return this.__d3.axisBottom(scale);
	}

	format(formatter){
		return this.__d3.format(formatter);
	}

	scaleLinear(){
		return this.__d3.scaleLinear();
	}
	
	select(selector){
		let selection = this.__d3.select(selector);
		return new DTreezSelection(selection);
	}
	
	selectAll(selector){
		let selection = this.__d3.selectAll(selector);
		return new DTreezSelection(selection);
	}

	
	
}	