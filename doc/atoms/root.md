[Atoms](../atoms.md)
----

# Root

<H3>Description</H3>

The  <a class="root"></a> atom represents the <b>first node of the tree</b> in the <a class = "treezView"></a>. 
When a Java file is imported from the <a class = "textEditor"></a> to the <a class = "treezView"></a>, the 
source code is compiled and a method <b>createModel</b> is called. This method call  yields a <a class="root"></a> 
atom which is put as the <b>content of the</b> <a class = "treezView"></a>. In order to ensure that this process
works correctly, the source code has to implement the interface <b>org.treez.core.scripting.ModelProvider</b>.
The <b>return argument</b> of the method <b>createModel</b> in that interface is a <a class="root"></a> atom. 
  

<H3>Class name</H3>

org.treez.views.treeView.rootAtom.Root

<H3>Construction</H3>

There are two ways to <b>create a new <a class="root"></a> atom</b>: 
<ul>
	<li>click on the <b>Create root</b>-button in the <b>tool bar</b> of the <a class = "treezView"></a>. This 
	    will delete the current content of the <a class = "treezView"></a> and create a new <a class="root"></a> atom. 
	    (If you export the <a class="root"></a> to the <a class = "textEditor"></a>, you will get some Java code 
	    that looks like the code below.)
	</li>
	<li>by calling the constructor of the <a class="root"></a> atom in a <b>Java file</b>. If you save the following 
	    code as a Java file "HelloWorld.java", open it with a <a class = "textEditor"></a> and <b>import</b> it into the 
	    <a class = "treezView"></a>, you will have created a <a class="root"></a> atom with the label "helloWorldRoot".	
	<pre class="prettyprint">package org.treez.example;

import org.treez.core.scripting.ModelProvider;
import org.treez.views.treeView.rootAtom.Root;

public class HelloWorld extends ModelProvider {

	@Override
	public Root createModel() {

		Root root = new Root("helloWorldRoot");

		return root;

	}
}</pre>	     
	</li>
</ul>

<H3>Adding child atoms to the Root atom</H3>

If you right-click on the <a class="root"></a> atom in the <a class = "treezView"></a>, you will see 
<b>context menu actions</b> that allow you to <b>add new child atoms</b>: 
<ul>
<li><a class="models"></a></li>
<li><a class="studies"></a></li>
<li><a class="results"></a></li>
</ul>

As an alternative to the tree node operations, you can also add child atoms to the Root atom by <b>creating and 
adding child atoms in the code</b>. Follow the above links if you want to learn more about it.
</pre>

<H3>Meaning of the available child atoms</H3>

As already stated in the introduction, the <b>atoms</b> that come with Treez are thought to model an 
exemplary <b>simulation work flow</b>. The atom <b>Models</b> typically includes, as the name suggest, 
some models. The <b>first step of the simulation work flow</b> is to fill that part of the tree with meaningful
content. A model can be <b>started manually</b> with a specific <b>set of properties</b>. If you want to 
<b>run a model many times</b>, for example to perform a <b>sensitivity analysis</b>, it makes sense to 
automate this time consuming task. The purpose of the atoms that can be found under the <b>Studies</b> 
atom is the automated model execution. Finally the results of the model runs are <b>inspected</b> 
and <b>evaluated</b> with the last part of the tree: the Results atom and its children.    

</body>

<!-- add hyper links -->
<script> 
	$('.treezView').attr('href','../treezView/TreezView.html');  		
	$('.models').attr('href','../../../org.treez.model/help/atoms/Models.html'); 	
	$('.studies').attr('href','../../../org.treez.study/help/atoms/Studies.html'); 	
	$('.results').attr('href','../../../org.treez.results/help/atoms/Results.html'); 		 
</script>

----
[Models](./model/models.md)
