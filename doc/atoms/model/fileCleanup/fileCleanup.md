![](../../../../icons/models.png) [Models](../models.md)

----

# FileCleanup
		
The purpose of the ![](../../../../icons/fileCleanup.png) FileCleanup atom is to delete (old) files. It can be applied to
* delete a single file
* delete all files and sub directories in a directory
* delete a directory
	
![](../../../images/file_cleanup.png)
		
## Source code

[./src/model/fileCleanup/fileCleanup.js](../../../../src/model/fileCleanup/fileCleanup.js)

## Construction
		
A new ![](../../../../icons/fileCleanup.png) FileCleanup atom is created either by: 

* using the context menu of a ![](../../../../icons/models.png) [Models](../models.md) atom in the [Tree View](../../../views/treeView.md) or
* calling the corresponding factory method of the ![](../../../../icons/models.png) [Models](../models.md) atom in the source code of the [Editor view](../../../views/editorView.md):

```javascript
    ...
    var fileCleanup = models.createFileCleanup();	     
```

## Work flow	

You can **run** the ![](../../../../icons/fileCleanup.png) FileCleanup atom either<br> 
a) with the ![](../../../../icons/run.png) run button in the upper right corner of the [Properties View](../../../views/propertiesView.md)<br>
b) with the ![](../../../../icons/run.png) run button in the context menu of the atom in the [Tree View](../../../views/treeView.md)<br>
c) with the ![](../../../../icons/run.png) run button in the context menu of the parent ![](../../../../icons/models.png) [Models](../models.md) atom in the [Tree View](../../../views/treeView.md) (runs all executable models)<br>
d) remotely with another atom (e.g. as part of a ![](../../../../icons/sweep.png) [Sweep](../../study/sweep/sweep.md) study. 

			
## Sections



### Executable

----

![](../../../../icons/fileCopy.png) [FileCopy](./fileCopy.md)
