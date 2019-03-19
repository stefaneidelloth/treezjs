import ComponentAtom from './../../core/component/componentAtom.js';
import Length from './length.js';


export default class GraphicsAtom extends ComponentAtom {
   
	constructor(name) {		
		super(name);			
	}
	
	bindNameToId(selection) {
		selection.attr("id", name);
		addNameModificationListener((newName) => selection.attr("id", newName));
	}
	
	handleMouseClick() {		
		this.__treeView.setFocus(this);
	}
	
	addListenerAndRun(lambdaExpressionEncodingPropertyToBind, listener){
		this.addListener(lambdaExpressionEncodingPropertyToBind, listener);
		var propertyName = this.__extractPropertyNameFromLambdaExpression(lambdaExpressionEncodingPropertyToBind);
		listener(this[propertyName]);
	}
	
	addListener(lambdaExpressionEncodingPropertyToBind, listener){
		var propertyName = this.__extractPropertyNameFromLambdaExpression(lambdaExpressionEncodingPropertyToBind);
		this.__modifyPropertyToCallListenerOnPropertyChanges(propertyName, listener);		
	}
	
	bindString(lambdaExpressionEncodingPropertyToBind, selection, attributeName){		
		this.__bind(lambdaExpressionEncodingPropertyToBind, selection, attributeName, this.__trim);		
	}

	bindColor(lambdaExpressionEncodingPropertyToBind, selection, attributeName){	
	    var valueConverter = color=>color.hexString;	
		this.__bind(lambdaExpressionEncodingPropertyToBind, selection, attributeName, valueConverter);		
	}
	
	bindBooleanToNegatingDisplay(lambdaExpressionEncodingPropertyToBind, selection){
		var valueConverter = value => {
			return value
				?'none'
				:'inline';			
		}		
		this.__bind(lambdaExpressionEncodingPropertyToBind, selection, 'display', valueConverter);
	}
	
	bindTranslation(lambdaExpressionEncodingXTranslation, lambdaExpressionEncodingYTranslation, selection){
		
		var xPropertyName = this.__extractPropertyNameFromLambdaExpression(lambdaExpressionEncodingXTranslation);
		var yPropertyName = this.__extractPropertyNameFromLambdaExpression(lambdaExpressionEncodingYTranslation);		
				
		var self = this;
		var valueConverter = () => {			
			var xTranslation = self[xPropertyName];
			var yTranslation = self[yPropertyName];			
			
			var x = Length.toPx(xTranslation);
			var y = Length.toPx(yTranslation);
			return 'translate(' + x + ',' + y + ')';							
		}	
		
		this.__modifyPropertyToUpdateSelectionOnPropertyChanges(xPropertyName, selection, 'transform', valueConverter);	
		this.__modifyPropertyToUpdateSelectionOnPropertyChanges(yPropertyName, selection, 'transform', valueConverter);	
	}
	
	bindLineStyle(lambdaExpressionEncodingPropertyToBind, selection){		
		var valueConverter = lineStyle => lineStyle.dashArrayString;		
		this.__bind(lambdaExpressionEncodingPropertyToBind, selection, 'stroke-dasharray', valueConverter);
	}
	
	bindLineTransparency(lambdaExpressionEncodingPropertyToBind, selection){		
		var valueConverter = valueString => {
			var transparency = parseFloat(valueString);
			return '' + (1-transparency);					
		}		
		this.__bind(lambdaExpressionEncodingPropertyToBind, selection, 'stroke-opacity', valueConverter);
	}
	
	bindBooleanToLineTransparency(lambdaExpressionEncodingHideProperty, lambdaExpressionEncodingTransparencyProperty, selection){
				
		var hidePropertyName = this.__extractPropertyNameFromLambdaExpression(lambdaExpressionEncodingHideProperty);
		
		var transparencyPropertyName = this.__extractPropertyNameFromLambdaExpression(lambdaExpressionEncodingTransparencyProperty);
		
		var self = this;
		var valueConverter = () => {
			
			var isHidden = self[hidePropertyName];
			
			if(isHidden){
				return '0';
			}
			
			var transparency = parseFloat(self[transparencyPropertyName]);
			return '' + (1-transparency);					
		}	
		
		this.__modifyPropertyToUpdateSelectionOnPropertyChanges(hidePropertyName, selection, 'stroke-opacity', valueConverter);	
		this.__modifyPropertyToUpdateSelectionOnPropertyChanges(transparencyPropertyName, selection, 'stroke-opacity', valueConverter);		
		
	}
	
		
	__bind(lambdaExpressionEncodingPropertyToBind, selection, attributeName, valueConverter){		
		var propertyName = this.__extractPropertyNameFromLambdaExpression(lambdaExpressionEncodingPropertyToBind);
		this.__modifyPropertyToUpdateSelectionOnPropertyChanges(propertyName, selection, attributeName, valueConverter);			
	}
	
	__trim(value) {
		return value.toString().trim().replace(' ', ''); //e.g. '1 cm ' => '1cm'		
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

	__modifyPropertyToUpdateSelectionOnPropertyChanges(propertyName, selection, attributeName, valueConverter){

		let self = this;

		let propertyDescriptor = Object.getOwnPropertyDescriptor(this, propertyName);

		let privateValue = this[propertyName];

		Object.defineProperty(
		   this, 
		   propertyName, 
		   {
			get: __getPropertyValueProxy,
			set: __setPropertyValueProxy					
		   }
		);
		
		__updateSelection(privateValue);
	

		function __getPropertyValueProxy(){
			let propertyAlreadyHasAGetter = propertyDescriptor.get !== undefined;
			if(propertyAlreadyHasAGetter){
				return propertyDescriptor.get();
			} else {
				return privateValue;
			}
		}

		function __setPropertyValueProxy(newValue){
				let oldValue = privateValue;
				if(newValue != oldValue){
					let propertyAlreadyHasASetter = propertyDescriptor.set !== undefined;
					 if(propertyAlreadyHasASetter){
						propertyDescriptor.set(newValue);
					 } 
					 privateValue = newValue;
					 __updateSelection(newValue);				
																         
				}     
		}	

		function __updateSelection(newValue){
			let convertedValue = valueConverter
									?valueConverter(newValue)
									:newValue;
								
			selection.attr(attributeName, convertedValue);
			
		}			
	}
	
	__modifyPropertyToCallListenerOnPropertyChanges(propertyName, listener){
		let self = this;

		let propertyDescriptor = Object.getOwnPropertyDescriptor(this, propertyName);

		let privateValue = this[propertyName];

		Object.defineProperty(
		   this, 
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
					 listener(newValue);				
																         
				}     
		}	
	}
	

}
