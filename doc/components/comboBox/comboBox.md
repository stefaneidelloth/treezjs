[Components](../components.md)

----

# ComboBox
		
The ComboBox component is used to select some option from a list of predefiend options. 
	
![](../../../images/treez_combo_box.png)
		
## Source code

[./src/components/comboBox/comboBox.js](../../../../src/components/comboBox/comboBox.js)

## Construction
		
A new ComboBox is created either by: 

* document.createElement('treez-combo-box)
* calling the corresponding factory method of the ![](../../../../icons/models.png) [Models](../models.md) atom in the source code of the [Editor view](../../../views/editorView.md):

```javascript
    ...
    sectionContent.append('treez-combo-box')
			.label('Mode')
			.options('foo,baa,qux')
			.onChange(()=> this.showAndHideDependentComponents())
			.bindValue(this, ()=>this.mode);	    
```

----

[CheckBox](../checkBox/checkBox.md)
