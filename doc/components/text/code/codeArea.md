[Components](../components.md)

----

# CodeArea
		
The CodeArea allows to edit some source code. 
	
![](../../images/treez_code_area.png)
		
## Source code

[./src/components/text/code/treezCodeArea.js](../../../src/components/text/code/treezCodeArea.js)

## Test

[./test/components/text/code/treezCodeArea.test.js](../../../test/components/text/code/treezCodeArea.test.js)

## Demo

[./demo/components/text/code/treezCodeAreaDemo.html](../../../demo/components/text/code/treezCodeAreaDemo.html)

## Construction

```javascript
    ...
    sectionContent.append('treez-code-area')
		  .label('')		  
		  .value('')		
		  .bindValue(this, () => this.code);	
   ...
```

## JavaScript Attributes

### value

The current value as a boolean value. 

### disabled

The disabled state as a boolean value. 

### hidden

The hidden state as a boolean value.

### width

The total css width as a string, e.g. '500px'.

### label

The label text that is shown before the check box as a string.

## HTML String Attributes

### value

Represents the current value. If you want to specify **false**:

* Do not specify the 'value' attribute in the html tag 'treez-check-box'.

* Use element.setAttribute('value',null)

If you want to specify **true**:

* Set the 'value' attribute in the html tag 'treez-check-box' to any value (e.g. value = '' or value = null or value = 'true' or value = 'False'). Only the existance matters.

* Use element.setAttribute('value','') (or set it to any other value that is not equal to null). 

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

[Color](../../color/Color.md)
