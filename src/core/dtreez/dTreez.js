//* wraps d3 to have a clear interface
//* adds additional functionality

import DTreezSelection from './dTreezSelection.js'
 
export default class DTreez {
	
	constructor(d3){
		this.d3 = d3;
	}
	
	select(selector){
		let selection = this.d3.select(selector);
		return new DTreezSelection(selection);
	}
	
}	