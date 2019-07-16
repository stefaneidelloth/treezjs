

<h2>GenericInputModel</h2>
	
	<p>
		<h3>Purpose</h3>
		
		<p>
		The purpose of the <a class = "genericInputModel"></a> is to provide a list of <b>VariablesFields</b> 
		that can be used by other models (e.g. by the <a class ="executable"></a> model). The <b>VariablesFields</b>
		of a <a class = "genericInputModel"></a> can also be referenced by a study atom 
		(e.g. <a class="sweep"></a>). The individual <b>VariablesFields</b> are shown in the <a class="treezPropertiesView"></a>
		 if the <a class = "genericInputModel"></a> is selected in the <a class="triesView"></a>. 
		For adding or removing a <b>VariablesField</b>, corresponding actions are available in the context menu
		of the <a class = "genericInputModel"></a>.
		</p> 
		<img src="images/genericInputModelScreenShot.png">
		
		<h3>Class name</h3>
		
		org.treez.model.atom.genericInput.GenericInputModel
		
		<h3>Construction</h3>
		
		A new <a class = "genericInputModel"></a> is created by: 
		<ul>
			<li>using the context menu of a <a class="models"></a> atom or
			</li>
			<li>by calling the corresponding factory method of the <a class="models"></a> atom:	
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
