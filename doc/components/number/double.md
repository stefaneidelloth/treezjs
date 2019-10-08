[Components](../components.md)

----

# Double
		
The Double component is used to specify a double number.  
	
![](../../images/treez_double.png)

Please note that the shown decimal separator might depend on the language settings of your browser. 
In order to avoid confusion, we recomment to use "English (United States)" in the language settings 
(e.g. Settings => Advanced => Languages => This language is used to display the Google Chrome UI). 
This way, the decimal separator of the Properties View of Treez is the same as the one used in the source
code of the Editor View.
		
## Source code

[./src/components/number/treezDouble.js](../../../src/components/number/treezDouble.js)

## Test

[./test/components/number/treezDouble.test.js](../../../test/components/number/treezDouble.test.js)

## Demo

[./demo/components/number/treezDoubleDemo.html](../../../demo/components/number/treezDoubleDemo.html)

## Construction

```javascript
    ...
    sectionContent.append('treez-double')
		  .label('Size')		
		  .value('2.5')		
		  .bindValue(this, () => this.foo);	
   ...
```

## JavaScript Attributes

### value

The current value as a number. 

### disabled

The disabled state as a boolean value. 

### hidden

The hidden state as a boolean value.

### width

The css width as a string, e.g. '500px'.

### label

The label text that is shown before the combo box as a string. 



## HTML String Attributes

### value

The current value as a string.

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

### label

The label text.




----

[DirectoryPath](../file/directoryPath.md)
