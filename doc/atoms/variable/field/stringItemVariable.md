![](../../../../icons/genericInput.png) [GenericInput](../../model/genericInput/genericInput.md)

----

# StringItemVariable

The ![](../../../../icons/stringItemVariable.png) StringItemVariable atom provides a combo box to select a single text item from a list of predefined options: 

![](../../../images/stringItemVariable.png)

## Source code

[./src/variable/field/stringItemVariable.js](../../../../src/variable/field/stringItemVariable.js)

## Construction

A new ![](../../../../icons/stringItemVariable.png) StringItemVariable atom is created either 

* from the context menu of a ![](../../../../icons/genericInput.png) [GenericInput](../../model/genericInput/genericInput.md) atom in the [Tree View](../../../views/treeView.md) or 

* by calling the corresponding factory method of a parent atom in the source code of the [Editor View](../../../views/editorView.md):	

```javascript
    ...
    genericInput.createStringItemVariable('programmingLanguage');
```

The **available options** can be specified by clicking on the ![](../../../../icons/stringItemVariable.png) StringItemVariable atom in the [Tree View](../../../views/treeView.md) and editing the **comma separated list** of available text items in the [Properties View](../../../views/propertiesView.md).
The **available options** can also be specified in the source code of the [Editor View](../../../views/editorView.md):

```javascript
    ...
    let programmingLanguage = genericInput.createStringItemVariable('programmingLanguage');
    programmingLanguage.optionsExpression = '["Python", "JavaScript", "Kotlin", "Julia", "Octave", "R"]';
    programmingLanguage.value = 'Python';
```

----
![FilePathVariable](../../../../icons/filePathVariable.png) [FilePathVariable](./filePathVariable.md)
