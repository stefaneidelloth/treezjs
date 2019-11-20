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

	get detail(){
		return this.__d3.event.detail;
	}

	get x(){
		return this.__d3.event.x;
	}

	get y(){
		return this.__d3.event.y;
	}
	
	preventDefault(){
		this.__d3.event.preventDefault();
	}

	stopPropagation(){
		this.__d3.event.stopPropagation();
	}
	
}	