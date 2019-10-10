![](../../../../icons/sweep.png) [Sweep](../../study/sweep/sweep.md)

----

# StringRange
	
The purpose of the ![](../../../../icons/stringRange.png) StringRange atom is to edit a range of string (=text) values. 
		
![](../../../images/stringRange.png)

The range can be disabled/enabled through the context menu of the atom. The disabled state is shown by a ![](../../../../icons/disabled.png) decorator icon in the [Tree View](../../../views/treeView.md).
		
## Source code

[./src/variable/range/stringRange.js](../../../../src/variable/range/stringRange.js)

## Construction
		
A new ![](../../../../icons/stringRange.png) StringRange atom atom is created either by: 

* using the context menu of a ![](../../../../icons/sweep.png) [Sweep](../../study/sweep/sweep.md) atom in the [Tree View](../../../views/treeView.md) or
* calling the corresponding factory method of the ![](../../../../icons/sweep.png) [Sweep](../../study/sweep/sweep.md) atom in the source code of the [Editor view](../../../views/editorView.md):

```javascript
    ...
    var ageRange = models.createStringRange('root.models.genericInput.description', ['first description', 'second description']);	     
```						
		
## Sections

### Data

#### Variable path

The tree path to the variable that should be controlled by the range.

#### Range

A list of string values. Use the buttons and text fields to edit the entries of the list:
* ![](../../../../icons/add.png) Add entry
* ![](../../../../icons/delete.png) Delete entry
* ![](../../../../icons/up.png) Move entry up
* ![](../../../../icons/down.png) Move entry down 
----

![](../../../../icons/stringItemRange.png) [StringItemRange](./stringItemRange.md) 

