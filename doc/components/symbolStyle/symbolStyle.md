[Components](../components.md)

----

# SymbolStyle
		
The SymbolStyle component allows to select the style for symbols in a plot. 
	
![](../../images/treez_symbol_style.png)

The enum [./src/components/symbolStyle/symbolStyle.js](../../../src/components/symbolStyle/symbolStyle.js) provides 
predefined style options, that are used with the JavaScript attribute 'value' (also see below). 

* ![](../../../src/components/symbolStyle/none.png) SymbolStyle.none  

* ![](../../../src/components/symbolStyle/circle.png) SymbolStyle.circle

* ![](../../../src/components/symbolStyle/cross.png) SymbolStyle.cross

* ![](../../../src/components/symbolStyle/diamond.png) SymbolStyle.diamond

* ![](../../../src/components/symbolStyle/square.png) SymbolStyle.square

* ![](../../../src/components/symbolStyle/star.png) SymbolStyle.star   

* ![](../../../src/components/symbolStyle/triangle.png) SymbolStyle.triangle

* ![](../../../src/components/symbolStyle/why.png) SymbolStyle.why
		
## Source code

[./src/components/symbolStyle/treezSymbolStyle.js](../../../src/components/symbolStyle/treezErrorBarStyle.js)

## Test

[./test/components/symbolStyle/treezSymbolStyle.test.js](../../../test/components/symbolStyle/treezSymbolStyle.test.js)

## Demo

[./demo/components/symbolStyle/treezSymbolStyleDemo.html](../../../demo/components/symbolStyle/treezSymbolStyleDemo.html)

## Construction

```javascript
    ...
    sectionContent.append('treez-symbol-style')
		  .label('Symbol style:')		  
		  .value('circle')		
		  .bindValue(this, () => this.symbolStyle);	
   ...
```

## JavaScript Attributes

### value

Returns the current symbol style as enum value. 
In order to set the value, you can either use an enum value or a string value (= name of SymbolStyle). 

### label

Some label text that is shown before the style combo box as a string. 

### disabled

The disabled state as a boolean value. 

### hidden

The hidden state as a boolean value.

### width

The total css width as a string, e.g. '500px'.



## HTML String Attributes

### value

The name of the SymbolStyle.

### label

Some label text.

### disabled

If you want to enable the component:

* Do not specify the 'disabled' attribute in the html tag

* Use element.setAttribute('disabled', null)) 

If you want to disable the component:

* Specify the 'disabled' attribute in the html tag, e.g. disabled = ''

* Use element.setAttribute('disabled','') or set it to any other value not equal to null. 

### hidden

If you want to show the component:

* Do not specify the 'hidden' attribute in the html tag

* Use element.setAttribute('hidden', null)) 

If you want to hide the component:

* Specify the 'hidden' attribute in the html tag, e.g. hidden = ''

* Use element.setAttribute('hidden','') or set it to any other value not equal to null. 

### width

The total css width of the component, e.g. '500px'


----

[TextArea](../text/area/textArea.md)
