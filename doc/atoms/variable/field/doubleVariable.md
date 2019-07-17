![](../../../../icons/genericInput.png) [GenericInput](../../model/genericInput/genericInput.md)

----

# DoubleVariable

The ![](../../../../icons/doubleVariable.png) DoubleVariable atom is used to specify a double value (=floating point number)

(for example for a ![](../../../../icons/genericInput.png) [GenericInput](../../model/genericInput/genericInput.md) atom):

![](../../../images/double_variable.png)

In order to be **consistent** with the **decimal separator** that is used for numbers in the the source code of the [Editor View](../../views/editorView), we recomment to set the language settings
of Google Chrome to "English (United States)": Settings => Advanced => Languages => "English (United States)". 

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
