[Atoms](../../atoms.md)
----

# Studies

<H2>Studies</H2>

<H3>Purpose</H3>

The <a class="studies"></a> atom is the parent atom for all underlying study atoms. Creating the <a class="studies"></a> is 
typically the second step in a simulation work flow. The <a class="models"></a> section of the tree is already finished and 
we want to analyze the <a class="models"></a> in detail. This typically requires to execute the models many times and the
purpose of the <a class="studies"></a> is to automate this tedious process. Each individual study (the children of the 
<a class="studies"></a> atom ) implements the interface <b>org.treez.study.atom.Study</b>. A study might produce results in
the <a class="results"></a> section of the tree. 

<H3>Class name</H3>

org.treez.study.atom.Studies

<H3>Construction</H3>

A new <a class="studies"></a> atom is created either 
<ul>
	<li>from the context menu of an existing <a class="root"></a> atom or 
	</li>
	<li>by calling the corresponding factory method of the <a class="root"></a> atom:	
	<pre class="prettyprint">Studies studies = root.createStudies("studies");</pre>	     
	</li>
</ul>

<H3>Context menu</H3>

The context menu of the <a class="studies"></a> atom allows to add new child studies: 
<ul>
<li><a class = "sweep"></a></li>
<li><a class = "sensitivity"> </a></li>
</ul>


----
![Results](../../../icons/results.png) [Results](../result/results.md)
