![](../../../../icons/data.png) [Data](../../result/data/data.md)

----

# Table

The ![](../../../../icons/table.png) Table atom represents tabular data.   

![](../../../images/table.png)

## Source code

[./src/data/table/table.js](../../../src/data/table/table.js)

## Construction

A new ![](../../../../icons/table.png) Table atom is created either 

* from the context menu of an existing ![](../../../../icons/data.png) [Data](../../result/data/data.md) atom in the [Tree View](../../views/treeView.md) or 
* by calling the corresponding factory method of the ![](../../../../icons/data.png) [Data](../../result/data/data.md) atom in the source code of the [Editor View](../../views/editorView.md):

```javascript
    ...
    let table = data.createTable();	     
```

## Child atoms

The context menu of the ![](../../../../icons/table.png) Table atom allows to add child atoms: 

* ![](../../../../icons/columnFolder.png) [ColumnFolder](../column/columnFolder.md)

----
![](../../../../icons/columnFolder.png) [ColumnFolder](../column/columnFolder.md)
