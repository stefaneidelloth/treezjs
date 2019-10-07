[Components](../components.md)

----

# Color
		
The Color component allows to select a color. 
	
![](../../images/treez_color.png)
		
## Source code

[./src/components/color/treezColor.js](../../../src/components/color/treezColor.js)

## Test

[./test/components/color/treezColor.test.js](../../../test/components/color/treezColor.test.js)

## Demo

[./demo/components/color/treezColorDemo.html](../../../demo/components/color/treezColorDemo.html)

## Construction

```javascript
    ...
    sectionContent.append('treez-color')
		  .label('Color')		  
		  .value('blue')		
		  .bindValue(this, () => this.color);	
   ...
```

## HTML String Attributes

* **value**: The current collor value as hex string, e.g. '#' 

* **disabled**: Set to null to enable the component and set to any other value to disable the component. 

* **hidden**: Set to null to show the component and set to any other value to hide the component. 

* **width**: The total css width of the component. 

* **label**: The label text that is shown before the color.

## JavaScript Attributes

* **value**: The current value as a string. 

* **disabled**: The disabled state as a boolean value. 

* **hidden**: The hidden state as a boolean value.

* **width**: The total css width as a string, e.g. '500px'.

* **label**: The label text that is shown before the color as a string. 


----

[Color](../colorMap/colorMap.md)
