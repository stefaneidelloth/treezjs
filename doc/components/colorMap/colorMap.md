[Components](../components.md)

----

# ColorMap
		
The ColorMap component allows to select a colorMap from a list of colorMaps. 
	
![](../../images/treez_color_map.png)

The enum [./src/components/colorMap/colorMap.js](../../../src/components/colorMap/colorMap.js) provides some predefined colorMaps, that are used with the JavaScript attribute 'value' (also see below). 

ColorMap.blank => ![](../../../src/components/colorMap/blank.png)                 
ColorMap.blue => ![](../../../src/components/colorMap/blue.png)           
ColorMap.bluegreen => ![](../../../src/components/colorMap/bluegreen.png)               
ColorMap.bluegreenStep => ![](../../../src/components/colorMap/bluegreen-step.png)                
ColorMap.complement => ![](../../../src/components/colorMap/complement.png)                    
ColorMap.complementStep => ![](../../../src/components/colorMap/complement-step.png)                  
ColorMap.green => ![](../../../src/components/colorMap/green.png)            
ColorMap.grey => ![](../../../src/components/colorMap/grey.png)            
ColorMap.greyStep5 => ![](../../../src/components/colorMap/grey-step5.png)                
ColorMap.greyStep6 => ![](../../../src/components/colorMap/grey-tep6.png)                     
ColorMap.heat => ![](../../../src/components/colorMap/heat.png)                 
ColorMap.red => ![](../../../src/components/colorMap/red.png)    ;                    
ColorMap.rojal => ![](../../../src/components/colorMap/rojal.png)             
ColorMap.rojalStep => ![](../../../src/components/colorMap/rojal-step.png)                     
ColorMap.spectrum => ![](../../../src/components/colorMap/spectrum.png)                
ColorMap.spectrumStep => ![](../../../src/components/colorMap/spectrum-step.png)                        
ColorMap.spectrum2 => ![](../../../src/components/colorMap/spectrum2.png)                      
ColorMap.spectrum2Step => ![](../../../src/components/colorMap/spectrum2-step.png)                    
ColorMap.transblack => ![](../../../src/components/colorMap/transblack.png)          
ColorMap.transblackStep => ![](../../../src/components/colorMap/transblack-step.png)    

		
## Source code

[./src/components/colorMap/treezColorMap.js](../../../src/components/colorMap/treezColorMap.js)

## Test

[./test/components/colorMap/treezColorMap.test.js](../../../test/components/colorMap/treezColorMap.test.js)

## Demo

[./demo/components/colorMap/treezColorMapDemo.html](../../../demo/components/colorMap/treezColorMapDemo.html)

## Construction

```javascript
    ...
    sectionContent.append('treez-color-map')
		  .label('')		  
		  .value('blue')		
		  .bindValue(this, () => this.colorMap);	
   ...
```

## JavaScript Attributes

### value

Returns the current color as enum value. If the color does not belong to the predefined colors, an enum value with the name 'custom' (including the custom hex string) is returned. 

In orde to set the value, you can either use an enum value or a string value (including the hex code or the name of the color).  

### disabled

The disabled state as a boolean value. 

### hidden

The hidden state as a boolean value.

### width

The total css width as a string, e.g. '500px'.

### label

The label text that is shown before the color as a string. 

## HTML String Attributes

### value

In order to set the value, you can either use a hex string (e.g. value = '#0000ff') or the name of a predefined color, e.g. value = 'blue'.  

If you access the value with element.getAttribute('value'), the hex code of the color is returned as a string. 

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

[ColorMap](../colorMap/colorMap.md)
