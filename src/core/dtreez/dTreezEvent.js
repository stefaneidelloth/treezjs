export default class DTreezEvent {
	
	constructor(d3){
		this.__d3 = d3;			
	}

	get ctrlKey(){
		return this.__d3.event.ctrlKey;
	}

	get source(){
		return this.__d3.event.source;
	}
	
	get target(){
		return this.__d3.event.target;
	}
	
	preventDefault(){
		this.__d3.event.preventDefault();
	}

	stopPropagation(){
		this.__d3.event.stopPropagation();
	}
	
}	