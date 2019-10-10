![](../../../../icons/path.png) [Path](../../model/path/path.md)<br>
![](../../../../icons/genericInput.png) [GenericInput](../../model/genericInput/genericInput.md)

----

# DirectoryPathVariable

The ![](../../../../icons/directoryPathVariable.png) DirectoryPathVariable atom is used to specify directories (for example as part of a ![](../../../../icons/path.png) [Path](../../model/path/path.md) or ![](../../../../icons/genericInput.png) [GenericInput](../../model/genericInput/genericInput.md) atom):

![](../../../images/directoryPathVariable.png)

You can **edit** the directory by
* entering the directory directly in the **text field**
* clicking on the ![](../../../../icons/browseDirectory.png) selection button. That opens an extra **directory selection dialog**.

You can **open** the directory by clicking on the ![](../../../../icons/run_triangle.png) run button.

You can use previously defined ![DirectoryPathVariable](../../../../icons/directoryPathVariable.png) [DirectoryPathVariables](./directoryPathVariable.md) to specify relative paths. In order to do so, you use the name of the existing variable, wrapped within placeholder symbols, e.g. {$workingDirectory$}.

## Source code

[./src/variable/field/directoryPathVariable.js](../../../../src/variable/field/directoryPathVariable.js)

## Construction

A new ![](../../../../icons/directoryPathVariable.png) DirectoryPathVariable atom is created either 

* from the context menu of an existing ![](../../../../icons/path.png) [Path](../../model/path/path.md) or ![](../../../../icons/genericInput.png) [GenericInput](../../model/genericInput/genericInput.md) atom in the [Tree View](../../../views/treeView.md) or 

* by calling the corresponding factory method of a parent atom in the source code of the [Editor View](../../../views/editorView.md):	

```javascript
    ...
    var path = models.createPath();	   
    path.createDirectoryPathVariable('workingDirectory', 'D:/treez');
    path.createDirectoryPathVariable('iconDirectory', '{$workingDirectory$}/icons');
```

----
![](../../../../icons/genericInput.png) [GenericInput](../../model/genericInput/genericInput.md)<br>
![](../../../../icons/run.png) [Exectuable](../../model/executable/executable.md)
