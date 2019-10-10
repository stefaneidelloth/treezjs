[Components](../components.md)

----

# FilePathList
		
The FilePathList component allows to specify a list of file paths. 
	
![](../../images/treezFilePathList.png)

Use the buttons and text fields to edit the entries of the list:

* ![](../../../icons/add.png) Add entry
* ![](../../../icons/delete.png) Delete entry
* ![](../../../icons/up.png) Move entry up
* ![](../../../icons/down.png) Move entry down 
		
## Source code

[./src/components/list/treezFilePathList.js](../../../src/components/list/treezFilePathList.js)

## Test

[./test/components/list/treezFilePathList.test.js](../../../test/components/list/treezFilePathList.test.js)

## Demo

[./demo/components/list/treezFilePathListDemo.html](../../../demo/components/list/treezFilePathListDemo.html)

## Construction

```javascript
    ...
    sectionContent.append('treez-file-path-list')
		  .label('File path list:')		  
		  .value('["c:/foo.txt","c:/baa.txt","c:/qux.txt"]')		
		  .bindValue(this, () => this.names);	
   ...
```

## JavaScript Attributes

### value

An array of strings, e.g. \'c:/foo.txt','c:/baa.txt','c:/qux.txt'\]. 

### Inherited attributes

Also see the attributes that are inherited from [LabeledTreezElement](../labeledTreezElement.md#value).



## HTML String Attributes

### value

A string that can be evaluated to an array of strings, e.g. '\["c:/foo.txt","c:/baa.txt","c:/qux.txt"\]'

### Inherited attributes

Also see the attributes that are inherited from [LabeledTreezElement](../labeledTreezElement.md#value1).


----

[FillStyle](../fillStyle/fillStyle.md)
