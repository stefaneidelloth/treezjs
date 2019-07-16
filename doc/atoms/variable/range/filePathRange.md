<h2>FilePathVariableRange</h2>
	
	<p>
		<h3>Purpose</h3>
		
		<p>
		The purpose of the <a class = "filePathVariableRange"></a> is to edit a range of file paths. 
		It can for example be used by a <a class = "sweep"></a>. 
						
		<h3>Class name</h3>
		
		org.treez.study.atom.range.FilePathVariableRange
		
		<h3>Construction</h3>
		
		A new <a class = "filePathVariableRange"></a> is created by: 
		<ul>
			<li>using the context menu of a <a class="sweep"></a> atom or
			</li>
			<li>by calling the corresponding factory method of the <a class="sweep"></a> atom:	
			<pre class="prettyprint">FilePathVariableRange filePathRange = sweep.createFilePathVariableRange("filePathRange");</pre>	     
			</li>
		</ul>
						
		<img src="../images/filePathVariableRangeScreenShot.png">
								
		<h3>Attributes</h3>
		
		<ul>
			<li><b>File path variable</b>: the corresponding variable that should be controlled by the range.</li>
			<li><b>File paths</b>: a list of file paths. Use the button to edit the file path entries.</li>	
			<li><b>Validate paths</b>: if this option is enabled the file path entries are checked to point to existing files.</li>
			<li><b>Enabled</b>: if the range is disabled it will not be used by studies. Enabling/disabling a range is also
			possible through the context menu of the atom.</li>			
		</ul>
				
</p>
