![](../../../../icons/genericInput.png) [GenericInput](../../model/genericInput/genericInput.md)

----

# StringItemVariable

The ![](../../../../icons/stringItemVariable.png) StringItemVariable atom provides a combo box to select a text item from a list of predefined text items: 

![](../../../images/string_item_variable.png)

## Source code

[./src/variable/field/stringItemVariable.js](../../../../src/variable/field/stringItemVariable.js)

## Construction

A new ![](../../../../icons/stringItemVariable.png) StringItemVariable atom is created either 

* from the context menu of a ![](../../../../icons/genericInput.png) [GenericInput](../../model/genericInput/genericInput.md) atom in the [Tree View](../../../views/treeView.md) or 

* by calling the corresponding factory method of a parent atom in the source code of the [Editor View](../../../views/editorView.md):	

```javascript
    ...
    genericInput.createStringItemVariable('tag', 'python');
```

The available text items can be specified by clicking on the ![](../../../../icons/stringItemVariable.png) StringItemVariable atom in the [Tree View](../../../views/treeView.md) and editing the commo separated list of available text items in the [Properties View](../../../views/propertiesView.md) 

----
![FilePathVariable](../../../../icons/filePathVariable.png) [FilePathVariable](./filePathVariable.md)
