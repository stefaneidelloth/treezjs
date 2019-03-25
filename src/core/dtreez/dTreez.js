//* wraps d3 to have a clear interface
//* adds additional functionality

import DTreezSelection from './dTreezSelection.js'
import DTreezEvent from './dTreezEvent.js';
 
export default class DTreez {
	
	constructor(d3){
		this.__d3 = d3;
		this.event = new DTreezEvent(d3);
	}

	axisLeft(){
		return this.__d3.axisLeft();
	}

	axisRight(){
		return this.__d3.axisRight();
	}

	axisTop(){
		return this.__d3.axisTopt();
	}

	axisBottom(){
		return this.__d3.axisBottom();
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