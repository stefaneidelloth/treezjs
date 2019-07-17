![](../../../../icons/path.png) [Path](../../model/path/path.md)
![](../../../../icons/genericInput.png) [GenericInput](../../model/genericInput/genericInput.md)

----

# FilePathVariable

The ![](../../../../icons/filePath.png) FilePathVariable atom is used to specify file paths, for example as child of a ![](../../../../icons/path.png) [Path](../../model/path/path.md) atom or
as child of a ![](../../../../icons/genericInput.png) [GenericInput](../../model/genericInput/genericInput.md) atom.

![](../../../images/file_path_variable.png)

You can edit the file path
* by entering the path directly in the text field
* by clicking on the ![](../../../../icons/browse.png) file path selection button

You can open/execute the file by clicking on the ![](../../../../icons/run_triangle.png) run button.

## Source code

[./src/variable/field/filePathVariable.js](../../../../src/variable/field/filePathVariable.js)

## Construction

A new ![](../../../../icons/filePath.png) FilePathVariable atom is created either 

* from the context menu of an existing ![](../../../../icons/path.png) [Path](../../model/path/path.md) or ![](../../../../icons/genericInput.png) [GenericInput](../../model/genericInput/genericInput.md) atom in the [Tree View](../../../views/treeView.md) or 

* by calling the corresponding factory method in the source code of the [Editor View](../../../views/editorView.md):	

```javascript
    ...
    var path = models.createPath();	   
    path.createFilePathVariable('inputFile', '{$workingDirectory$}\input.txt');
```

----
![DirectoryPathVariable](../../../icons/directoryPathVariable.png) [DirectoryPathVariable](./directoryPathVariable.md)
