[Components](../components.md)

----

# StringItemList
		
The StringItemList component allows to specify a list of string values, where each item can be selected from a predefined list. 
	
![](../../images/treezStringItemList.png)

Use the buttons and combo boxes to edit the entries of the list:

* ![](../../../icons/add.png) Add entry
* ![](../../../icons/delete.png) Delete entry
* ![](../../../icons/up.png) Move entry up
* ![](../../../icons/down.png) Move entry down 
		
## Source code

[./src/components/list/treezStringItemList.js](../../../src/components/list/treezStringItemList.js)

## Test

[./test/components/list/treezStringItemList.test.js](../../../test/components/list/treezStringItemList.test.js)

## Demo

[./demo/components/list/treezStringItemListDemo.html](../../../demo/components/list/treezStringItemListDemo.html)

## Construction

```javascript
    ...
    sectionContent.append('treez-string-item-list')
		  .label('String item list:')		  
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

### Inherited attributes

Also see the attributes that are inherited from [LabeledTreezElement](../labeledTreezElement.md#value).



## HTML String Attributes

### options

A string that can be evaluated to an array of strings and represents the available values/items, e.g. '\["a","b","c","d"\]'

### value

A string that can be evaluated to an array of strings and represents the selected values/items, e.g. '\["a","b","c"]'

### Inherited attributes

Also see the attributes that are inherited from [LabeledTreezElement](../labeledTreezElement.md#value-1).


----

[SymbolStyle](../symbolStyle/symbolStyle.md)
