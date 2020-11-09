import ComponentAtom from './../../core/component/componentAtom.js';
import Length from './length.js';
import LineStyle from './../../components/lineStyle/lineStyle.js';



export default class GraphicsAtom extends ComponentAtom {
   
	constructor(name) {		
		super(name);			
	}

	static create(parent){
		var atom = ComponentAtom.__createAtom(this);
		atom.parent=parent;
		return atom;
	}	
	
	bindNameToId(selection) {
		selection.attr("id", name);
		addNameModificationListener((newName) => selection.attr("id", newName));
	}
	
	handleMouseClick(dTreez) {
		dTreez.event.preventDefault();		
		this.parent.__treeView.setFocus(this.parent);	
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

	bindInteger(lambdaExpressionEncodingPropertyToBind, selection, attributeName){	
	    var valueConverter = number => '' + number;	    	
		this.__bind(lambdaExpressionEncodingPropertyToBind, selection, attributeName, valueConverter);		
	}

	bindDouble(lambdaExpressionEncodingPropertyToBind, selection, attributeName){	
	    var valueConverter = number => '' + number;	    	
		this.__bind(lambdaExpressionEncodingPropertyToBind, selection, attributeName, valueConverter);		
	}

	bindColor(lambdaExpressionEncodingPropertyToBind, selection, attributeName){	
	    var valueConverter = color=>color.hexString;	
		this.__bind(lambdaExpressionEncodingPropertyToBind, selection, attributeName, valueConverter);		
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
		var valueConverter = lineStyle => {
			if(lineStyle instanceof LineStyle){
				return lineStyle.dashArrayString;
			}
			return LineStyle.forName(lineStyle).dashArrayString;
		}		
		this.__bind(lambdaExpressionEncodingPropertyToBind, selection, 'stroke-dasharray', valueConverter);
	}
	
	bindLineTransparency(lambdaExpressionEncodingPropertyToBind, selection){		
		var valueConverter = valueString => {
			var transparency = parseFloat(valueString);
			return '' + (1-transparency);					
		}		
		this.__bind(lambdaExpressionEncodingPropertyToBind, selection, 'stroke-opacity', valueConverter);
	}

	bindBooleanToDisplay(lambdaExpressionEncodingPropertyToBind, selection){
		var valueConverter = value => {
			return value
				?'inline'
				:'none';			
		}		
		this.__bind(lambdaExpressionEncodingPropertyToBind, selection, 'display', valueConverter);
	}
	
	bindBooleanToNegatingDisplay(lambdaExpressionEncodingPropertyToBind, selection){
		var valueConverter = value => {
			return value
				?'none'
				:'inline';			
		}		
		this.__bind(lambdaExpressionEncodingPropertyToBind, selection, 'display', valueConverter);
	}
	
	bindBooleanToTransparency(lambdaExpressionEncodingHideProperty, lambdaExpressionEncodingTransparencyProperty, selection){
		
		var hidePropertyName = this.__extractPropertyNameFromLambdaExpression(lambdaExpressionEncodingHideProperty);
		
		var transparencyPropertyName = lambdaExpressionEncodingTransparencyProperty
											?this.__extractPropertyNameFromLambdaExpression(lambdaExpressionEncodingTransparencyProperty)
											:null;
		
		var self = this;
		var valueConverter = () => {
			
			var isHidden = self[hidePropertyName];	
			
			if (isHidden) {
				return '0';
			} else {
				if(transparencyPropertyName){
					var transparency = parseFloat(self[transparencyPropertyName]);
					var opacity = 1 - transparency;
					return '' + opacity;
				} else {
					return '1';
				}				
			}					
		}	
		
		this.__modifyPropertyToUpdateSelectionOnPropertyChanges(hidePropertyName, selection, 'fill-opacity', valueConverter);	
		this.__modifyPropertyToUpdateSelectionOnPropertyChanges(transparencyPropertyName, selection, 'fill-opacity', valueConverter);		
		
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
	
	bindTransparency(lambdaExpressionEncodingTransparency, selection){
		var propertyName = this.__extractPropertyNameFromLambdaExpression(lambdaExpressionEncodingTransparency);

		var self = this;
		var valueConverter = (transparencyString) => {			
			var transparency = parseFloat(transparencyString);
			return '' + (1-transparency);						
		}	
		
		this.__modifyPropertyToUpdateSelectionOnPropertyChanges(propertyName, selection, 'fill-opacity', valueConverter);	
	}

	bindFontItalicStyle(lambdaExpressionEncodingItalicProperty, selection){
		var propertyName = this.__extractPropertyNameFromLambdaExpression(lambdaExpressionEncodingItalicProperty);
		
		var valueConverter = (isItalic) => {
			return isItalic
				?'italic'
				:'normal';							
		}	
		
		this.__modifyPropertyToUpdateSelectionOnPropertyChanges(propertyName, selection, 'font-style', valueConverter);	
	}

	

	bindFontBoldStyle(lambdaExpressionEncodingBoldProperty, selection){
		var propertyName = this.__extractPropertyNameFromLambdaExpression(lambdaExpressionEncodingBoldProperty);
			
		var valueConverter = (isBold) => {	
			return isBold
				?'bold'
				:'normal';							
		}	
		
		this.__modifyPropertyToUpdateSelectionOnPropertyChanges(propertyName, selection, 'font-weight', valueConverter);
	}

	bindFontUnderline(lambdaExpressionEncodingUnderlineProperty, selection){
		var propertyName = this.__extractPropertyNameFromLambdaExpression(lambdaExpressionEncodingUnderlineProperty);
				
		var valueConverter = (hasUnderline) => {
			return hasUnderline
				?'underline'
				:'none';							
		}	
		
		this.__modifyPropertyToUpdateSelectionOnPropertyChanges(propertyName, selection, 'text-decoration', valueConverter);	
	}
	
	bindRotation(lambdaExpressionEncodingRotationProperty, isHorizontal, selection){
		var propertyName = this.__extractPropertyNameFromLambdaExpression(lambdaExpressionEncodingRotationProperty);
				
		var valueConverter = (rotationString) => {				
			var rotation = 0;
			try {
				rotation = parseFloat(rotationString);
			} catch (error) {
				
			}
			if (!isHorizontal) {
				var extraVerticalRotation = 90;
				rotation += extraVerticalRotation;
			}
			return 'rotate(' + rotation + ')';						
		}	
		
		this.__modifyPropertyToUpdateSelectionOnPropertyChanges(propertyName, selection, 'transform', valueConverter);	
	}
	
	bindText(lambdaExpressionEncodingTextPropertyToBind, selection){		
				
		var propertyName = this.__extractPropertyNameFromLambdaExpression(lambdaExpressionEncodingTextPropertyToBind);
		
		var selectionModifier = (textValue)=>{
			selection.text(textValue);
		}
		
		this.__modifyPropertyToUpdateSelectionOnPropertyChanges(propertyName, selection, null, this.__trim, selectionModifier);	
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
		
		var propertyName;
		try{
			propertyName = expression.toString().split(".")[1];
		}catch(error){
			throw new Error("Could not determine property name to create binding from lambda expression '" + expression + "'")
		}
		
		if(!(propertyName in this)){
			throw new Error('Unknown property ' + propertyName);
		}

		return propertyName;
	}
	
	

	__modifyPropertyToUpdateSelectionOnPropertyChanges(propertyName, selection, attributeName, valueConverter, selectionModifier){

		let self = this;

		let propertyDescriptor = Object.getOwnPropertyDescriptor(this, propertyName);

		let privateValue = this[propertyName];

		Object.defineProperty(
		   this, 
		   propertyName, 
		   {
			get: __getPropertyValueProxy,
			set: __setPropertyValueProxy,
			configurable: true								
		   }
		);
		
		__updateSelection(privateValue);
	

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
					 __updateSelection(newValue);				
																         
				}     
		}	

		function __updateSelection(newValue){
			
			let convertedValue = valueConverter
				?valueConverter(newValue)
				:newValue;
			
			if(selectionModifier){
				selectionModifier(convertedValue)
			} else {
				selection.attr(attributeName, convertedValue);
			}	
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
					 listener(newValue);				
																         
				}     
		}	
	}
	

}
