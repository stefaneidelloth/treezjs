import Executable from './executable.js';

export default class JavaExecutable extends Executable {

	constructor( name) {
		super(name);
		this.image = 'java.png';
		this.executablePath = 'D:/EclipseJava/App/jdk/bin/java.exe';
       
        this.classPath = undefined;
        this.fullClassName = undefined;
        this.jvmArguments = undefined;
	}


	
	 
	 __createExecutableSection(tab) {

			const section = tab.append('treez-section')
	            .label('Java executable');

	        section.append('treez-section-action')
	            .image('resetjobId.png')
	            .label('Reset jobId to 1')
	            .addAction(()=>this.__resetJobId());

	        section.append('treez-section-action')
	            .image('run.png')
	            .label('Run external executable')
	            .addAction(()=>this.execute(this.treeView)
	            				   .catch(error => {
	            					   	console.error('Could not execute  ' + this.constructor.name + ' "' + this.name + '"!\n', error);            					   
	            				   })
	            );  

	        const sectionContent = section.append('div'); 

	        sectionContent.append('treez-file-path')
	            .label('Path to java.exe')           
	            .onChange(()=>this.refreshStatus()) 
	            .nodeAttr('pathMapProvider', this)
	            .bindValue(this,()=>this.executablePath);            
		}  
	 

	 __createInterimSections(page){
		 this.__createClassPathSection(page);
		 this.__createJvmArgumentsSection(page);	    	
	 }

	

	__createClassPathSection(page) {

		const section = page.append('treez-section')
				.label("Class path (e. g. jar file)");
		
		//section.moveAtom(1);

		var sectionContent = section.append('div');
		
		sectionContent.append('treez-file-or-directory-path')
			.label('Class path (e. g. path to jar file that provides main class)')
			.nodeAttr('pathMapProvider', this)
			.onChange(()=>this.refreshStatus())
			.bindValue(this,()=>this.classPath);        
			
		sectionContent.append('treez-text-field')
			.label('Full name of main class')
			.onChange(()=>this.refreshStatus())
			.bindValue(this,()=>this.fullClassName);
		
	}

	__createJvmArgumentsSection(page) {
		
		const section = page.append('treez-section')
			.label('JVM arguments');

		//section.moveAtom(2);

		var sectionContent = section.append('div');
		
		sectionContent.append('treez-text-area')
			.label('Arguments for tweaking Java Virtual Maschine')
			.onChange(()=>this.refreshStatus())
			.bindValue(this,()=>this.jvmArguments);	

	}


	__buildCommand(){

		//''cmd.exe /C start /b /wait /low "''
		let command = '"' + this.fullPath(this.executablePath) + '"';
		command = this.__addJavaArguments(command);
		command = this.__addInputArguments(command);
		command = this.__addOutputArguments(command);
		command = this.__addLoggingArguments(command);
		return command;
	}	

	__addJavaArguments(commandToExtend) {
		var command = commandToExtend;		
		if (this.jvmArguments) {
			command += ' ' + this.jvmArguments;
		}
		
		if (this.classPath) {
			command += ' -cp "' + this.classPath + '"';
		}
		
		if (this.fullClassName) {
			command += ' ' + this.fullClassName;
		}
		return command;
	}	

}
