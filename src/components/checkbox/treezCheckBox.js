import LabeledTreezElement from './../labeledTreezElement.js';

export default class TreezCheckBox extends LabeledTreezElement {

    constructor(){
        super(); 
        this.__container=undefined;
        this.__checkBox=undefined;   
        this.__label=undefined;                                   
    }
    
    convertFromStringValue(stringValue){
		return !(stringValue === null);
	}
	
	
	convertToStringValue(booleanValue){
		return booleanValue
				?''
				:null;						
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
			container.appendChild(checkBox); 

			var label = document.createElement('label');
			this.__label = label;
			label.innerText = this.label;   
			label.className = 'treez-check-box-label';
			container.appendChild(label);                                               
                                                  		
        }
        
        this.updateElements(this.value);	
        this.disableElements(this.disabled)
		this.hideElements(this.hidden); 
    }     

    updateElements(booleanValue){
    	if(this.__checkBox){                  	                 	                      	
			if(this.__checkBox.checked !== booleanValue){
				this.__checkBox.checked = booleanValue;
			}; 						 
    	}
    }	
   
    disableElements(booleanValue){
    	if(this.__checkBox){   
    		this.__checkBox.disabled = booleanValue;
    	}
    }	
   
    hideElements(booleanValue){
    	if(this.__container){   
    		this.hide(this.__container, booleanValue);                		
    	}
    }	       	

   //overrides super methode to listen to checked property instead of value property
    __addListenerToUpdatePropertyOnElementChanges(parent, propertyName){				

		this.addEventListener('input', (event)=>{ 
			  var oldValue = parent[propertyName];
			  var newValue = event.target.checked; 
			  if(newValue != oldValue){
				parent[propertyName] = newValue;													     
			  }    	
		}); 					
	}            

               
              
}

window.customElements.define('treez-check-box', TreezCheckBox);                    

       