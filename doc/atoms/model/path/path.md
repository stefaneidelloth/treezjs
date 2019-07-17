![](../../../../icons/models.png) [Models](../models.md)

----

# Path

The ![](../../../icons/path.png) Path atom helps to organize file- and directory paths. Once a path has 
been specified, it can be used as a variable within other paths. This way it is possible to reuse already
existing paths and to specify relative paths. If you would like to adapt a path in future, you probably 
ony have to change it once, instead of going through all places where the path is applied. 

## Source code

[./src/model/path/path.js](../../../src/model/path/path.js)

## Construction

A new ![](../../../icons/path.png) Path atom is created either 

* from the context menu of an existing ![](../../../icons/models.png) [Models](../models.md) atom in the [Tree View](../../views/treeView.md) or 

* by calling the corresponding factory method of the ![](../../../icons/models.png) [Models](../models.md) atom in the source code of the [Editor View](../../views/editorView.md):	

```javascript
    ...
    var path = models.createPath();	   
    path.createDirectoryPathVariable('workingDirectory', 'D:\treez');
    path.createFilePathVariable('inputFile', '{$workingDirectory$}\input.txt');
```

## Child atoms

The context menu of the ![](../../../icons/path.png) Path atom allows to add child atoms: 

* ![](../../../icons/filePathVariable.png) [FilePathVariable](../../variable/field/filePathVariable.md)
* ![](../../../icons/directoryPathVariable.png) [DirectoryPathVariable](../../variable/field/directoryPathVariable.md)

----
![GenericInput](../../../icons/genericInput.png) [GenericInput](../genericInput/genericInput.md)
