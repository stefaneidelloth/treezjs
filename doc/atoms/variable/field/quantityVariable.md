![](../../../../icons/genericInput.png) [GenericInput](../../model/genericInput/genericInput.md)

----

# QuanityVariable

The ![](../../../../icons/quantityVariable.png) QuanityVariable atom is used to specify a physical quantity. The value of a quantity consists of a **number and a unit**. QuantityVariables are thought to be used by some model, e.g. the ![](../../../../icons/genericInput.png) [GenericInput](../../model/genericInput/genericInput.md) model):

![](../../../images/quantity_variable.png)

Please note that Treez is based on JavaScript and that [numbers in JavaScript have some limitations](http://www.javascripter.net/faq/accuracy.htm). 

## Source code

[./src/variable/field/quantityVariable.js](../../../../src/variable/field/quantityVariable.js)

## Construction

A new ![](../../../../icons/quantityVariable.png) QuanityVariable atom is created either 

* from the context menu of a ![](../../../../icons/genericInput.png) [GenericInput](../../model/genericInput/genericInput.md) atom in the [Tree View](../../../views/treeView.md) or 

* by calling the corresponding factory method of a parent atom in the source code of the [Editor View](../../../views/editorView.md):	

```javascript
    ...
    var length = genericInput.createQuantityVariable('length');
    length.number = 2.5;
    length.unit = 'm';
```

----
![BooleanVariable](../../../../icons/booleanVariable.png) [BooleanVariable](./booleanVariable.md)
