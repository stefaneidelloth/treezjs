![](../../../icons/root.png) [Root](../root.md)

----

# Models

The ![](../../../icons/models.png) Models atom is the parent atom for all underlying model atoms. Creating the models is 
typically the first step in a simulation work flow. Each individual model atom (the children of the Models atom)
inherits from <b>./src/model/model.js</b>.

# Source code

[./src/model/models.js](../../../src/model/models.js)

# Construction

A new ![](../../../icons/models.png) Models atom is created either 


* from the context menu of an existing ![](../../../icons/root.png) [Root](../root.md) atom or 

* by calling the corresponding factory method of the ![](../../../icons/root.png) [Root](../root.md) atom in the source code:	

```javascript
    ...
    var models = root.createModels();	     
```

# Child atoms

The context menu of the ![](../../../icons/models.png) Models atom allows to add child models: 

* ![](../../../icons/genericInput.png) [GenericInputModel](./genericInputModel.md)
* ![](../../../icons/run.png) [Executable](./executable.md)


----
![Studies](../../../icons/studies.png) [Studies](../study/studies.md)
