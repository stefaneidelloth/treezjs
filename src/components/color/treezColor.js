import LabeledTreezElement from './../labeledTreezElement.js';
import Color from './color.js';

export default class TreezColor extends LabeledTreezElement {

    constructor(){
        super();
        this.__container=undefined;
        this.__label=undefined; 
        this.__colorPicker=undefined;  
    }
            
    connectedCallback() {
    	
        if(!this.__colorPicker){   

			var container = document.createElement('div');
			this.__container = container;
			container.setAttribute("class","treez-color-container");
			this.appendChild(container);      

			var label = document.createElement('label');
			this.__label = label;
			label.className = 'treez-color-label';
			label.innerText = this.label;                                            
			container.appendChild(label);             

			var colorPicker = document.createElement('input');                       
			this.__colorPicker = colorPicker;		
			container.appendChild(colorPicker); 
			colorPicker.className = 'treez-color-input';
			colorPicker.type='color';  
			colorPicker.onchange = () => this.__colorChanged();
			          		
        }
        
        this.updateElements(this.value);	
        this.disableElements(this.disabled)
		this.hideElements(this.hidden); 
    }               

    updateElements(color){
    	if(this.__colorPicker){                    	
			this.__colorPicker.value= color.hexString; 
			this.__colorPicker.title = color.hexString;
    	}
    }
    
    __colorChanged(){
    	this.value = this.convertFromStringValue(this.__colorPicker.value);
    }
    
    convertFromStringValue(colorHexString){
    	var color;
    	try{
    		return Color.forHexString(colorHexString);
    	} catch (error){
    		return new Color('custom', colorHexString);
    	}                	
    }

    convertToStringValue(color){
    	return color.hexString;                	
    }
   
    disableElements(booleanValue){
    	if(this.__colorPicker){   
    		this.__colorPicker.disabled = booleanValue;
    	}
    }	
   
    hideElements(booleanValue){
    	if(this.__container){  
    		this.hide(this.__container, booleanValue);                		
    	}
    }	     

    __getColorHexString(value){
    	
    	if(value.startsWith('#')){
    		return value;
    	}
    	
    	for(var color of Color.values){
    		if(color.name === value){
    			return color.hexString;
    		}
    	}                	
    	
    	throw new Error('Unknown color value ' + value);                	
    }  
    
    get value() {
      return super.value;  	  
  	}

  	set value(value) {
  	  var colorHexString;
  	  if(value instanceof Color){
  		colorHexString = this.convertToStringValue(value);
  	  }	else {
  		colorHexString = this.__getColorHexString(value);
  	  } 
  	  this.setAttribute('value', colorHexString);  				  
  	}	
}
window.customElements.define('treez-color', TreezColor);        