[Components](../components.md)

----

# ImageComboBox
		
The ImageComboBox component is used to select an image from a list of predefiend images. 
	
![](../../images/treez_image_combo_box.png)
		
## Source code

[./src/components/imageComboBox/treezImageComboBox.js](../../../src/components/imageComboBox/treezImageComboBox.js)

## Test

[./test/components/imageComboBox/treezEnumComboBox.test.js](../../../test/components/imageComboBox/treezImageComboBox.test.js)

## Demo

[./demo/components/imageComboBox/treezImageComboBoxDemo.html](../../../demo/components/imageComboBox/treezImageComboBoxDemo.html)

## Construction

```javascript
    ...
    sectionContent.append('treez-image-combo-box')
		  .label('Hallo')
		  .nodeAttr('options', 'A,B,C')
		  .value('A')		
		  .bindValue(this, () => this.imageName);	
   ...
```

## JavaScript Attributes

### options

The enum class that provides the available options that can be selected.

### value

The current value (= selected option) as an enum value. 

### label

Some label text that is shown before the combo box as a string. 

### disabled

The disabled state as a boolean value. 

### hidden

The hidden state as a boolean value.

### width

The css width as a string, e.g. '500px'.

## HTML String Attributes

### options

The predefined options that can be selected, separated by comma, e.g. 'firstValue,secondValue'

### value

The current value string (=selected option). 

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

[ErrorBarStyle](../errorBarStyle/errorBarStyle.md)
