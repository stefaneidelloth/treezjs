![](../../../../icons/genericInput.png) [GenericInput](../../model/genericInput/genericInput.md)

----

# IntegerVariable

The ![](../../../../icons/integerVariable.png) IntegerVariable atom is used to specify an integer input value for a model, e.g. for a ![](../../../../icons/genericInput.png) [GenericInput](../../model/genericInput/genericInput.md) model):

![](../../../images/integer_variable.png)

You can enter a value directly or use the arrow buttons on the right side of the input field to increase/decrease the number by 1. 

Treez is based on JavaScript and [numbers in JavaScript have some limitations](http://www.javascripter.net/faq/accuracy.htm). 

## Source code

[./src/variable/field/integerVariable.js](../../../../src/variable/field/integerVariable.js)

## Construction

A new ![](../../../../icons/integerVariable.png) IntegerVariable atom is created either 

* from the context menu of a ![](../../../../icons/genericInput.png) [GenericInput](../../model/genericInput/genericInput.md) atom in the [Tree View](../../../views/treeView.md) or 

* by calling the corresponding factory method of a parent atom in the source code of the [Editor View](../../../views/editorView.md):	

```javascript
    ...
    genericInput.createIntegerVariable('numberOfHumans', 8e9);
```

----
![QuantityVariable](../../../../icons/quantityVariable.png) [QuantityVariable](./quantityVariable.md)
