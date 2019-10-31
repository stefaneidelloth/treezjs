import TreezElement from './treezElement.js';

export default class LabeledTreezElement extends TreezElement {
	
	constructor(){
		super();
		this.__label=undefined; //this label-element should be created by inheriting classes
		                        //it should have a property "innerText" that defines the label text
	} 

	static get observedAttributes() {
		return TreezElement.observedAttributes.concat(['label','label-width','content-width']);
    } 				           

	attributeChangedCallback(attr, oldStringValue, newStringValue) {
    	super.attributeChangedCallback(attr, oldStringValue, newStringValue)

		if(attr==='label'){
			if(this.__label){
				this.__label.innerText= newStringValue;
			}
		}

		if(attr==='label-width'){
			if(this.__label){
				this.updateLabelWidth(newStringValue);
			}
		}

		if(attr==='content-width'){
			if(this.__label){
				this.updateContentWidth(newStringValue);
			}
		}
	}



	update(){

		var initialValue;
		try{
			initialValue = this.value;
		} catch(error){

		}

		this.updateElements(initialValue);

		this.disableElements(this.disabled)
		this.hideElements(this.hidden);		
		this.updateLabelWidth(this.labelWidth);
		this.updateContentWidth(this.contentWidth);
		this.updateWidth(this.width);
	}

	//might be overridden by inheriting class
	updateContentWidth(contentWidth){

	}

	updateLabelWidth(labelWidth){
		this.updateWidthFor(this.__label, labelWidth);	
		if(this.__label){
			if(labelWidth){
				this.__label.style.textAlign = 'right';
			}	else {
				this.__label.style.textAlign = '';
			}
		}		
	}

	updateWidthFor(element, width){
		if(element){
			if(width){
				if(width === '0'){
					throw new Error('Width must not be zero. Please use attribute "hidden" instead.')
				}
				element.style.width = width;				
			} else {
				if(width === 0){
					throw new Error('Width must not be zero. Please use attribute "hidden" instead.')
				}
				element.style.width = '';				
			}
		}
	}
	
	get label() {
		 return this.getAttribute('label');
	}

	set label(newValue) {
		 this.setAttribute('label', newValue);	
	}

	get labelWidth() {
		return this.getAttribute('label-width');
	}

	set labelWidth(newValue) {
		this.setAttribute('label-width', newValue);
	}

	get contentWidth() {
		return this.getAttribute('content-width');
	}

	set contentWidth(newValue) {
		this.setAttribute('content-width', newValue);
	}

}