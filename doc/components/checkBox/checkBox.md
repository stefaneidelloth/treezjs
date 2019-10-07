[Components](../components.md)

----

# CheckBox
		
The CheckBox component is used to specify a boolean value (true or false). 
	
![](../../images/treez_check_box.png)
		
## Source code

[./src/components/checkBox/treezCheckBox.js](../../../src/components/checkBox/treezCheckBox.js)

## Test

[./test/components/checkBox/treezComboBox.test.js](../../../test/components/checkBox/treezComboBox.test.js)

## Demo

[./demo/components/checkBox/treezComboBoxDemo.html](../../../demo/components/checkBox/treezComboBoxDemo.html)

## Construction

```javascript
    ...
    sectionContent.append('treez-check-box')
		  .label('IsUsingBoost')		  
		  .value('true')		
		  .bindValue(this, () => this.isUsingBoost);	
   ...
```

## HTML String Attributes

* **value**: The current value 

* **disabled**: Set to null to enable the combo box and set to any other value to disable the combo box. 

* **hidden**: Set to null to show the combo box and set to any other value to hide the cobo box. 

* **width**: The total width of the combo box. 

* **label**: The label text that is shown before the combo box.

* **options**: The predefined options that can be selected, given as a comma separated string, e.g. 'foo,baa,qux'

----

[Color](../color/color.md)
