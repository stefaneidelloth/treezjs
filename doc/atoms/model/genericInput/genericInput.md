![](../../../../icons/models.png) [Models](../models.md)

----

# GenericInput

The purpose of the ![](../../../../icons/genericInput.png) GenericInput atom is to provide a **list of variables** that can be **referenced and used by other atoms** (e.g. by a ![](../../../../icons/inputFile.png) [InputFileGenerator](../../model/inputFileGenerator/inputFileGenerator.md) or the ranges for a ![](../../../../icons/sweep.png) [Sweep](../../study/sweep/sweep.md) study). 

If you click on a ![](../../../../icons/genericInput.png) GenericInput atom in the [Tree View](../../../views/treeView.md), the values for the variables can be edited in the [Properties View](../../../views/propertiesView.md):

![](../../../images/generic_input.png)

The context menu of the ![](../../../../icons/genericInput.png) GenericInput atom in the [Tree View](../../../views/treeView.md) provides actions for adding variables.



## Source code

[/src/model/genericInput/genericInput.js](../../../../src/model/genericInput/genericInput.js)
		
## Construction
		
A new ![](../../../../icons/genericInput.png) GenericInput atom is created either by: 

* using the context menu of a ![](../../../../icons/models.png) [Models](../models.md) atom in the [Tree View](../../../views/treeView.md) or
* calling the corresponding factory method of the ![](../../../../icons/models.png) [Models](../models.md) atom in the source code of the [Editor view](../../../views/editorView.md):

```javascript
    ...
    var genericInput = models.createGenericInput();	     
```

## Child atoms
		
The context menu of the ![](../../../../icons/genericInput.png) GenericInput atom allows to add child atoms: 

* ![](../../../../icons/filePathVariable.png) [FilePathVariable](../../variable/field/filePathVariable.md)
* ![](../../../../icons/directoryPathVariable.png) [DirectoryPathVariable](../../variable/field/directoryPathVariable.md)

----

![](../../../../icons/run.png) [Executable](../executable/executable.md)

