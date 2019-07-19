![](../../../icons/root.png) [Root](../root.md)

----

# Models

The ![](../../../icons/models.png) Models atom represents a branch for all underlying model atoms. Creating the models is 
typically the first step in a simulation work flow. 

![](../../../images/models.png)

Model atoms inherit from [./src/model/model.js](../../../src/model/model.js)

## Source code

[./src/model/models.js](../../../src/model/models.js)

## Construction

A new ![](../../../icons/models.png) Models atom is created either 


* from the context menu of an existing ![](../../../icons/root.png) [Root](../root.md) atom in the [Tree View](../../views/treeView.md) or 

* by calling the corresponding factory method of the ![](../../../icons/root.png) [Root](../root.md) atom in the source code of the [Editor View](../../views/editorView.md):	

```javascript
    ...
    var models = root.createModels();	     
```

## Child atoms

The context menu of the ![](../../../icons/models.png) Models atom allows to add child atoms: 

* ![](../../../icons/path.png) [Path](./path/path.md)
* ![](../../../icons/genericInput.png) [GenericInput](./genericInput/genericInput.md)
* ![](../../../icons/databaseModifier.png) [DatabaseModifier](./code/databaseModifier.md)
* ![](../../../icons/run.png) [Executable](./executable/executable.md) 
* ![](../../../icons/java.png) [JavaExecutable](./executable/javaExecutable.md)  	
* ![](../../../icons/tableImport.png) [TableImport](./tableImport/tableImport.md)
* ![](../../../icons/databaseAppender.png) [SqLiteAppender](./sqLiteAppender/sqLiteAppender.md) 
* ![](../../../icons/javaScript.png) [JavaScriptModel](./code/javaScriptModel.md)
* ![](../../../icons/python.png) [PythonModel](./code/pythonModel.md)


## StudyId and JobId

The ![](../../../../icons/models.png) Models atom has two properties that are used to differentiate
subsequent runs:

### StudyId

The property *studyId* is only used if a model is remotely executed as part of a study. The *studyId* cannot be manually specified in the Properties View for a model but is automatically injected in the context of a study. 

### JobId

The property *jobId* is 1 by default. If a model is manually executed by a user, the *jobId* is **automatically increased by one after the current job (=model run) has been finished**. You can **reset the jobId** with the ![](../../../icons/path.png) "Reset jobId to 1" button of the ![](../../../../icons/models.png) Models atom. 

If a model is remotely executed as part of a study, the manual *jobId* is overwritten by the injected *jobId*, which is determined by the study. 

## Work flow 

You can **run** the ![](../../../../icons/models.png) Models atom either<br> 
a) with the ![](../../../../icons/run.png) run button in the upper right corner of the [Properties View](../../../views/propertiesView.md) or<br>
b) with the ![](../../../../icons/run.png) run button in the context menu of the atom in the [Tree View](../../../views/treeView.md) or<br>
c) remotely with another atom (e.g. as part of a ![](../../../../icons/sweep.png) [Sweep](../../study/sweep/sweep.md) study. 


----
![Studies](../../../icons/studies.png) [Studies](../study/studies.md)
