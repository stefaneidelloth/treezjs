[Atoms](../atoms.md)
----

# Root

The <img src="../../icons/root.png"> Root atom is represented by the **first node of the tree** in the [Tree View](../views/treeView.md). The context menu of the Root atom allows to create child atoms, also see below. 

## Source code

[/src/root/root.js](../../src/root/root.js)

## Construction

There are two ways to create a new Root atom: 

* Click on the <img src="../../icons/root.png"> **Create root** button in the toolbar of the Tree View. This action deletes the current content of the Tree View and creates a new Root atom.

* Copy the below JavaScript source code to the [Editor View](../views/editorView.md), correct the import path if required, and <img src="../../icons/toTree.png"> import it to the TreeView: 

Example code for stand-alone installation:
```javascript
import Root from './src/root/root.js';

window.createModel = function () {
    var root = new Root();
    return root;
}
```

Example code for Jupyter Notebook extension:
```javascript
import Root from './treezjs/src/root/root.js';

window.createModel = function () {
    var root = new Root();
    return root;
}
```

## Child atoms

If you right-click on the Root atom in the Tree View, you will see some **context menu actions** that allow you to **add child atoms**: 

* ![Models](../../icons/models.png) [Models](./model/models.md): Branch for all models
* ![Studies](../../icons/studies.png) [Studies](./study/studies.md): Branch for all studies
* ![Results](../../icons/results.png) [Results](./result/results.md): Branch for all results 

As an alternative to the tree node operations, you can also add child atoms to the Root atom by editing the JavaScript source code. Follow the above links to the child atoms for some examples.

## Purpose of the child atoms

As already stated in the introduction, the **atoms** that come with Treez are thought to model an exemplary **simulation work flow**. 

The atom ![Models](../../icons/models.png) [Models](./model/models.md) typically includes, as the name suggest, some models. The **first step of the simulation work flow** is to fill that part of the tree with meaningful content. A model can be **started manually** with a specific **set of properties**.

If you want to **run a model many times**, for example to perform a **sensitivity study**, it often makes sense to 
automate this time consuming task. The purpose of the atoms that can be found under the ![Studies](../../icons/studies.png) [Studies](./study/studies.md) atom is the automated model execution. 

Finally, the results of the model runs are **inspected** and **evaluated** with the last part of the tree: the ![Results](../../icons/results.png) [Results](./result/results.md) atom and its children.    

----
[Models](./model/models.md)
