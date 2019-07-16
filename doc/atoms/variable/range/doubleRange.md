<h2>DoubleVariableRange</h2>
	
	<p>
		<h3>Purpose</h3>
		
		<p>
		The purpose of the <a class = "doubleVariableRange"></a> is to edit a range of double values. 
		It can for example be used by a <a class = "sweep"></a>. 
						
		<h3>Class name</h3>
		
		org.treez.study.atom.range.DoubleVariableRange
		
		<h3>Construction</h3>
		
		A new <a class = "doubleVariableRange"></a> is created by: 
		<ul>
			<li>using the context menu of a <a class="sweep"></a> atom or
			</li>
			<li>by calling the corresponding factory method of the <a class="sweep"></a> atom:	
			<pre class="prettyprint">DoubleVariableRange doubleRange = sweep.createDoubleVariableRange("doubleRange");</pre>	     
			</li>
		</ul>
						
		<img src="../images/doubleVariableRangeScreenShot.png">
								
		<h3>Attributes</h3>
		
		<ul>
			<li><b>Double variable</b>: the corresponding variable that should be controlled by the range.</li>
			<li><b>Range</b>: a comma separated list of range values in curly brackets, e.g. {0.5, 1, 1.5, 2} or a range command
			range(min, max, step), e.g. range(0.5, 2, 0.5) </li>	
			<li><b>Enabled</b>: if the range is disabled it will not be used by studies. Enabling/disabling a range is also
			possible through the context menu of the atom.</li>			
		</ul>
				
</p>