


<h2>Sweep</h2>


<h3>Purpose</h3>
<p>
The purpose of the <a class = "sweep"></a> atom is to execute a model several times while
the input parameters are varied according to a list of parameter ranges. Characteristic 
for a sweep is that it its input can be imagined as a rectangular grid or matrix (see below) and 
that every node of that grid is used. In comparison to that, a <a class = "scenarios"></a> 
study might not use every node on a grid and the grid does not need to be rectangular.    
The execution of a model is also called "simulation" and the model that is controlled 
by a <a class = "sweep"></a> might consist of several sub models.   
</p>

<h3>Class name</h3>

org.treez.model.atom.Models

<H3>Construction</H3>

You can create a new <a class = "sweep"></a> atom: 
<ul>
	<li>from the context menu of an existing <a class = "studies"></a> atom or
	</li>
	<li>by calling the corresponding factory method of an <a class = "studies"></a> atom:	
	<pre class="prettyprint">Sweep sweep = studies.createSweep("sweep");</pre>	     
	</li>
</ul>

<h2> Simulation order </h2>

<p>
If there are for example two parameter ranges [10,20,30,40], [100,200], you can imagine 
a 4 x 2 table or a grid with 8 nodes, where each node represents the input for a simulation
(e.g. {10,100} or {30,200}). The first value of the first range (e.g. 10) is included in 
the first simulation. That value is kept constant while the remaining range is varied.
</p>

<img src = "images/sweeptable.png"/>

<p> 
The numbers 1...8 represent the simulation order (="study index"). A sweep can also be 
understood as a tree structure, where the elements of the first range build
the main tree nodes, the elements of the second range build sub level tree nodes
and so on. Each existing path in the tree (e.g. 10=>100 or 30=>200) corresponds to an
individual simulation.
</p>

<img src = "images/sweeptree.png"/>

<h3>Attributes</h3>

<ul>
<li><b>Model to run</b>: the model that is executed by the sweep.</li>
<li><b>Variable source model</b>: the model that provides the variables that can be varied. Only the variables that are provided by
              this model and its sub models can be referenced by the variable ranges of the sweep. The variable source model might 
              be the same as the model to run.</li>
<li><b>Export sweep information</b>: if this is true, information about the sweep (total number of simulations, range values) will 
              be exported to a text file. </li>
<li><b>Target file path for sweep information</b>: the path to a text file, e.g. C:\sweepdata.txt, where the sweep information
              is exported. If the option <b>Export sweep information</b> is false, this argument is disabled and not used.</li>
</ul>

<h3>Ranges</h3>

The ranges for a <a class = "sweep"></a> atom are defined through child atoms. 
The context menu of the <a class = "sweep"></a> atom allows you to add new children and you
can also add range atoms by adapting the source code. There exist several kinds of ranges
which differ in the type of the individual values they include:

<ul>
<li><a class="quantityVariableRange"></a></li>
<li><a class="doubleVariableRange"></a></li>
<li><a class="booleanVariableRange"></a></li>
<li><a class="stringVariableRange"></a></li>
<li><a class="filePathVariableRange"></a></li>
<li><a class="directoryPathVariableRange"></a></li>
</ul>

The ranges can be enabled/disabled through their context menu. If a range is disabled it is
not included in the sweep. 


</body>
