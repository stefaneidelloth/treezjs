[Components](../components.md)

----

# ComboBox
		
The ComboBox component is used to select an option (string) from a list of predefiend options. 
	
![](../../images/treez_combo_box.png)
		
## Source code

[./src/components/comboBox/comboBox.js](../../../src/components/comboBox/treezComboBox.js)

## Test

[./test/components/comboBox/comboBoxTest.js](../../../test/components/comboBox/treezComboBoxTest.js)

## Demo

[./demo/components/comboBox/comboBoxDemo.js](../../../demo/components/comboBox/treezComboBoxDemo.js)



## Construction

```javascript
    ...
    sectionContent.append('treez-combo-box')
		  .label('Mode')
		  .attr('options','foo,baa,qux')
		  .onChange(()=> this.showAndHideDependentComponents())
		  .bindValue(this, ()=>this.mode);	
   ...
```

----

[CheckBox](../checkBox/checkBox.md)
