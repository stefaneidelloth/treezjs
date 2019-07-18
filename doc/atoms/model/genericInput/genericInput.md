![](../../../../icons/models.png) [Models](../models.md)

----

# GenericInput

The purpose of the ![](../../../../icons/genericInput.png) GenericInput atom is to provide a **list of variables** that can be **referenced and used by other atoms** (e.g. by a ![](../../../../icons/inputFile.png) [InputFileGenerator](../../model/inputFileGenerator/inputFileGenerator.md) or the ranges for a ![](../../../../icons/sweep.png) [Sweep](../../study/sweep/sweep.md) study). 

The context menu of the ![](../../../../icons/genericInput.png) GenericInput atom in the [Tree View](../../../views/treeView.md) provides actions for **adding variables as children** of the ![](../../../../icons/genericInput.png) GenericInput atom. Variables of several types are supported and the input components depend on the type (e.g. check box for a ![](../../../../icons/booleanVariable.png) [BooleanVariable](../../variable/field/booleanVariable.md)).

The content of the [Properties View](../../../views/propertiesView.md) for the ![](../../../../icons/genericInput.png) GenericInput atom is automatically generated from its children. 

If you click on a ![](../../../../icons/genericInput.png) GenericInput atom in the [Tree View](../../../views/treeView.md), you can **edit the values of all variables** in the [Properties View](../../../views/propertiesView.md). 

If you click on a variable atom in the [Tree View](../../../views/treeView.md), you can **edit the name** of the variable in the [Properties View](../../../views/propertiesView.md) and additional attributes if they exist (e.g. the available options for a ![](../../../../icons/stringItemVariable.png) [StringItemVariable](../../variable/field/stringItemVariable.md)). The name of variable atom can also be changed using the ![](../../../../icons/rename.png) Rename action of the context menu in the [Tree View](../../../views/treeView.md).

![](../../../images/generic_input.png)

## Source code

[./src/model/genericInput/genericInput.js](../../../../src/model/genericInput/genericInput.js)
		
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

* ![](../../../../icons/doubleVariable.png) [DoubleVariable](../../variable/field/doubleVariable.md)
* ![](../../../../icons/integerVariable.png) [IntegerVariable](../../variable/field/integerVariable.md)
* ![](../../../../icons/quantityVariable.png) [QuantityVariable](../../variable/field/quantityVariable.md)
* ![](../../../../icons/booleanVariable.png) [BooleanVariable](../../variable/field/booleanVariable.md)
* ![](../../../../icons/stringVariable.png) [StringVariable](../../variable/field/stringVariable.md)
* ![](../../../../icons/stringItemVariable.png) [StringItemVariable](../../variable/field/stringItemVariable.md)
* ![](../../../../icons/filePathVariable.png) [FilePathVariable](../../variable/field/filePathVariable.md)
* ![](../../../../icons/directoryPathVariable.png) [DirectoryPathVariable](../../variable/field/directoryPathVariable.md)

----

![](../../../../icons/run.png) [Executable](../executable/executable.md)

