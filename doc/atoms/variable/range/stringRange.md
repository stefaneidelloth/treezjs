<h2>StringVariableRange</h2>
	
	<p>
		<h3>Purpose</h3>
		
		<p>
		The purpose of the <a class = "stringVariableRange"></a> is to edit a range of Strings. 
		It can for example be used by a <a class = "sweep"></a>. 
						
		<h3>Class name</h3>
		
		org.treez.study.atom.range.FilePathVariableRange
		
		<h3>Construction</h3>
		
		A new <a class = "stringVariableRange"></a> is created by: 
		<ul>
			<li>using the context menu of a <a class="sweep"></a> atom or
			</li>
			<li>by calling the corresponding factory method of the <a class="sweep"></a> atom:	
			<pre class="prettyprint">StringVariableRange stringRange = sweep.createStringVariableRange("stringRange");</pre>	     
			</li>
		</ul>
						
		<img src="../images/stringVariableRangeScreenShot.png">
								
		<h3>Attributes</h3>
		
		<ul>
			<li><b>String variable</b>: the corresponding variable that should be controlled by the range.</li>
			<li><b>Range</b>: a list of Strings. Use the button to edit the String entries.</li>				
			<li><b>Enabled</b>: if the range is disabled it will not be used by studies. Enabling/disabling a range is also
			possible through the context menu of the atom.</li>			
		</ul>
				
</p>