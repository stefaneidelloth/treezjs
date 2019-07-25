![](../../../../icons/models.png) [Models](../models.md)

----

# TableImport
			
The purpose of the ![](../../../../icons/tableImport.png) TableImport atom is to import external data as a table. 

The imported table is attached as child to the ![](../../../../icons/tableImport.png) TableImport atom. If the TableImport is executed remotely, for example as part of a ![](../../../../icons/sweep.png) [Sweep](../../study/sweep/sweep.md) study, the table is also returned as model output and probably attached to the data in the ![](../../../../icons/results.png) [Results](../../result/results.md) branch of the tree.  

![](../../../images/table_import.png)
		
## Source code

[./src/model/tableImport/tableImport.js](../../../../src/model/tableImport/tableImport.js)

## Construction
		
A new ![](../../../../icons/tableImport.png) TableImport atom is created either by: 

* using the context menu of a ![](../../../../icons/models.png) [Models](../models.md) atom in the [Tree View](../../../views/treeView.md) or
* calling the corresponding factory method of the ![](../../../../icons/models.png) [Models](../models.md) atom in the source code of the [Editor view](../../../views/editorView.md):

```javascript
    ...
    var tableImport = models.createTableImport();	     
```
		
## Work flow	

You can **run** the ![](../../../../icons/tableImport.png) TableImport atom either<br> 
a) with the ![](../../../../icons/run.png) run button in the upper right corner of the [Properties View](../../../views/propertiesView.md)<br>
b) with the ![](../../../../icons/run.png) run button in the context menu of the atom in the [Tree View](../../../views/treeView.md)<br>
c) with the ![](../../../../icons/run.png) run button in the context menu of the parent ![](../../../../icons/models.png) [Models](../models.md) atom in the [Tree View](../../../views/treeView.md) (runs all executable models)<br>
d) remotely with another atom (e.g. as part of a ![](../../../../icons/sweep.png) [Sweep](../../study/sweep/sweep.md) study. 
			
## Arguments		
