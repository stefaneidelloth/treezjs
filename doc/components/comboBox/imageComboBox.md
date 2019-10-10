[Components](../components.md)

----

# ImageComboBox
		
The ImageComboBox component is used to select an image from a list of predefiend images. It serves as a parent class
for specific image combo box implementations (e.g. [ErrorBarStyle](../errorBarStyle/errorBarStyle.md)). 
	
![](../../images/treezImageComboBox.png)

Please note that the corresponding image files have to be located in the same folder as the class file. Therefore, it does not make much sense to use the ImageComboBox directly. If you want to create a custom image combo box, you should create a new class in an extra folder and include some corresponding image files. 
		
## Source code

[./src/components/comboBox/treezImageComboBox.js](../../../src/components/comboBox/treezImageComboBox.js)

## Test

[./test/components/comboBox/treezEnumComboBox.test.js](../../../test/components/comboBox/treezImageComboBox.test.js)

## Demo

[./demo/components/comboBox/treezImageComboBoxDemo.html](../../../demo/components/comboBox/treezImageComboBoxDemo.html)

## Construction

```javascript
    ...
    sectionContent.append('treez-image-combo-box')
		  .label('Image combo box:')
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

### Inherited attributes

Also see the attributes that are inherited from [LabeledTreezElement](../labeledTreezElement.md#value).

## HTML String Attributes

### options
The names of the png images (without *.png ending) that can be selected, given by a string that can be evaluated as array, e.g. '\["A","B","C"\]'. The images have to be located in the same folder as the implementing class that inherits from TreezImageComboBox. 

### value

The name of the currently selected image (without *.png ending). 

### Inherited attributes

Also see the attributes that are inherited from [LabeledTreezElement](../labeledTreezElement.md#value-1).


----

[Integer](../number/integer.md)
