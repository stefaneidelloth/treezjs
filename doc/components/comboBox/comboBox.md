[Components](../components.md)

----

# ComboBox
		
The ComboBox component is used to select some option from a list of predefiend options. 
	
![](../../../images/treez_combo_box.png)
		
## Source code

[./src/components/comboBox/comboBox.js](../../../../src/components/comboBox/comboBox.js)

## Construction

```javascript
    ...
    sectionContent.append('treez-combo-box')
		  .label('Mode')
		  .options('foo,baa,qux')
		  .onChange(()=> this.showAndHideDependentComponents())
		  .bindValue(this, ()=>this.mode);	
   ...
```

----

[CheckBox](../checkBox/checkBox.md)
