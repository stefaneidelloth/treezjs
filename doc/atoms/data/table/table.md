![](../../../../icons/data.png) [Data](../../result/data/data.md)

----

# Table

The ![](../../../../icons/table.png) Table atom represents tabular data.   

![](../../../images/table.png)

The toolbar above the table provides follosing actions:
* ![](../../../../icons/add.png) Add row
* ![](../../../../icons/delete.png) Delete row
* ![](../../../../icons/up.png) Move row up
* ![](../../../../icons/down.png) Move row down 

## Source code

[./src/data/table/table.js](../../../src/data/table/table.js)

## Demo

[./demo/data/table/table.ipynb](../../../../demo/data/table/table.ipynb)

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
