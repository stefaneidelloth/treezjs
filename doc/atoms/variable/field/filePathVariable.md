![](../../../../icons/path.png) [Path](../../model/path/path.md)
![](../../../../icons/genericInput.png) [GenericInput](../../model/genericInput/genericInput.md)

----

# FilePathVariable

The ![](../../../../icons/filePath.png) FilePathVariable atom is used to specify file paths, for example as child of a ![](../../../../icons/path.png) [Path](../../model/path/path.md) atom or
as child of a ![](../../../../icons/genericInput.png) [GenericInput](../../model/genericInput/genericInput.md) atom.

![](../../../images/file_path_variable.png)

You can edit the file path
* by entering the path directly in the text field
* by clicking on the ![](../../../../icons/file.png) file path selection button

You can open/execute the file by clicking on the ![](../../../../icons/execute.png) execute button.

## Source code

[./src/model/path/path.js](../../../../src/model/path/path.js)

## Construction

A new ![](../../../../icons/path.png) Path atom is created either 

* from the context menu of an existing ![](../../../../icons/models.png) [Models](../models.md) atom in the [Tree View](../../../views/treeView.md) or 

* by calling the corresponding factory method of the ![](../../../../icons/models.png) [Models](../models.md) atom in the source code of the [Editor View](../../../views/editorView.md):	

```javascript
    ...
    var path = models.createPath();	   
    path.createDirectoryPathVariable('workingDirectory', 'D:\treez');
    path.createFilePathVariable('inputFile', '{$workingDirectory$}\input.txt');
```

## Child atoms

The context menu of the ![](../../../../icons/path.png) Path atom allows to add child atoms: 

* ![](../../../../icons/filePathVariable.png) [FilePathVariable](../../variable/field/filePathVariable.md)
* ![](../../../../icons/directoryPathVariable.png) [DirectoryPathVariable](../../variable/field/directoryPathVariable.md)

----
![GenericInput](../../../icons/genericInput.png) [GenericInput](../genericInput/genericInput.md)
