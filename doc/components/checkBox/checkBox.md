[Components](../components.md)

----

# CheckBox
		
The CheckBox represents a boolean value (**true** or **false**). 
	
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

## JavaScript Attributes

* **value**: The current value as a boolean value. 

* **disabled**: The disabled state as a boolean value. 

* **hidden**: The hidden state as a boolean value.

* **width**: The total css width as a string, e.g. '500px'.

* **label**: The label text that is shown before the check box as a string.

## HTML String Attributes

### value

Represents the current value. If you want to specify **false**:

* Do not specify the 'value' attribute in the html tag 'treez-check-box'.

* Use element.setAttribute('value',null)

If you want to specify **true**:

* Set the 'value' attribute in the html tag 'treez-check-box' to any value (e.g. value = '' or value = null or value = 'true' or value = 'False'). Only the existance matters.

* Use element.setAttribute('value','') (or set it to any other value that is not equal to null). 

### disabled

If you want to enable the check box:

* Do not specify the 'disabled' attribute in the html tag

* Use element.setAttribute('disabled', null)) 

If you want to disable the check box:

* Specify the 'disabled' attribute in the html tag, e.g. disabled = ''

* Use element.setAttribute('disabled','') or set it to any other value not equal to null. 

### hidden

If you want to show the check box:

* Do not specify the 'hidden' attribute in the html tag

* Use element.setAttribute('hidden', null)) 

If you want to hide the check box:

* Specify the 'hidden' attribute in the html tag, e.g. hidden = ''

* Use element.setAttribute('hidden','') or set it to any other value not equal to null. 

* **width**: The total css width of the check box, e.g. '500px'

* **label**: The label text that is shown before the check box.

 


----

[Color](../color/color.md)
