[Components](../components.md)

----

# Color
		
The Color component allows to select a color. Click on the color to open a color section dialog.
	
![](../../images/treez_color.png)

The enum [./src/components/color/Color.js](../../../src/components/color/color.js) provides some predefined color values:

```javascript
Color.black => '#000000'
Color.blue => '#0000ff'
Color.cyan => '#00ffff'
Color.darkblue => '#00008b'
Color.darkcyan => '#008b8b' 
Color.darkgreen => '#006400'
Color.darkmagenta => '#8b008b'
Color.darkred => '#8b0000'
Color.green => '#008000'
Color.grey => '#808080'
Color.magenta => '#ff00ff'
Color.red => '#ff0000'
Color.white => '#ffffff'
Color.yellow => '#ffff00'
```
		
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
