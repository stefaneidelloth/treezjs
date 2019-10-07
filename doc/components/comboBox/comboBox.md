[Components](../components.md)

----

# ComboBox
		
The ComboBox component is used to select an option (string) from a list of predefiend options. 
	
![](../../images/treez_combo_box.png)
		
## Source code

[./src/components/comboBox/treezComboBox.js](../../../src/components/comboBox/treezComboBox.js)

## Test

[./test/components/comboBox/treezComboBox.test.js](../../../test/components/comboBox/treezComboBox.test.js)

## Demo

[./demo/components/comboBox/treezComboBoxDemo.html](../../../demo/components/comboBox/treezComboBoxDemo.html)

## Construction

```javascript
    ...
    sectionContent.append('treez-combo-box')
		  .label('Mode')
		  .attr('options', 'C,D')
		  .value('D')
		  .onChange(() => this.showAndHideDependentComponents())
		  .bindValue(this, () => this.mode);	
   ...
```

## HTML String Attributes

* **value**: The current value 

* **disabled**: Set to null to enable the combo box and set to any other sring value to disable the combo box. 

* **hidden**: Set to null to show the combo box and set to any other string value to hide the cobo box. 

* **width**: The total css width of the combo box. 

* **label**: The label text that is shown before the combo box.

* **options**: The predefined options that can be selected, given as a comma separated string, e.g. 'C,D'

## JavaScript Attributes

* **value**: The current value as a string. 

* **disabled**: The disabled state as a boolean value. 

* **hidden**: The hidden state as a boolean value.

* **width**: The css width as a string, e.g. '500px'.

* **label**: The label text that is shown before the combo box as a string. 

* **options**: The predefined options that can be selected, given as a comma separated string, e.g. 'C,D'

----

[ErrorBarStyle](../errorBarStyle/errorBarStyle.md)
