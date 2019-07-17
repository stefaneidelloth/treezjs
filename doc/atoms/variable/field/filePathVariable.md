![](../../../../icons/path.png) [Path](../../model/path/path.md)<br>
![](../../../../icons/genericInput.png) [GenericInput](../../model/genericInput/genericInput.md)

----

# FilePathVariable

The ![](../../../../icons/filePathVariable.png) FilePathVariable atom is used to specify file paths (for example as part of a ![](../../../../icons/path.png) [Path](../../model/path/path.md) or ![](../../../../icons/genericInput.png) [GenericInput](../../model/genericInput/genericInput.md) atom):

![](../../../images/file_path_variable.png)

You can **edit** the file path by
* entering the path directly in the **text field**
* clicking on the ![](../../../../icons/browse.png) selection button. That opens an extra **file selection dialog**.

You can **open/execute** the file by clicking on the ![](../../../../icons/run_triangle.png) run button.

You can use previously defined ![DirectoryPathVariable](../../../../icons/directoryPathVariable.png) [DirectoryPathVariables](./directoryPathVariable.md) to specify relative paths. In order to do so, you use the name of the existing variable, wrapped within placeholder symbols, e.g. {$workingDirectory$}.

## Source code

[./src/variable/field/filePathVariable.js](../../../../src/variable/field/filePathVariable.js)

## Construction

A new ![](../../../../icons/filePathVariable.png) FilePathVariable atom is created either 

* from the context menu of an existing ![](../../../../icons/path.png) [Path](../../model/path/path.md) or ![](../../../../icons/genericInput.png) [GenericInput](../../model/genericInput/genericInput.md) atom in the [Tree View](../../../views/treeView.md) or 

* by calling the corresponding factory method of a parent atom in the source code of the [Editor View](../../../views/editorView.md):	

```javascript
    ...
    var path = models.createPath();	   
    path.createFilePathVariable('inputFile', '{$workingDirectory$}\input.txt');
```

----
![DirectoryPathVariable](../../../../icons/directoryPathVariable.png) [DirectoryPathVariable](./directoryPathVariable.md)
