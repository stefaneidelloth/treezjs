[Components](../components.md)

----

# ImageComboBox
		
The ImageComboBox component is used to select an image from a list of predefiend images. It serves as a parent class
for specific image combo box implementations (e.g. [ErrorBarStyle](../errorBarStyle/errorBarStyle.md)). 
	
![](../../images/treez_image_combo_box.png)

Please note that the corresponding image files have to be located in the same folder as the class file. Therefore, it does not make much sense to use the ImageComboBox directly. If you want to create a custom image combo box, you should create a new class in an extra folder and include some corresponding image files. 
		
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
		  .label('ImageComboBox:')
		  .attr('options', '["A","B","C"]')
		  .value('B')		
		  .bindValue(this, () => this.imageName);
   ...
```

## JavaScript Attributes

### options

A string array that contains the names of png images (without *.png ending) that can be selected, e.g. \['A','B','C'\]. The images have to be located in the same folder as the implementing class that inherits from TreezImageComboBox. 

### value

The name of the currently selected image (without *.png ending). 

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
The names of the png images (without *.png ending) that can be selected, given by a string that can be evaluated as array, e.g. '\["A","B","C"\]'. The images have to be located in the same folder as the implementing class that inherits from TreezImageComboBox. 

### value

The name of the currently selected image (without *.png ending). 

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

[Integer](../number/integer.md)
