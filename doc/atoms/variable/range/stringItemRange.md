![](../../../../icons/sweep.png) [Sweep](../../study/sweep/sweep.md)

----

# StringItemRange
	
The purpose of the ![](../../../../icons/stringItemRange.png) StringItemRange atom is to edit a range of predefined string items. 
		
![](../../../images/string_item_range.png)

The range can be disabled/enabled through the context menu of the atom. The disabled state is shown by a ![](../../../../icons/disabled.png) decorator icon in the [Tree View](../../../views/treeView.md).
		
## Source code

[./src/variable/range/stringItemRange.js](../../../../src/variable/range/stringItemRange.js)

## Construction
		
A new ![](../../../../icons/stringItemRange.png) StringItemRange atom atom is created either by: 

* using the context menu of a ![](../../../../icons/sweep.png) [Sweep](../../study/sweep/sweep.md) atom in the [Tree View](../../../views/treeView.md) or
* calling the corresponding factory method of the ![](../../../../icons/sweep.png) [Sweep](../../study/sweep/sweep.md) atom in the source code of the [Editor view](../../../views/editorView.md):

```javascript
    ...
    var ageRange = models.createStringItemRange('root.models.genericInput.type', ['foo', 'baa']);	     
```						
		
## Sections

### Data

#### Variable path

The tree path to the variable that should be controlled by the range.

#### Range

A list of string item values. Use the buttons and combo boxes to edit the entries of the list:
* ![](../../../../icons/add.png) Add entry
* ![](../../../../icons/delete.png) Delete entry
* ![](../../../../icons/up.png) Move entry up
* ![](../../../../icons/down.png) Move entry down 

----

![](../../../../icons/filePathRange.png) [FilePathRange](./filePathRange.md) 

