[Components](../components.md)

----

# CheckBox
		
The CheckBox represents a boolean value (true or false). 
	
![](../../images/treez_check_box.png)
		
## Source code

[./src/components/checkBox/treezCheckBox.js](../../../src/components/checkBox/treezCheckBox.js)

## Test

[./test/components/checkBox/treezCheckBox.test.js](../../../test/components/checkBox/treezCheckBox.test.js)

## Demo

[./demo/components/checkBox/treezCheckBoxDemo.html](../../../demo/components/checkBox/treezCheckBoxDemo.html)

## Construction

```javascript
    ...
    sectionContent.append('treez-check-box')
		  .label('Hallo')		  
		  .value('')		
		  .bindValue(this, () => this.isUsingBoost);	
   ...
```

## HTML String Attributes

* **value**: Represents the current value. If you want to specify false:

** Do not specify the 'value' attribute in the html tag 'treez-check-box' or
** Use element.setAttribute('value',null)

If you want to specify true:
** Set the 'value' attribute in the html tag 'treez-check-box' to any value (e.g. value = '' or value = null or value = 'true' or value = 'False'). Only the existance matters.
** Use element.setAttribute('value','') (or set it to any other value that is not equal to null). 

* **disabled**: Do not specify the 'disabled' attribute (or use element.setAttribute('disabled', null)) to enable the check box and set to any other value to disable the check box. 

* **hidden**: Do not specifiy the 'hidden' atttribute (or use element.setAttribute('hidden', null) to show the check box and set to any other value to hide the check box. 

* **width**: The total css width of the check box. 

* **label**: The label text that is shown before the check box.

## JavaScript Attributes

* **value**: The current value as a boolean value. 

* **disabled**: The disabled state as a boolean value. 

* **hidden**: The hidden state as a boolean value.

* **width**: The total css width as a string, e.g. '500px'.

* **label**: The label text that is shown before the check box as a string. 


----

[Color](../color/color.md)
