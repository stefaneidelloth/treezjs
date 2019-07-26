![](../../../../icons/sweep.png) [Sweep](../../study/sweep/sweep.md)

----

# StringRange
	
The purpose of the ![](../../../../icons/integerRange.png) IntegerRange atom is to edit a range of integer values. 
		
![](../../../images/integer_range.png)

The range can be disabled/enabled through the context menu of the atom. The disabled state is shown by a ![](../../../../icons/disabled.png) decorator icon in the [Tree View](../../../views/treeView.md).
		
## Source code

[./src/variable/range/integerRange.js](../../../../src/variable/range/integerRange.js)

## Construction
		
A new ![](../../../../icons/integerRange.png) IntegerRange atom atom is created either by: 

* using the context menu of a ![](../../../../icons/sweep.png) [Sweep](../../study/sweep/sweep.md) atom in the [Tree View](../../../views/treeView.md) or
* calling the corresponding factory method of the ![](../../../../icons/sweep.png) [Sweep](../../study/sweep/sweep.md) atom in the source code of the [Editor view](../../../views/editorView.md):

```javascript
    ...
    var ageRange = models.createDoubleRange('root.models.genericInput.age', [13, 14, 15]);	     
```						
		
## Sections

### Data

#### Variable path

The tree path to the variable that should be controlled by the range.

#### Range

A comma separated list of range values in square brackets, e.g. [13,14,15] or a range command range(min, max, step), e.g. range(13,15,1)

----

![](../../../../icons/stringItemRange.png) [StringItemRange](./stringItemRange.md) 

