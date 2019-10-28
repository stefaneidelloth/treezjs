import LabeledTreezElement from './../labeledTreezElement.js';

export default class TreezCheckBox extends LabeledTreezElement {

    constructor(){
        super(); 
        this.__container=undefined;
        this.__checkBox=undefined;   
        this.__label=undefined;                                   
    }
        	
	connectedCallback() {
    	
        if(!this.__checkBox){   

			var container = document.createElement('div'); 
			this.__container = container;
			container.className = 'treez-check-box-container';							
			this.appendChild(container);

			var checkBox = document.createElement('input');                       
			this.__checkBox = checkBox;
			checkBox.type='checkBox'	
			checkBox.className = 'treez-check-box-input';
			checkBox.onchange = () => this.__checkBoxChanged();
			container.appendChild(checkBox); 

			var label = document.createElement('label');
			this.__label = label;
			label.innerText = this.label;   
			label.className = 'treez-check-box-label';
			container.appendChild(label);
        }

        this.update();

    } 
		
    updateElements(booleanValue){
    	if(this.__checkBox){  
			this.__checkBox.checked = booleanValue;
    	}
	}

	updateContentWidth(width){
        //this.updateWidthFor(this.__checkBox, width);

        if(!width){
        	this.__checkBox.style.marginLeft = '';
        	return;
        }

        if(!width.includes('px')){
        	throw new Error("Width for checkbox needs to be specified in px");
        }

        let totalWidth = parseFloat(width.substring(0, width.length-2));
        let leftMargin = totalWidth-17;
        
        this.__checkBox.style.marginLeft = leftMargin + 'px';
        
        
	}
	
	disableElements(booleanValue){
		if(booleanValue === undefined){
			throw Error('This method expects a boolean argument');
		}
    	if(this.__checkBox){   
    		this.__checkBox.disabled = booleanValue;
    	}
    }	
   
    hideElements(booleanValue){
		if(booleanValue === undefined){
			throw Error('This method expects a boolean argument');
		}
    	if(this.__container){   
    		LabeledTreezElement.hide(this.__container, booleanValue);                		
    	}
    }  
       
    convertFromStringValue(stringValue){
		return !(stringValue === null);
	}
	
	convertToStringValue(booleanValue){
		return booleanValue
				?''
				:null;						
	}

	__checkBoxChanged(){
    	this.value = this.__checkBox.checked;                	
    }                 
              
}

window.customElements.define('treez-check-box', TreezCheckBox);                    

       