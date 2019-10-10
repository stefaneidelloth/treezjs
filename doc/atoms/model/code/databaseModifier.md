![](../../../../icons/models.png) [Models](../models.md)

----

# DatabaseModifier
		
The purpose of the ![](../../../../icons/databaseModifier.png) DatabaseModifier atom is to modify a database by executing a query.
	
![](../../../images/databaseModifier.png)
		
## Source code

[./src/model/databaseModifier/databaseModifier.js](../../../../src/model/databaseModifier/databaseModifier.js)

## Construction
		
A new ![](../../../../icons/databaseModifier.png) DatabaseModifier atom is created either by: 

* using the context menu of a ![](../../../../icons/models.png) [Models](../models.md) atom in the [Tree View](../../../views/treeView.md) or
* calling the corresponding factory method of the ![](../../../../icons/models.png) [Models](../models.md) atom in the source code of the [Editor view](../../../views/editorView.md):

```javascript
    ...
    var databaseModifier = models.createDatabaseModifier();	     
```

## Work flow	

You can **run** the ![](../../../../icons/databaseModifier.png) DatabaseModifier atom either<br> 
a) with the ![](../../../../icons/run.png) run button in the upper right corner of the [Properties View](../../../views/propertiesView.md)<br>
b) with the ![](../../../../icons/run.png) run button in the context menu of the atom in the [Tree View](../../../views/treeView.md)<br>
c) with the ![](../../../../icons/run.png) run button in the context menu of the parent ![](../../../../icons/models.png) [Models](../models.md) atom in the [Tree View](../../../views/treeView.md) (runs all executable models)<br>
d) remotely with another atom (e.g. as part of a ![](../../../../icons/sweep.png) [Sweep](../../study/sweep/sweep.md) study. 

			
## Sections

### Source model

The tree path of a model that provides variables (e.g. "root.models.genericInput"). 

Leave this input field empty if you 
* do not want to inject variable values into the query code or you 
* only want to use the ("global") variables jobId and studyId.  

### Target database

#### Type

Choose the type of database that you want to modify. The visibility of the following arguments might depend on the type.

#### File path

The path to some \*.sqlite file (not relevant for the type mySql).

#### Host

The host name or IP address of a MySQL server, for example "fooserver" or "153.96.123.456".

#### Port

The port number of a MySQL server, for example 3306.

#### Schema name

A single MySQL database can include several "sub databases", called "schema".
Please specifiy the name of the schema that contains the table you would like
to modify. 

#### User

The user name, for example "root". 

#### Password

A password only needs to be specified if the database is password protected.

### Code

The query to be executed. The query might contain variable placeholders (e.g. {$jobId$}) that are replaced with the actual variable values before the query is executed. 

### Status

A preview of the resulting query (including injected variable values).

----

![](../../../../icons/fileCleanup.png) [FileCleanup](../fileCleanup/fileCleanup.md)	
