class TreezElement extends HTMLElement {

	static get observedAttributes() {
        return ['value', 'disabled', 'hidden'];
    }

	//The purpose of the following properties is to 
	//translate html string attribute values to and from
	//values that can be of other types, e. g. boolean
	//
	//In html a boolen value is always represented by a string attribute.
	//The only way to represent fals is to omit the value, e.g.
	//<input type='checkbox' >
	//vs.
	//<input type='checkbox' checked> or <input type='checkbox' checked='foo'>
	
	
    get value() {
	  var stringValue = this.getAttribute('value');
	  return this.convertFromStringValue(stringValue);
	}

	set value(value) {
	  var stringValue = this.convertToStringValue(value);
	  if(stringValue === null){
		  this.removeAttribute('value');
	  } else {
	  	this.setAttribute('value', stringValue);
	  }
	}

	get disabled() {
		var stringValue = this.getAttribute('disabled')
	    return  !(stringValue === null);
	}

	set disabled(booleanValue) {
		if(booleanValue){
			this.setAttribute('disabled','')
		} else {
			this.removeAttribute('disabled');
		}				 	  
	}  

	get hidden() {
		var stringValue = this.getAttribute('hidden')
	    return  !(stringValue === null);
	}

	set hidden(booleanValue) {
		if(booleanValue){
			this.setAttribute('hidden','')
		} else {
			this.removeAttribute('hidden');
		}	  
	}        

	constructor(){
		super();	
		this.__parentAtom=undefined;								
	} 				           

	bindValue(parentAtom, lambdaExpressionEncodingPropertyToBind){
		this.__parentAtom = parentAtom;
		
		var propertyName = this.__extractPropertyNameFromLambdaExpression(lambdaExpressionEncodingPropertyToBind)

		this.value = parentAtom[propertyName];					

		this.__addListenerToUpdatePropertyOnElementChanges(parentAtom, propertyName);

		this.__modifyPropertyToUpdateElementOnPropertyChanges(parentAtom, propertyName);	
	}

	//Can be overrriden by inheriting classes to implement different property types
	convertFromStringValue(value){
		return value;
	}
	
	//Can be overrriden by inheriting classes to implement different property types
	//Return null if you want an html attribute to be removed (="set to false")
	convertToStringValue(value){
		return value;
	}
	
	//should be overridden by inheriting classes
    updateElements(newValue){
		throw new Error('Not yet implemented for ' + this.constructor.name);
    }	

    //should be overridden by inheriting classes
    disableElements(booleanValue){
    	throw new Error('Not yet implemented for ' + this.constructor.name);
    }	

    //should be overridden by inheriting classes
    hideElements(booleanValue){
    	throw new Error('Not yet implemented for ' + this.constructor.name);
    }	
    
    hide(element, booleanValue){
    	element.style.display = booleanValue
				         			?'none'
				         			:null;
    }
   

    //we want to avoid hard coded strings to pass/identify properties
    //therefore a lambda expression is passed to identify the property
    //this method extracts the property name using introspection
	__extractPropertyNameFromLambdaExpression(expression){
		try{
			return expression.toString().split(".")[1];
		}catch(error){
			throw new Error("Could not determine property name to create binding from lambda expression '" + expression + "'")
		}
	}

	__addListenerToUpdatePropertyOnElementChanges(parentAtom, propertyName){				

		this.addEventListener('input', (event)=>{ 
			  var oldValue = parentAtom[propertyName];

			  var target = event.target;

			  var newInputValue
			  if(target instanceof TreezElement){
					newInputValue = target.getAttribute('value');
			  } else{
			  	newInputValue = target.value;
			  }

			 
			  var newValue = this.convertFromStringValue(newInputValue);						
			  if(newValue !== oldValue){
				parentAtom[propertyName] = newValue; 							     
			  }    	
		}); 					
	}

	__modifyPropertyToUpdateElementOnPropertyChanges(parentAtom, propertyName){

		let self = this;

		let propertyDescriptor = Object.getOwnPropertyDescriptor(parentAtom, propertyName);

		

		let privateValue = parentAtom[propertyName];
		

		Object.defineProperty(
		   parentAtom, 
		   propertyName, 
		   {
			get: __getPropertyValueProxy,
			set: __setPropertyValueProxy					
		   }
		);	
	

		function __getPropertyValueProxy(){
			let propertyAlreadyHasAGetter = propertyDescriptor && (propertyDescriptor.get !== undefined);
			if(propertyAlreadyHasAGetter){
				return propertyDescriptor.get();
			} else {
				return privateValue;
			}
		}

		function __setPropertyValueProxy(newValue){
			   
				let oldValue = privateValue;
				if(newValue != oldValue){
					let propertyAlreadyHasASetter = propertyDescriptor && (propertyDescriptor.set !== undefined);
					 if(propertyAlreadyHasASetter){
						propertyDescriptor.set(newValue);
					 } 
					 privateValue = newValue;
					 self.value = newValue;																		         
				}     
		}	

				
	}

	attributeChangedCallback(attr, oldStringValue, newStringValue) {
         if(attr==='value'){                      	                		
			if(newStringValue!==oldStringValue){
				var newValue = this.convertFromStringValue(newStringValue);
				this.updateElements(newValue);							
				//this.__dispatchInputEvent(); //caused issue for checkbox mayby enable for other components?
			}
         }    

         if(attr==='disabled'){                      	                		
			if(newStringValue!==oldStringValue){	
				var newValue = !(newStringValue === null);
				this.disableElements(newValue);
			}
         }  

          if(attr==='hidden'){                      	                		
			if(newStringValue!==oldStringValue){	
				var newValue = !(newStringValue === null);
				this.hideElements(newValue);							
			}
         }                   
    }

			

	__dispatchInputEvent(){
		var event = new Event(
							  'input', 
							  {
								'bubbles': true,
								'cancelable': true
							  }
							 );
		this.dispatchEvent(event);
	}

	disconnectedCallback(){
		while (this.firstChild) {
			this.removeChild(this.firstChild);
		}
	}

}