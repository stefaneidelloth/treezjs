[Components](../components.md)

----

# Color
		
The Color component allows to select a color. Click on the color to open a color selection dialog.
	
![](../../images/treez_color.png)

The enum [./src/components/color/Color.js](../../../src/components/color/color.js) provides some predefined color values, 
that are used with the JavaScript attribute 'value' (also see below). 


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

* **value**: Returns the current color value as hex string, e.g. '#0000ff'. 'In order to set the value, you can either use a hex string or the name of a predefined color, e.g. 'blue'.  

* **disabled**: Set to null to enable the component and set to any other value to disable the component. 

* **hidden**: Set to null to show the component and set to any other value to hide the component. 

* **width**: The total css width of the component. 

* **label**: The label text that is shown before the color.

## JavaScript Attributes

* **value**: Returns the current color as enum value. If the color does not belong to the predefined, colors an enum value with the name 'custom' and a custom hex string is returned. In orde to set the value, you can either use an enum value or a string value (hex code or color name).  

* **disabled**: The disabled state as a boolean value. 

* **hidden**: The hidden state as a boolean value.

* **width**: The total css width as a string, e.g. '500px'.

* **label**: The label text that is shown before the color as a string. 


----

[Color](../colorMap/colorMap.md)
