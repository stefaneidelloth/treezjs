 
export default class DTreezSelection {
	
	constructor(d3Selection){
		this.__d3Selection = d3Selection;
	}
	
	addAction(action){
		this.__d3Selection.node().addAction(action);
		return this;
	}
	
	append(selector){
		let selection = this.__d3Selection.append(selector);
		return new DTreezSelection(selection);
	}
	
	appendChild(child){
		this.__d3Selection.node().appendChild(child);
		return this;
	}
	
	attr(name, value){
		this.__d3Selection.attr(name, value);
		return this;
	}
	
	bindValue(parentObject, lambdaExpressionIdentifyingProperty){
		this.__d3Selection.node().bindValue(parentObject, lambdaExpressionIdentifyingProperty);
		return this;
	}
	
	disable(){
		this.__d3Selection.attr('enabled', false);		
		return this;
	}
	
	enable(){
		this.__d3Selection.attr('enabled', true);		
		return this;
	}
	
	html(content){
		this.__d3Selection.html(content);
		return this;
	}
	
	image(imageName){
		this.__d3Selection.attr('image', imageName);		
		return this;
	}
	
	label(label){
		this.__d3Selection.attr('label', label);		
		return this;
	}
	
	onChange(action){
		this.__d3Selection.on('change', action);
		return this;
	}
	
	remove(){
		this.__d3Selection.remove();
        return this;		
	}
	
	select(selector){
		let selection = this.__d3Selection.select(selector);
		return new DTreezSelection(selection);
	}
	
	selectAll(selector){
		let selection = this.__d3Selection.selectAll(selector);
		return new DTreezSelection(selection);
	}
	
	title(title){
		this.__d3Selection.attr('title', title);		
		return this;
	}
	
	value(value){
		this.__d3Selection.attr('value', value);		
		return this;
	}
	
}	