![](../../../../icons/models.png) [Models](../models.md)

----

# SqLiteAppender
		
The purpose of the ![](../../../../icons/databaseAppender.png) SqLiteAppender atom is to append a whole source SqLite database to target SqLite database.
while executing a study. 

The target database might initially be empty. The required tables are created if they do not yet exist. 

In order to distinguish the data from subsequent sources, the source tables are extented with two columns *study_id*, *job_id*.
The extended tables are then attached to the target database. 

The ![](../../../../icons/databaseAppender.png) SqLiteAppender is only thought for small amounts of data and might be very slow for large databases. The current implementation is done in the client and all the data is send back and forth through string based http requests. 
	
![](../../../images/sqlite_appender.png)
		
## Source code

[./src/model/sqLiteAppender/databaseAppender.js](../../../../src/model/sqLiteAppender/sqLiteAppender.js)

## Construction
		
A new ![](../../../../icons/databaseAppender.png) SqLiteAppender atom is created either by: 

* using the context menu of a ![](../../../../icons/models.png) [Models](../models.md) atom in the [Tree View](../../../views/treeView.md) or
* calling the corresponding factory method of the ![](../../../../icons/models.png) [Models](../models.md) atom in the source code of the [Editor view](../../../views/editorView.md):

```javascript
    ...
    var sqLiteAppender = models.createSqLiteAppender();	     
```

## Work flow	

You can **run** the ![](../../../../icons/databaseAppender.png) SqLiteAppender atom either<br> 
a) with the ![](../../../../icons/run.png) run button in the upper right corner of the [Properties View](../../../views/propertiesView.md)<br>
b) with the ![](../../../../icons/run.png) run button in the context menu of the atom in the [Tree View](../../../views/treeView.md)<br>
c) with the ![](../../../../icons/run.png) run button in the context menu of the parent ![](../../../../icons/models.png) [Models](../models.md) atom in the [Tree View](../../../views/treeView.md) (runs all executable models)<br>
d) remotely with another atom (e.g. as part of a ![](../../../../icons/sweep.png) [Sweep](../../study/sweep/sweep.md) study. 

----

![](../../../../icons/javaScript.png) [JavaScriptModel](../code/javaScriptModel.md)
