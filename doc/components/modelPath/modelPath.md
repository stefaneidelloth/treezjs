[Components](../components.md)

----

# ModelPath
		
The ModelPath component allows to select atoms from the tree model, fulfilling certain criteria.  
	
![](../../images/treezModelPath.png)

The criteria for the available atoms (whose tree paths are shown in the combo box menu) might be:

* the class of the atoms must inherit from a certain super class (e.g. show all model atoms) 
* the class of the atoms must fullfill e certain interface (= must provide certain methods)

Furthermore, the found atoms can be confined with a custom filter method. 
		
## Source code

[./src/components/modelPath/treezModelPath.js](../../../src/components/modelPath/treezModelPath.js)

## Test

[./test/components/modelPath/treezModelPath.test.js](../../../test/components/modelPath/treezModelPath.test.js)

## Demo

[./demo/components/modelPath/treezModelPathDemo.html](../../../demo/components/modelPath/treezModelPathDemo.html)

## Construction

```javascript
    ...
    sectionContent.append('treez-model-path')
		  .label('Title')		  
      .attr('options','["a","b","c","d"]')
		  .value('["a","b","c"]')		
		  .bindValue(this, () => this.modeList);	
   ...
```

## JavaScript Attributes


### options

The array of available string values/items, e.g. \['a','b','c','d'\]. 

### value

The array of specified string values/items, e.g. \['a','b','c'\]. 

### label

Some label text that is shown above the list. 

### disabled

The disabled state as a boolean value. 

### hidden

The hidden state as a boolean value.

### width

The total css width as a string, e.g. '500px'.



## HTML String Attributes

### options

A string that can be evaluated to an array of strings and represents the available values/items, e.g. '\["a","b","c","d"\]'

### value

A string that can be evaluated to an array of strings and represents the selected values/items, e.g. '\["a","b","c"]'

### label

Some label text that is shown above the list. 

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

[Section](../section/section.md)
