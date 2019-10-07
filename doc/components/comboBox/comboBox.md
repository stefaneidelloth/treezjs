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
		  .attr('options','foo,baa,qux')
		  .onChange(() => this.showAndHideDependentComponents())
		  .bindValue(this, () => this.mode);	
   ...
```

## HTML Attributes

* **value**: The current value 

* **disabled**: Set to null to enable the combo box and set to any other value to disable the combo box. 

* **hidden**: Set to null to show the combo box and set to any other value to hide the cobo box. 

* **width**: The total width of the combo box. 

* **label**: The label text that is shown before the combo box.

* **options**: The predefined options that can be selected, given as a comma separated string, e.g. 'foo,baa,qux'

----

[ErrorBarStyle](../errorBarStyle/errorBarStyle.md)
