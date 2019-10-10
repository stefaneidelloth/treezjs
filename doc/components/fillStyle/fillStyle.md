[Components](../components.md)

----

# FillStyle
		
The FillStyle component allows to select the style for fills in a plot. 
	
![](../../images/treezFillStyle.png)

The enum [./src/components/fillStyle/fillStyle.js](../../../src/components/fillStyle/fillStyle.js) provides 
predefined style options, that are used with the JavaScript attribute 'value' (also see below). 


* ![](../../../src/components/fillStyle/solid.png) FillStyle.solid

* ![](../../../src/components/fillStyle/vertical.png) FillStyle.vertical  

* ![](../../../src/components/fillStyle/horizontal.png) FillStyle.horizontal  

* ![](../../../src/components/fillStyle/cross.png) FillStyle.cross  
		
## Source code

[./src/components/fillStyle/treezFillStyle.js](../../../src/components/fillStyle/treezErrorBarStyle.js)

## Test

[./test/components/fillStyle/treezFillStyle.test.js](../../../test/components/fillStyle/treezFillStyle.test.js)

## Demo

[./demo/components/fillStyle/treezFillStyleDemo.html](../../../demo/components/fillStyle/treezFillStyleDemo.html)

## Construction

```javascript
    ...
    sectionContent.append('treez-fill-style')
		  .label('Fill style:')		  
		  .value('solid')		
		  .bindValue(this, () => this.fillStyle);	
   ...
```

## JavaScript Attributes

### value

Returns the current fill style as enum value. 
In order to set the value, you can either use an enum value or a string value (= name of FillStyle). 

### Inherited attributes

Also see the attributes that are inherited from [LabeledTreezElement](../labeledTreezElement.md#value).



## HTML String Attributes

### value

The name of the FillStyle.

### Inherited attributes

Also see the attributes that are inherited from [LabeledTreezElement](../labeledTreezElement.md#value-1).

----

[Font](../font/font.md)
