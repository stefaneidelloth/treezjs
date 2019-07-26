![](../../../../icons/sweep.png) [Sweep](../../study/sweep/sweep.md)

----

# DoubleRange
	
The purpose of the ![](../../../../icons/doubleRange.png) atom is to edit a range of double values. 
		
![](../../../images/double_range.png)

The range can be disabled/enabled through the context menu of the atom. The disabled state is shown by a ![](../../../../icons/disabled.png) decorator icon in the [Tree View](../../../views/treeView.md).
		
## Source code

[./src/variable/range/doubleRange.js](../../../../src/variable/range/doubleRange.js)

## Construction
		
A new ![](../../../../icons/doubleRange.png) atom atom is created either by: 

* using the context menu of a ![](../../../../icons/sweep.png) [Sweep](../../study/sweep/sweep.md) atom in the [Tree View](../../../views/treeView.md) or
* calling the corresponding factory method of the ![](../../../../icons/sweep.png) [Sweep](../../study/sweep/sweep.md) atom in the source code of the [Editor view](../../../views/editorView.md):

```javascript
    ...
    var weightRange = models.createDoubleRange('root.models.genericInput.weight',[70.0, 70.5, 71.0, 71.5, 72.0]);	     
```						
		
## Sections

### Data

#### Variable path

The tree path to the variable that should be controlled by the range.

#### Range

A comma separated list of range values in square brackets, e.g. [0.5, 1, 1.5, 2] or a range command range(min, max, step), e.g. range(0.5, 2, 0.5)

----

![](../../../../icons/integerRange.png) [IntegerRange](./integerRange.md) 

