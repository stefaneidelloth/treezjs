[Components](../components.md)

----

# LineStyle
		
The LineStyle component allows to select the style for lines in a plot. 
	
![](../../images/treez_line_style.png)

The enum [./src/components/lineStyle/lineStyle.js](../../../src/components/lineStyle/lineStyle.js) provides 
predefined style options, that are used with the JavaScript attribute 'value' (also see below). 

* ![](../../../src/components/lineStyle/none.png) LineStyle.none

* ![](../../../src/components/lineStyle/solid.png) LineStyle.solid

* ![](../../../src/components/lineStyle/dashed.png) 	LineStyle.dashed

* ![](../../../src/components/lineStyle/dotted.png) 	LineStyle.dotted

* ![](../../../src/components/lineStyle/dash-dot.png) 	LineStyle.dashDot

* ![](../../../src/components/lineStyle/dash-dot-dot.png) 	LineStyle.dashDotDot

* ![](../../../src/components/lineStyle/dotted-fine.png) 	LineStyle.dottedFine

* ![](../../../src/components/lineStyle/dashed-fine.png) 	LineStyle.dashedFine   

* ![](../../../src/components/lineStyle/dash-dot-fine.png) 	LineStyle.dashDotFine

* ![](../../../src/components/lineStyle/dot1.png) 	LineStyle.dot1

* ![](../../../src/components/lineStyle/dot2.png) 	LineStyle.dot2

* ![](../../../src/components/lineStyle/dot3.png) 	LineStyle.dot3

* ![](../../../src/components/lineStyle/dot4.png) 	LineStyle.dot4

* ![](../../../src/components/lineStyle/dash1.png) 	LineStyle.dash1

* ![](../../../src/components/lineStyle/dash2.png) 	LineStyle.dash2

* ![](../../../src/components/lineStyle/dash3.png) LineStyle.dash3

* ![](../../../src/components/lineStyle/dash4.png) LineStyle.dash4

* ![](../../../src/components/lineStyle/dash5.png) LineStyle.dash5

* ![](../../../src/components/lineStyle/dash-dot1.png) LineStyle.dashDot1

* ![](../../../src/components/lineStyle/dash-dot2.png) LineStyle.dashDot2

* ![](../../../src/components/lineStyle/dash-dot3.png) LineStyle.dashDot3
		
## Source code

[./src/components/lineStyle/treezLineStyle.js](../../../src/components/lineStyle/treezLineStyle.js)

## Test

[./test/components/lineStyle/treezLineStyle.test.js](../../../test/components/lineStyle/treezLineStyle.test.js)

## Demo

[./demo/components/lineStyle/treezLineStyleDemo.html](../../../demo/components/lineStyle/treezLineStyleDemo.html)

## Construction

```javascript
    ...
    sectionContent.append('treez-line-style')
		  .label('Line style:')		  
		  .value('solid')		
		  .bindValue(this, () => this.lineStyle);	
   ...
```

## JavaScript Attributes

### value

Returns the current line style as enum value. 
In order to set the value, you can either use an enum value or a string value (= name of LineStyle). 

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

The name of the LineStyle.

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

[StringList](../list/stringList.md)
