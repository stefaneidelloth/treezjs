[Components](../components.md)

----

# StringList
		
The StringList component allows to specify a list of string values. 
	
![](../../images/treezStringList.png)

Use the buttons and text fields to edit the entries of the list:

* ![](../../../icons/add.png) Add entry
* ![](../../../icons/delete.png) Delete entry
* ![](../../../icons/up.png) Move entry up
* ![](../../../icons/down.png) Move entry down 
		
## Source code

[./src/components/list/treezStringList.js](../../../src/components/list/treezStringList.js)

## Test

[./test/components/list/treezStringList.test.js](../../../test/components/list/treezStringList.test.js)

## Demo

[./demo/components/list/treezStringListDemo.html](../../../demo/components/list/treezStringListDemo.html)

## Construction

```javascript
    ...
    sectionContent.append('treez-string-list')
		  .label('String list:')		  
		  .value('["a","b","c","d"]')		
		  .bindValue(this, () => this.names);	
   ...
```

## JavaScript Attributes

### value

An array of strings, e.g. \['a','b','c','d'\]. 

### Inherited attributes

Also see the attributes that are inherited from [LabeledTreezElement](../labeledTreezElement.md#value).



## HTML String Attributes

### value

A string that can be evaluated to an array of strings, e.g. '\["a","b","c","d"\]'

### Inherited attributes

Also see the attributes that are inherited from [LabeledTreezElement](../labeledTreezElement.md#value1).


----

[StringItemList](./stringItemList.md)
