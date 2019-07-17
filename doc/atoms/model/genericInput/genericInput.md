![](../../../../icons/models.png) [Models](../models.md)

----

# GenericInput

The purpose of the ![](../../../../icons/genericInput.png) GenericInput atom is to provide a **list of variables** that can be **referenced and used by other atoms** (e.g. by a ![](../../../../icons/inputFile.png) [InputFileGenerator](../../model/inputFileGenerator/inputFileGenerator.md) or the ranges for a ![](../../../../icons/sweep.png) [Sweep](../../study/sweep/sweep.md) study). 

If you click on a ![](../../../../icons/genericInput.png) GenericInput atom in the [Tree View](../../../views/treeView.md), the values for the variables can be edited inthe [Properties View](../../../views/propertiesView.md).

The context menu of the ![](../../../../icons/genericInput.png) GenericInput atom in the [Tree View](../../../views/treeView.md) provides actions for adding variables.

![](../../../images/generic_input.png)

## Source code

[/src/model/genericInput/genericInput.js](../../../../src/model/genericInput/genericInput.js)
		
## Construction
		
A new ![](../../../../icons/genericInput.png) GenericInput atom is created either by: 

* using the context menu of a ![](../../../../icons/models.png) [Models](../models.md) atom in the [Tree View](../../../views/treeView.md) or
* calling the corresponding factory method of the ![](../../../../icons/models.png) [Models](../models.md) atom in the source code of the [Editor view](../../../views/editorView.md):


			<pre class="prettyprint">GenericInputModel genericModel = models.createGenericInputModel("genericModel");</pre>	     
			</li>
		</ul>
		
		<h3>Context menu</h3>
		
		The context menu allows to add a new child atoms: 
		<ul>
		
		<li><a class="quantityVariableField"></a></li>
		<li><a class="doubleVariableField"></a></li>
		<li><a class="booleanVariableField"></a></li>
		<li><a class="stringVariableField"></a></li>
		<li><a class="filePathVariableField"></a></li>
		<li><a class="directoryPathVariableField"></a></li>
		</ul>
</p>

----

![](../../../../icons/run.png) [Executable](../executable/executable.md)

