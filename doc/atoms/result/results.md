[Atoms](../../atoms.md)
----

# Results

<H2>Results</H2>

<H3>Purpose</H3>

The <a class="results"></a> atom is the parent atom for all underlying result atoms. Creating the <a class="results"></a> is 
typically the last step in a simulation work flow. The purpose of the <a class="results"></a> section of the tree is to contain
data that results from the execution of <a class="models"></a> and <a class="studies"></a>. The <a class="results"></a> section 
is also the right place for diagram pages and reports.  

<H3>Class name</H3>

org.treez.study.atom.Results

<H3>Construction</H3>

A new <a class="results"></a> atom is created either 
<ul>
	<li>from the context menu of an existing <a class="root"></a> atom or 
	</li>
	<li>by calling the corresponding factory method of the <a class="root"></a> atom:	
	<pre class="prettyprint">Results results = root.createResults("results");</pre>	     
	</li>
</ul>

<H3>Context menu</H3>

The context menu of the <a class="results"></a> atom allows to add new child atoms: 
<ul>
<li><a class = "data"></a></li>
<li><a class = "page"> </a></li>
</ul>

</body>

----
[Content](../../../README.md)
