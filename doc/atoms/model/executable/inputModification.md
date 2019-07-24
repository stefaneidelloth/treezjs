![](../../../../icons/run.png) [Executable](./executable.md)<br>
![](../../../../icons/java.png) [JavaExecutable](./javaExecutable.md)

----

# InputModification

The purpose of the ![](../../../../icons/inputModification.png) InputModification atom is to dynamically modify the input file or directory path of its parent atom.

![](../../../images/input_modification.png)

## Source code

[./src/model/executable/inputModification.js](../../../../src/model/executable/inputModification.js)

## Construction
		
A new ![](../../../../icons/inputModification.png) InputModification atom is created either by: 

* using the context menu of an ![](../../../../icons/run.png) [Executable](./executable.md) or ![](../../../../icons/java.png) [JavaExecutable](./javaExecutable.md) atom in the [Tree View](../../../views/treeView.md) or
* calling the corresponding factory method of the parent atom in the source code of the [Editor view](../../../views/editorView.md):

```javascript
    ...
    var inputModification = executable.createInputModification();	     
```

## Arguments



----

![](../../../../icons/outputModification.png) [OutputModification](./outputModification.md)
