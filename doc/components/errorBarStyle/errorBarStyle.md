[Components](../components.md)

----

# ErrorBarStyle
		
The ErrorBarStyle component allows to select the style for error bars in a plot. 
	
![](../../images/treez_error_bar_style.png)

The enum [./src/components/errorBarStyle/errorBarStyle.js](../../../src/components/errorBarStyle/errorBarStyle.js) provides 
predefined style options, that are used with the JavaScript attribute 'value' (also see below). 


ErrorBarStyle.bar = new ErrorBarStyle('bar');                    
ErrorBarStyle.barBox = new ErrorBarStyle('barbox');                    
ErrorBarStyle.barCurve = new ErrorBarStyle('barcurve');                    
ErrorBarStyle.barDiamond = new ErrorBarStyle('bardiamond');                    
ErrorBarStyle.barEnds = new ErrorBarStyle('barends');                    
ErrorBarStyle.box = new ErrorBarStyle('box');                    
ErrorBarStyle.boxFill = new ErrorBarStyle('boxfill');                    
ErrorBarStyle.curve = new ErrorBarStyle('curve');                    
ErrorBarStyle.diamond = new ErrorBarStyle('diamond');                    
ErrorBarStyle.diamondFill = new ErrorBarStyle('diamondfill');                    
ErrorBarStyle.fillHorz = new ErrorBarStyle('fillhorz');                    
ErrorBarStyle.fillVert = new ErrorBarStyle('fillvert');                    
ErrorBarStyle.lineHorz = new ErrorBarStyle('linehorz');                    
ErrorBarStyle.lineHorzBar = new ErrorBarStyle('linehorzbar');                    
ErrorBarStyle.lineVert = new ErrorBarStyle('linevert');                    
ErrorBarStyle.lineVertBar = new ErrorBarStyle('linevertbar');  

		
## Source code

[./src/components/errorBarStyle/errorBarStyle.js](../../../src/components/errorBarStyle/treezErrorBarStyle.js)

## Test

[./test/components/errorBarStyle/errorBarStyle.test.js](../../../test/components/errorBarStyle/treezErrorBarStyle.test.js)

## Demo

[./demo/components/errorBarStyle/treezErrorBarStyleDemo.html](../../../demo/components/errorBarStyle/treezErrorBarStyleDemo.html)

## Construction

```javascript
    ...
    sectionContent.append('treez-error-bar-style')
		  .label('Style')		  
		  .value('diamond')		
		  .bindValue(this, () => this.errorBarStyle);	
   ...
```

## JavaScript Attributes

### value

Returns the current error bar style as enum value. 
In order to set the value, you can either use an enum value or a string value (= name of ErrorBarStyle).  

### disabled

The disabled state as a boolean value. 

### hidden

The hidden state as a boolean value.

### width

The total css width as a string, e.g. '500px'.

### label

The label text that is shown before the style as a string. 

## HTML String Attributes

### value

The name of the ErrorBarStyle.

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

### label

The label text.


----

[FileOrDirectoryPath](../file/fileOrDirectoryPath.md)
