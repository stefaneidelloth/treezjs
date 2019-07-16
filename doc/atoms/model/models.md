[Root](../root.md)

----

# Models

The <a class="models"></a> atom is the parent atom for all underlying model atoms. Creating the <a class="models"></a> is 
typically the first step in a simulation work flow. Each individual model atom (the children of the <a class="models"></a> atom)
implements the interface <b>org.treez.model.interfaces.Model</b>.

# Source code

org.treez.model.atom.Models

# Construction

A new <a class="models"></a> atom is created either 
<ul>
	<li>from the context menu of an existing <a class="root"></a> atom or 
	</li>
	<li>by calling the corresponding factory method of the <a class="root"></a> atom:	
	<pre class="prettyprint">Models models = root.createModels("models");</pre>	     
	</li>
</ul>

<H3>Context menu</H3>

The context menu of the <a class="models"></a> atom allows to add new child models: 
<ul>
<li><a class = "genericInputModel"></a></li>
<li><a class = "executable"> </a></li>
</ul>

----
![Studies](../../../icons/studies.png) [Studies](../study/studies.md)
