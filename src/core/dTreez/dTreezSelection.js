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
	
	call(callBack){
		let selection = this.__d3Selection.call(callBack);
		return new DTreezSelection(selection);
	}
	
	classed(className, flag){
		if (flag === undefined){
			return this.__d3Selection.classed(className);
		}
		let selection = this.__d3Selection.classed(className, flag);
		return new DTreezSelection(selection);
	}

	className(className){
		let selection = this.__d3Selection.attr('class', className);		
		return new DTreezSelection(selection);
	}

	contentWidth(width){
		this.__d3Selection.attr('content-width', width);		
		return this;
	}
	
	data(data, callBack){
		var selection = this.__d3Selection.data(data, callBack);
		return new DTreezSelection(selection);
	}

	datum(datum){
		var selection = this.__d3Selection.datum(datum);
		return new DTreezSelection(selection);
	}
	
	disable(){
		this.__d3Selection.attr('disabled', '');		
		return this;
	}

	each(method){
		var selection = this.__d3Selection.each(method);
		return new DTreezSelection(selection);
	}
	
	enter(){
		var selection = this.__d3Selection.enter();
		return new DTreezSelection(selection);
	}
	
	enable(){
		this.__d3Selection.attr('disabled', null);		
		return this;
	}

	filter(method){
		let selection = this.__d3Selection.filter(method);
		return new DTreezSelection(selection);
	}
	
	hide(){
		this.__d3Selection.attr('hidden', '');		
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

	insert(foo, baa){
		let selection = this.__d3Selection.insert(foo, baa);	
		return new DTreezSelection(selection);
	}

	join(selector){
		var selection = this.__d3Selection.join(selector);
		return new DTreezSelection(selection);
	}
	
	label(label){
		this.__d3Selection.attr('label', label);		
		return this;
	}

	labelWidth(labelWidth){
		this.__d3Selection.attr('label-width', labelWidth);		
		return this;
	}

	min(min){
		this.__d3Selection.attr('min', min);		
		return this;
	}

	max(max){
		this.__d3Selection.attr('max', max);		
		return this;
	}
	
	node(){
		return this.__d3Selection.node();
	}

	nodeAttr(name, value){
		if(value===undefined){
			return this.__d3Selection.node()[name];
		}
		this.__d3Selection.node()[name] = value;
		return this;
	}

	on(key, action){
		this.__d3Selection.on(key, action);
		return this;
	}

	onClick(action){
		this.__d3Selection.on('click', action);
		return this;
	}

	onDoubleClick(action){
		this.__d3Selection.on('dblclick', action);
		return this;
	}

	onMouseDown(action){
		this.__d3Selection.on('mousedown', action);
		return this;
	}

	onMouseOver(action){
		this.__d3Selection.on('mouseover', action);
		return this;
	}

	onMouseOut(action){
		this.__d3Selection.on('mouseout', action);
		return this;
	}

	onMouseUp(action){
		this.__d3Selection.on('mouseup', action);
		return this;
	}

	onChange(action){
		this.__d3Selection.on('change', action);
		return this;
	}
	
	onActualChange(action){
		this.__d3Selection.on('change', (event)=>{
			var detail = event.detail;
			if(detail){
				if (detail.oldValue != detail.newValue){
					action(event);
				}
			} 			
		});
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
	
	show(){
		this.__d3Selection.attr('hidden', null);		
		return this;
	}

	step(step){
		this.__d3Selection.attr('step', step);		
		return this;
	}
	
	style(key, value){
		if (value === undefined){
			return this.__d3Selection.style(key);
		}
		this.__d3Selection.style(key, value);		
		return this;
	}
	
	src(source){
		if (source === undefined){
			return this.__d3Selection.attr('src');
		}
		this.__d3Selection.attr('src', source);		
		return this;
	}
	
	text(value){
		if (value === undefined){
			return this.__d3Selection.text();
		}
		this.__d3Selection.text(value);		
		return this;
	}
	
	title(title){
		if (title === undefined){
			return this.__d3Selection.attr('title');
		}
		this.__d3Selection.attr('title', title);		
		return this;
	}

	type(type){
		if (type === undefined){
			return this.__d3Selection.attr('type');
		}
		this.__d3Selection.attr('type', type);		
		return this;
	}
	
	value(value){
		if (value === undefined){
			return this.__d3Selection.attr('value');
		}
		this.__d3Selection.attr('value', value);		
		return this;
	}
	
}	