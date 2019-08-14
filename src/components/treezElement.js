export default class TreezElement extends HTMLElement {
	
	constructor(){
		super();	
		this.__parentAtom=undefined;
		this.__listeners = [];   
	} 
	
	static hide(element, booleanValue){
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
	
	//can be overriden by inheriting classes
    updateWidth(width){
		this.style.width = width + ' !important';
    }	

    //should be overridden by inheriting classes
    disableElements(booleanValue){
    	throw new Error('Not yet implemented for ' + this.constructor.name);
    }	

    //should be overridden by inheriting classes
    hideElements(booleanValue){
    	throw new Error('Not yet implemented for ' + this.constructor.name);
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
		
		var propertyName = this.__extractPropertyNameFromLambdaExpression(parentAtom, lambdaExpressionEncodingPropertyToBind)

		this.value = parentAtom[propertyName];					

		this.__addListenerToUpdateExternalPropertyOnAttributeChanges(parentAtom, propertyName);

		this.__modifyExternalPropertyToUpdateValueOnPropertyChanges(parentAtom, propertyName);	
	}

	attributeChangedCallback(attr, oldStringValue, newStringValue) {
		if(attr==='value'){                      	                		
		   if(newStringValue!==oldStringValue){
			   var newValue = this.convertFromStringValue(newStringValue);
			   this.updateElements(newValue);
			   this.__updateExternalProperties(newValue);
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

		 if(attr==='width'){                      	                		
		   if(newStringValue!==oldStringValue){				
			   this.updateWidth(newStringValue);							
		   }
		}                 
   }		

   
   dispatchChangeEvent(){
	   var event = new Event(
							 'change', 
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

	
    
    __updateExternalProperties(newValue){
 	   for(var listener of this.__listeners){
 			listener.atom[listener.propertyName] = newValue;
 	   } 
 	}     

    //we want to avoid hard coded strings to pass/identify properties
    //therefore a lambda expression is passed to identify the property
    //this method extracts the property name using introspection
	__extractPropertyNameFromLambdaExpression(parentAtom, expression){
		var propertyName;
		try{
			propertyName = expression.toString().split(".")[1];
		}catch(error){
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

		let privateValue = parentAtom[propertyName];

		Object.defineProperty(
		   parentAtom, 
		   propertyName, 
		   {
			get: __getPropertyValueProxy,
			set: __setPropertyValueProxy,
			configurable: true					
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

	get width(){
		return this.getAttribute('width');
	} 

	set width(value){
		this.setAttribute('width', value);
	}  

}