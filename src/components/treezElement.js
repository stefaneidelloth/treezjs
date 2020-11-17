import Utils from '../core/utils/utils.js';

export default class TreezElement extends HTMLElement {
	
	constructor(){
		super();	
		this.__parentAtom=undefined;
		this.__listeners = [];   
	} 
	
	static hide(element, booleanValue){
		if(booleanValue === undefined){
			throw Error('Please pass a boolean value as second argument of this method');
		}
    	element.style.display = booleanValue
				         			?'none'
				         			:null;
    }  

	static get observedAttributes() {
        return ['value', 'disabled', 'hidden', 'width'];
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

	handleDrop(event){
		event.preventDefault();
		var files = event.dataTransfer.files;
		if(files.length >0){
			var file = files[0];
			this.handleFileDrop(file); 
		}
	}

    
	async handleFileDrop(file){
        //can be overridden by inheriting atoms
	}
	
	//Should be overridden by inheriting classes.
	//This method is called after the string-html-attribute of the html element has been changed.
	//The passed argument "newValue" is the result of the method "convertFromString".
	//This method has to update the plain html element(s) of your custom html element.
	//This method must not set the javascript property 'value'.
	//(The javascript proeprty 'value' has to be considered when listening to element changes, not
	//when updating the elements.)
	updateElements(newValue){
		console.warn('updateElements is not yet implemented for ' + this.constructor.name);
	}
	
	//Can be overriden by inheriting classes
	//(This method is automatically called after the corresponding attribute has been changed
	//and should not be manually called. Also see method attributeChangedCallback)
	updateWidth(width){
		this.style.width = width;
    }	

	//Should be overridden by inheriting classes
	//(This method is automatically called after the corresponding attribute has been changed
	//and should not be manually called. Also see method attributeChangedCallback) 
	disableElements(booleanValue){
		if(booleanValue === undefined){
			throw Error('This method expects a boolean argument');
		}
		console.warn('disableElements is not yet implemented for ' + this.constructor.name);
	}

	//Should be overridden by inheriting classes
	//(This method is automatically called after the corresponding attribute has been changed
	//and should not be manually called. Also see method attributeChangedCallback) 
    hideElements(booleanValue){
		if(booleanValue === undefined){
			throw Error('This method expects a boolean argument');
		}
    	console.warn('hideElements is not yet implemented for ' + this.constructor.name);
    }	
		
	/*
	 * In order to understand the whole binding workflow, one has to consider four places
	 * where values are present:
	 * a) The string-html-attribute 'value' of our custom html element (always of type string!).
	 * b) The javascript property 'value' of our custom html element. That property is 
	 *    represented by a corresponding pair of getter and setter. The javascript property 
	 *    can be of any wanted type, for example string, boolean or array.
	 * c) The state of the plain html elements that are used to implement our custom html element,
	 *    for example the checked property of a check box. 
	 * d) Some (external) property that is bound to our custom html element. It's also possible
	 *    to bind several external properties to our custom html element.
	 *    
	 * If the string-html-attribute 'value' (a) is changed, the method 'attributeChangedCallback'
	 * is called. That already comes with the basic HTMLElement.
	 * Our implementation of the 'attributeChangedCalback' converts the string value with
	 * 'convertFromStringValue' and passes the converted value to 'updateElements' and
	 * '__updateExternalProperties'.
	 * The task of 'updateElements' is to update the state of the plain html elements that
	 * are used to implement our custom html element (c). You have to implement that method if you
	 * want to create a new custom html element.  
	 * The task of '__updateExternalProperties' is to update the binded external properties.
	 * 
	 * If you create a new custom html element you have to listen on changes of the plain html elements
	 * (c) and update the javascript property 'value' (b). 
	 * 
	 * When binding an external property (d), that property is modified to update the internal 
	 * javascript property 'value' (b). Furthermore, the propertiy is registered as a listener, 
	 * so that the method '__updateExternalProperties' is able to consider the external property.  
	 */

	bindValue(parentAtom, lambdaExpressionEncodingPropertyToBind){
		this.__parentAtom = parentAtom;
		
		let propertyName = TreezElement.__extractPropertyNameFromLambdaExpression(parentAtom, lambdaExpressionEncodingPropertyToBind);

		if(this.beforeConnectedCallbackHook){
			this.beforeConnectedCallbackHook(); //see lineStyle for an example use case; enum values have to be set before retrieving property value
		}

		this.value = parentAtom[propertyName];					

		this.__addListenerToUpdateExternalPropertyOnAttributeChanges(parentAtom, propertyName);

		this.__modifyExternalPropertyToUpdateValueOnPropertyChanges(parentAtom, propertyName);	
	}

	attributeChangedCallback(attr, oldStringValue, newStringValue) {
		if(attr==='value'){                      	                		
		   if(newStringValue !== oldStringValue){
		   	   
		   	   let oldValue = oldStringValue;
		   	   try{
		   	   		oldValue = this.convertFromStringValue(oldStringValue);
		   	   } catch(error){
		   	   }
		   	   	
			   let newValue = this.convertFromStringValue(newStringValue);
			   
			   this.updateElements(newValue);
			   this.__updateExternalProperties(newValue);
			   this.dispatchChangeEvent(oldValue, newValue); //required for customElementSelection.onChange( () => {..}) to work correctly
		   }
		}    

		if(attr==='disabled'){                      	                		
		   if(newStringValue!==oldStringValue){	
			   let newValue = !(newStringValue === null);
			   this.disableElements(newValue);
		   }
		}  

		if(attr==='hidden'){                      	                		
		   if(newStringValue!==oldStringValue){	
			   let newValue = !(newStringValue === null);
			   this.hideElements(newValue);							
		   }
		}   

		 if(attr==='width'){                      	                		
		   if(newStringValue!==oldStringValue){				
			   this.updateWidth(newStringValue);							
		   }
		}                 
   }		

   
   dispatchChangeEvent(oldValue, newValue){
	   let event = new CustomEvent(
							 'change', 
							 {
							   bubbles: true,
							   cancelable: true,
							   detail: {
							   		oldValue: oldValue,
							   		newValue: newValue
							   }
							 }
							);	  
	   this.dispatchEvent(event);
   }
   

   disconnectedCallback(){
	   while (this.firstChild) {
		   this.removeChild(this.firstChild);
	   }
   }

   uniqueId(){
		return Utils.uniqueId();
   }	
    
    __updateExternalProperties(newValue){
 	   for(let listener of this.__listeners){
 			listener.atom[listener.propertyName] = newValue;
 	   } 
 	}     

    //we want to avoid hard coded strings to pass/identify properties
    //therefore a lambda expression is passed to identify the property
    //this method extracts the property name using introspection
	static __extractPropertyNameFromLambdaExpression(parentAtom, expression){
		let propertyName = expression.toString().split(".").pop();
		if(propertyName.indexOf("=>")>-1){		
			throw new Error("Could not determine property name to create binding from lambda expression '" + expression + "'")
		}
		
		if(!(propertyName in parentAtom)){
			throw new Error('Unknown property "' + propertyName + '" of atom "' + parentAtom.name + '".');
		}

		return propertyName;
	}
	
	__addListenerToUpdateExternalPropertyOnAttributeChanges(parentAtomOfProperty, propertyName){	
    	this.__listeners.push({
    		atom: parentAtomOfProperty,
    		propertyName: propertyName
    	})						
	}   
	

	__modifyExternalPropertyToUpdateValueOnPropertyChanges(parentAtom, propertyName){

		let self = this;

		let propertyDescriptor = Object.getOwnPropertyDescriptor(parentAtom, propertyName);
		if(!propertyDescriptor){
			propertyDescriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(parentAtom), propertyName);
		}	
		
		if(propertyDescriptor){
			if(propertyDescriptor.set && (!propertyDescriptor.get)){
				throw Error('In order to bind a property it must not have a setter only. Please add a getter or remove the setter.');
			}
		}

		let privateValue = parentAtom[propertyName];

		Object.defineProperty(
		   parentAtom, 
		   propertyName, 
		   {
			get: __createPropertyValueGetProxy(),
			set: __createPropertyValueSetProxy(),
			configurable: true					
		   }
		);
	
		function __createPropertyValueGetProxy(){
			let propertyAlreadyHasAGetter = propertyDescriptor && (propertyDescriptor.get !== undefined);
			if(propertyAlreadyHasAGetter){
				return propertyDescriptor.get;
			} else {
				return () => privateValue;
			}
		}

		function __createPropertyValueSetProxy(){			   
			
			let propertyAlreadyHasASetter = propertyDescriptor && (propertyDescriptor.set !== undefined);
			if(propertyAlreadyHasASetter){
				return __createPropertyValueSetProxyForExistingSetter(propertyDescriptor.set);					 
			} else {
				return __createNewPropertyValueSetProxy();				
			}				

			function __createPropertyValueSetProxyForExistingSetter(setter){
				if(setter.subscribers){
					return __createPropertyValueSetProxyForExistingTreezSetter(setter);						
				} else {
					return __createPropertyValueSetProxyForExistingExternalSetter(setter);
				}			   
			}

			function __createPropertyValueSetProxyForExistingTreezSetter(setter){
				if(setter.subscribers.indexOf(self) > -1){
					//this element already has been binded to the atom; reuse existing setter
					return setter;
				} else {
					//another element already has been binded to the atom; create extended setter
					let setProxy = (newValue) => {
						let oldValue = privateValue;
						if(newValue != oldValue){							
							setter.call(parentAtom, newValue); //call is used because setter(newValue) would not work due to missing this context
							privateValue = newValue;
							self.value = newValue;
						} 
					 };
					 setProxy.subscribers = setter.subscribers.concat([self]);
					 return setProxy;
				}				
			}

			function __createPropertyValueSetProxyForExistingExternalSetter(setter){
				let setProxy = (newValue) => {
					let oldValue = privateValue;
					if(newValue != oldValue){
						setter.call(parentAtom, newValue);
						privateValue = newValue;
						self.value = newValue;
					}
				 };
				 setProxy.subscribers = [self];
				 return setProxy;
			}
			
			function __createNewPropertyValueSetProxy(){
				let setProxy = (newValue) => {
					let oldValue = privateValue;
					if(newValue != oldValue){						
						privateValue = newValue;
						self.value = newValue;
					}
				 };
				 setProxy.subscribers = [self];
				 return setProxy;
			}

		}		
				
	}

	
	
	//The purpose of the following properties is to 
	//translate html string attribute values to and from
	//values that can be of other types, e. g. boolean
	//
	//In html a boolen value is always represented by a string attribute.
	//The only way to represent false is to omit the value, e.g.
	//<input type='checkbox' >
	//vs.
	//<input type='checkbox' checked> or <input type='checkbox' checked='checked'>
	
	
    get value() {
	  let stringValue = this.getAttribute('value');
	  return this.convertFromStringValue(stringValue);
	}

	set value(value) {
	  let stringValue = this.convertToStringValue(value);
	  if(stringValue === null){
		  this.removeAttribute('value');
	  } else {
	  	this.setAttribute('value', stringValue);	  	
	  }
	}

	get disabled() {
		let stringValue = this.getAttribute('disabled')
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
		let stringValue = this.getAttribute('hidden')
	    return  !(stringValue === null);
	}

	set hidden(booleanValue) {
		if(booleanValue){
			this.setAttribute('hidden','')
		} else {
			this.removeAttribute('hidden');
		}	  
	}  

	get width(){
		return this.getAttribute('width');
	} 

	set width(value){
		this.setAttribute('width', value);
	}  

}