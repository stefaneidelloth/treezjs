![](../../../../icons/genericInput.png) [GenericInput](../../model/genericInput/genericInput.md)

----

# StringVariable

The ![](../../../../icons/stringVariable.png) StringVariable atom is used to specify a text value: 

![](../../../images/stringVariable.png)

## Source code

[./src/variable/field/stringVariable.js](../../../../src/variable/field/stringVariable.js)

## Construction

A new ![](../../../../icons/stringVariable.png) StringVariable atom is created either 

* from the context menu of a ![](../../../../icons/genericInput.png) [GenericInput](../../model/genericInput/genericInput.md) atom in the [Tree View](../../../views/treeView.md) or 

* by calling the corresponding factory method of a parent atom in the source code of the [Editor View](../../../views/editorView.md):	

```javascript
    ...
    genericInput.createStringVariable('purpose', 'Evaluate increase of population');
```

----
![StringItemVariable](../../../../icons/stringItemVariable.png) [StringItemVariable](./stringItemVariable.md)
