![](../../../../icons/results.png) [Results](../results.md)

----

# ColumnFolder

The ![](../../../../icons/columns.png) ColumnFolder atom serves as a folder for all columns of a table.   

![](../../../images/columnFolder.png)

## Source code

[./src/data/column/columnFolder.js](../../../src/data/column/columnFolder.js)

## Construction

A new ![](../../../../icons/data.png) ColumnFolder atom is created either 

* from the context menu of an existing ![](../../../../icons/results.png) Results atom in the [Tree View](../../views/treeView.md) or 
* by calling the corresponding factory method of the ![](../../../../icons/results.png) Results atom in the source code of the [Editor View](../../views/editorView.md):

```javascript
    ...
    let data = results.createData();	     
```

## Child atoms

The context menu of the ![](../../../../icons/data.png) Data atom allows to add child atoms: 

* ![](../../../../icons/table.png) [Table](../../data/table/table.md)
* ![](../../../../icons/sweepProbe.png) [SweepProbe](./probe/sweepProbe.md)
* ![](../../../../icons/pickingProbe.png) [PickingProbe](./probe/pickingProbe.md)
* ![](../../../../icons/sensitivityProbe.png) [SensitivityProbe](./probe/sensitivityProbe.md)


----
[Table](../../data/table/table.md)
