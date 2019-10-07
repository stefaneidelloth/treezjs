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

* **value**: The current value, where '' represents true and null represents false. 

* **disabled**: Set to null to enable the combo box and set to any other value to disable the check box. 

* **hidden**: Set to null to show the combo box and set to any other value to hide the check box. 

* **width**: The total width of the check box. 

* **label**: The label text that is shown before the check box.

## JavaScript Attributes

* **value**: The current value as a boolean value. 

* **disabled**: The disabled state as a boolean value. 

* **hidden**: The hidden state as a boolean value.

* **width**: The css width as a string, e.g. '500px'.

* **label**: The label text that is shown before the check box as a string. 


----

[Color](../color/color.md)
