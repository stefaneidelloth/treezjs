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
		if(value===undefined){
			return this.__d3Selection.attr(name);
		}
		this.__d3Selection.attr(name, value);
		return this;
	}
	
	bindValue(parentObject, lambdaExpressionIdentifyingProperty){
		var bindFunction = this.__d3Selection.node().bindValue
		if(bindFunction){
			this.__d3Selection.node().bindValue(parentObject, lambdaExpressionIdentifyingProperty);
		} else {
			throw new Error("(Custom) html element does not yet implement bindValue function.");
		}
		return this;
	}
	
	classed(className, flag){
		if (flag === undefined){
			return this.__d3Selection.classed(className);
		}
		return this.__d3Selection.classed(className, flag);
	}

	className(className){
		this.__d3Selection.attr('class', className);		
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

	onClick(action){
		this.__d3Selection.on('click', action);
		return this;
	}
	
	onChange(action){
		this.__d3Selection.on('change', action);
		return this;
	}

	onInput(action){
		this.__d3Selection.on('input', action);
		return this;
	}
	
	onToggle(action){
		this.__d3Selection.on('toggle', action);
		return this;
	}
	
	onContextMenu(action){
		this.__d3Selection.on('contextmenu', action);
		return this;
	}
	
	onMouseDown(action){
		this.__d3Selection.on('mousedown', action);
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
	
	style(key, value){
		this.__d3Selection.style(key, value);		
		return this;
	}
	
	src(source){
		this.__d3Selection.attr('src', source);		
		return this;
	}
	
	text(value){
		this.__d3Selection.text(value);		
		return this;
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