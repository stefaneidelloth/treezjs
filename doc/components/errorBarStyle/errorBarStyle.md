[Components](../components.md)

----

# ErrorBarStyle
		
The ErrorBarStyle component allows to select the style for error bars in a plot. 
	
![](../../images/treezErrorBarStyle.png)

The enum [./src/components/errorBarStyle/errorBarStyle.js](../../../src/components/errorBarStyle/errorBarStyle.js) provides 
predefined style options, that are used with the JavaScript attribute 'value' (also see below). 


* ![](../../../src/components/errorBarStyle/bar.png) ErrorBarStyle.bar

* ![](../../../src/components/errorBarStyle/barbox.png) ErrorBarStyle.barBox  

* ![](../../../src/components/errorBarStyle/barcurve.png) ErrorBarStyle.barCurve  

* ![](../../../src/components/errorBarStyle/bardiamond.png) ErrorBarStyle.barDiamond  

* ![](../../../src/components/errorBarStyle/barends.png) ErrorBarStyle.barEnds  

* ![](../../../src/components/errorBarStyle/box.png) ErrorBarStyle.box  

* ![](../../../src/components/errorBarStyle/boxfill.png) ErrorBarStyle.boxFill  

* ![](../../../src/components/errorBarStyle/curve.png) ErrorBarStyle.curve  

* ![](../../../src/components/errorBarStyle/diamond.png) ErrorBarStyle.diamond  

* ![](../../../src/components/errorBarStyle/diamondfill.png) ErrorBarStyle.diamondFill  

* ![](../../../src/components/errorBarStyle/fillhorz.png) ErrorBarStyle.fillHorz  

* ![](../../../src/components/errorBarStyle/fillvert.png) ErrorBarStyle.fillVert  

* ![](../../../src/components/errorBarStyle/linehorz.png) ErrorBarStyle.lineHorz  

* ![](../../../src/components/errorBarStyle/linehorzbar.png) ErrorBarStyle.lineHorzBar

* ![](../../../src/components/errorBarStyle/linevert.png) ErrorBarStyle.lineVert

* ![](../../../src/components/errorBarStyle/linevertbar.png) ErrorBarStyle.lineVertBar

		
## Source code

[./src/components/errorBarStyle/treezErrorBarStyle.js](../../../src/components/errorBarStyle/treezErrorBarStyle.js)

## Test

[./test/components/errorBarStyle/treezErrorBarStyle.test.js](../../../test/components/errorBarStyle/treezErrorBarStyle.test.js)

## Demo

[./demo/components/errorBarStyle/treezErrorBarStyleDemo.html](../../../demo/components/errorBarStyle/treezErrorBarStyleDemo.html)

## Construction

```javascript
    ...
    sectionContent.append('treez-error-bar-style')
		  .label('Error bar style:')		  
		  .value('box')		
		  .bindValue(this, () => this.errorBarStyle);	
   ...
```

## JavaScript Attributes

### value

Returns the current error bar style as enum value. 
In order to set the value, you can either use an enum value or a string value (= name of ErrorBarStyle). 

### Inherited attributes

Also see the attributes that are inherited from [LabeledTreezElement](../labeledTreezElement.md#value).


## HTML String Attributes

### value

The name of the ErrorBarStyle.

### Inherited attributes

Also see the attributes that are inherited from [LabeledTreezElement](../labeledTreezElement.md#value).


----

[FileOrDirectoryPath](../file/fileOrDirectoryPath.md)
