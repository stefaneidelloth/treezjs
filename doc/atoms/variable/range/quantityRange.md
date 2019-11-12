![](../../../../icons/sweep.png) [Sweep](../../study/sweep/sweep.md)

----

# QuantityRange
	
The purpose of the ![](../../../../icons/quantityRange.png) QuantityRange atom is to edit a range of (physical) quantities.
The unit is the same for all quantities. The numbers are given by a commo separated list of (double) values in square brackets. 		
![](../../../images/quantityRange.png)

The range can be disabled/enabled through the context menu of the atom. The disabled state is shown by a ![](../../../../icons/disabled.png) decorator icon in the [Tree View](../../../views/treeView.md).
		
## Source code

[./src/variable/range/quantityRange.js](../../../../src/variable/range/quantityRange.js)

## Construction
		
A new ![](../../../../icons/quantityRange.png) QuantityRange atom atom is created either by: 

* using the context menu of a ![](../../../../icons/sweep.png) [Sweep](../../study/sweep/sweep.md) atom in the [Tree View](../../../views/treeView.md) or
* calling the corresponding factory method of the ![](../../../../icons/sweep.png) [Sweep](../../study/sweep/sweep.md) atom in the source code of the [Editor view](../../../views/editorView.md):

```javascript
    ...
    let lengthRange = models.createQuantityRange('root.models.genericInput.length', [20.0, 21.0, 22.0], 'm');	     
```						
		
## Properties

### Data

#### Variable path

The tree path to the variable that should be controlled by the range.

#### Number range

A comma separated list of range values in square brackets, e.g. [20.0, 21.0, 22.0] 

#### Unit

The unit for the quantities.

----

![](../../../../icons/booleanRange.png) [BooleanRange](./booleanRange.md) 

