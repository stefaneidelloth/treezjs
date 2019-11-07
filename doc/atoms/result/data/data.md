![](../../../../icons/results.png) [Results](../results.md)

----

# Data

The ![](../../../../icons/data.png) Data atom represents a tree branch for collecting simulation results and for post processing those results.  

![](../../../images/data.png)

## Source code

[./src/result/data/data.js](../../../src/result/data/data.js)

## Construction

A new ![](../../../../icons/data.png) Data atom is created either 

* from the context menu of an existing ![](../../../../icons/results.png) Results atom in the [Tree View](../../views/treeView.md) or 
* by calling the corresponding factory method of the ![](../../../../icons/results.png) Results atom in the source code of the [Editor View](../../views/editorView.md):

```javascript
    ...
    let data = results.createData();	     
```

## Child atoms

The context menu of the ![](../../../../icons/data.png) Data atom allows to add child atoms: 

* ![](../../../../icons/table.png) [Table](./table/table.md)
* ![](../../../../icons/page.png) [Page](./page/page.md)


----
[Table](./table/table.md)
