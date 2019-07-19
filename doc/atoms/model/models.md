![](../../../icons/root.png) [Root](../root.md)

----

# Models

The ![](../../../icons/models.png) Models atom represents a branch for all underlying model atoms. Creating the models is 
typically the first step in a simulation work flow. 

![](../../../images/models.png)

Model atoms inherit from [./src/model/model.js](../../../src/model/model.js) and the ![](../../../icons/models.png) Models atom istself is also a model that can be executed. Executing a ![](../../../../icons/models.png) Models atom simply means that all of its runnable child atoms are executed.

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

The property *studyId* is only used if a model is remotely executed as part of a study. The *studyId* cannot be manually specified in the [Properties View](../../views/propertiesView.md) for a model but is specified in the [Properties View](../../views/propertiesView.md) for a study. While executing a study, the *studyId* is automatically injected to the models. The models are able to apply the *studyId* when generating results. If a model is manually executed, the *studyId* is *undefined*.

### JobId

The property *jobId* is 1 by default. If a model is manually executed by a user, the *jobId* is **automatically increased by one after the current job (=model run) has been finished**. 

You can **reset the jobId** with the ![](../../../icons/resetJobId.png) "Reset jobId to 1" button of the ![](../../../../icons/models.png) Models atom. 

You can see the *jobId* for the next run in the [Properties View](../../views/propertiesView.md) for the ![](../../../icons/models.png) Models atom.

If a model is remotely executed as part of a study or as part of a parent model, a parent *jobId* is determined and the local/manual *jobId* is overwritten. 

## Work flow 

You can **execute** the ![](../../../../icons/models.png) Models atom either<br> 
a) with the ![](../../../../icons/run.png) run button in the upper right corner of the [Properties View](../../../views/propertiesView.md) or<br>
b) with the ![](../../../../icons/run.png) run button in the context menu of the atom in the [Tree View](../../../views/treeView.md) or<br>
c) remotely with another atom (e.g. as part of a ![](../../../../icons/sweep.png) [Sweep](../../study/sweep/sweep.md) study. 

Executing a ![](../../../../icons/models.png) Models atom simply means that all of its runnable child atoms are executed. 
The progress is shown in the [Monitoring View](../../../views/monitoringView.md). After the execution has been finished, the *jobId* is automatically increased by one.  


----
![Studies](../../../icons/studies.png) [Studies](../study/studies.md)
