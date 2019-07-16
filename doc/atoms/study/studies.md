![](../../../icons/root.png) [Root](../root.md)

----

# Studies

The ![](../../../icons/studies.png) Studies atom represents a branch for all underlying study atoms. Creating studies is 
typically the second step in a simulation work flow. Lets assume that the ![](../../../icons/models.png) Models branch of the tree already has been finished and that we want to analyze the models in detail. This typically requires to execute the models many times and the purpose of the studies is to automate that tedious process. Each individual study atom (the children of the Studies atom) inherits from [./src/study/study.js](../../../src/study/study.js). A study might produce results in the ![Results](../../../icons/results.png) [Results](../result/results.md) branch of the tree. 

# Source code

[./src/study/studies.js](../../../src/study/studies.js)

# Construction

A new ![](../../../icons/studies.png) Studies atom is created either 


* from the context menu of an existing ![](../../../icons/root.png) [Root](../root.md) atom in the [Tree View](../../views/treeView.md) or 

* by calling the corresponding factory method of the ![](../../../icons/root.png) [Root](../root.md) atom in the source code of the [Editor View](../../views/editorView.md):	

```javascript
    ...
    var studies = root.createStudies();	     
```

# Child atoms

The context menu of the ![](../../../icons/studies.png) Studies atom allows to add child models: 

* ![](../../../icons/sweep.png) [Sweep](./sweep/sweep.md)
* ![](../../../icons/sensitivity.png) [Sensitivity](./sensitivity/sensitivity.md)
* ![](../../../icons/picking.png) [Picking](./picking/picking.md)
* ![](../../../icons/probability.png) [Probability](./probability/probability.md)
* ![](../../../icons/pythonExport.png) [PythonExport](./pythonExport/pythonExport.md)
* ![](../../../icons/studyInfoExport.png) [StudyInfoExport](./studyInfoExport/studyInfoExport.md)


----
![Results](../../../icons/results.png) [Results](../result/results.md)
