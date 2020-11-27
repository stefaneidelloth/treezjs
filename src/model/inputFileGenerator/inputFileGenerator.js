import Model from './../model.js';
import Executable from './../executable/executable.js';
import AddChildAtomTreeViewAction from './../../core/treeView/addChildAtomTreeViewAction.js';
import InputModification from './../executable/inputModification.js';
import GenericInput from './../genericInput/genericInput.js';
import QuantityVariable from './../../variable/field/quantityVariable.js';

/**
 * The purpose of this atom is to generate an input text file that can be used as input for other atoms, e.g. the
 * Executable. It reads a template text file and replaces "tags"/"placeholders" with Quantities. The filled template is
 * then saved as new input file at the wanted input file path.
 */
export default class InputFileGenerator extends Model  {

	constructor(name) {		
		super(name);
		this.image = 'inputFile.png';
		this.isRunnable=true;
		
		this.__nameTag = '<name>';		
		this.__valueTag = '<value>';
		this.__unitTag = '<unit>';		
		
		this.templatePath = 'C:/template.txt';       
        
		this.sourceModelPath = 'root.models.genericInput';
        this.nameExpression = '{$' + this.__nameTag + '$}';
        this.valueExpression = this.__valueTag + ' [' + this.__unitTag + ']'; 
        
        this.isUsingInputPathProvider = true;
		this.pathOfInputPathProvider = 'root.models.executable';
        this.inputFilePath = 'C:/generated_input_file.txt';

		this.isWrappingStrings = false;
		this.stringWrapper = '"';
		 
        this.isDeletingUnassignedRows = false; 
        this.isForcingInjection = false;  

        this.__inputPathInfo = undefined;
        this.__pathOfInputPathProvierSelection = undefined;    
        this.__stringWrapperComponent = undefined;   
	}
	
	createComponentControl(tabFolder){    
	     
		const page = tabFolder.append('treez-tab')
            .label('Data');

		this.__createTemplateSection(page);
		this.__createSourceSection(page);  
		this.__createTargetSection(page); 	       
        this.__createStatusSection(page);

        this.__updateComponents();
	}

	async doRunModel(treeView, monitor){

		monitor.totalWork = 2;
				
		monitor.info('Executing InputFileGenerator "' + this.name + '"');
		        
		await window.treezTerminal.deleteFile(this.inputPath)
			 .catch((error)=>{
				monitor.error(error);
			 });;	

	   // var foo = await window.treezTerminal.executePythonCode('import os\nprint(os.getcwd())');


		var template = '';
		if(this.templatePath){
			var path = this.fullPath(this.templatePath);
			template = await window.treezTerminal.readTextFile(path) //
							 .catch((error)=>{
								monitor.error(error);
							 });
			if(!template){
				throw new Error('Could not read template at ' + this.fullPath(this.templatePath));
			}
		} else {
			if(!this.isForcingInjection){
				var message = 'You must specify a template file or enable the option "Force injection".'
				throw new Error(message);
			}
		}		

		monitor.worked(1);

		var sourceModelAtom = this.childFromRoot(this.sourceModelPath);	
		
		var inputFileString = this.__applySourceModelToTemplate(template, sourceModelAtom);

		if (inputFileString.length === 0) {
			var message = 'The input file "' + this.inputPath + 
						  '" is empty. Please check the template, the styles and the source variables.';
			monitor.warn(message);
		}

		await window.treezTerminal.writeTextFile(this.inputPath, inputFileString)
			.catch((error)=>{
				monitor.error(error);
			});

		monitor.done();		
				
	}	

	__createTemplateSection(page) {

		const section = page.append('treez-section')
        	.label('Template');	 

        this.createHelpAction(section, 'model/inputFileGenerator/inputFileGenerator.md#template');  
	    
	    var sectionContent = section.append('div'); 

	    sectionContent.append('treez-file-path')
        	.label('Template for input file (contains variable placeholders)')  
        	.nodeAttr('pathMapProvider', this)
        	.bindValue(this,()=>this.templatePath);

        sectionContent.append('treez-text-field')
			.label('Style for variable placeholder')			
			.bindValue(this,()=>this.nameExpression);
		
	    sectionContent.append('treez-text-field')
			.label('Style for variable injection')			
			.bindValue(this,()=>this.valueExpression);

		sectionContent.append('treez-check-box')
			.label('Wrap string values')			
			.bindValue(this,()=>this.isWrappingStrings)
			.onChange(()=>this.__updateComponents());

		this.__stringWrapperComponent = sectionContent.append('treez-text-field')
			.label('String wrapper (= "quotation mark for string values")')			
			.bindValue(this,()=>this.stringWrapper);

		sectionContent.append('treez-check-box')
			.label('Delete unused rows (= template rows with unassigned variable placeholders).')
			.bindValue(this,()=>this.isDeletingUnassignedRows);	

		sectionContent.append('treez-check-box')
			.label('Force injection (of all enabled variables at end of template).')
			.bindValue(this,()=>this.isForcingInjection);	

	}

	__createSourceSection(page) {
		
		const section = page.append('treez-section')
        	.label('Source');	 

        this.createHelpAction(section, 'model/inputFileGenerator/inputFileGenerator.md#source');   
	    
	    var sectionContent = section.append('div');         
	    
	    sectionContent.append('treez-model-path')
			.label('Variable source model (provides variables)')	
			.nodeAttr('atomClasses', [Model])			
			.bindValue(this,()=>this.sourceModelPath);	    
	}

	__createTargetSection(page){

		const section = page.append('treez-section')
        	.label('Target');

        this.createHelpAction(section, 'model/inputFileGenerator/inputFileGenerator.md#target');

	    section.append('treez-section-action')
	        .image('resetJobId.png')
	        .label('Reset jobId to 1')
	        .addAction(()=>this.__resetJobId());

	    section.append('treez-section-action')
	        .image('run.png')
	        .label('Generate input file')
	        .addAction(
	        ()=>this.execute(this.__treeView)
	                .catch(error => {
	                	console.error('Could not execute  ' + this.constructor.name + ' "' + this.name + '"!', error);	                	
			  		})
	        ); 
	    
	    var sectionContent = section.append('div'); 

	    sectionContent.append('treez-check-box')
        	.label('Use input path provider')        	
        	.bindValue(this, ()=>this.isUsingInputPathProvider)
        	.onChange(()=>this.__updateComponents());

		this.__pathOfInputPathProviderComponent = sectionContent.append('treez-model-path')
            .label('Input path provider') 
            .nodeAttr('atomFunctionNames', ['provideInputPath'])
            .bindValue(this,()=>this.pathOfInputPathProvider)
            .onChange(()=>this.__updateComponents()) ;

        this.__inputFilePathComponent = sectionContent.append('treez-file-path')
	    	.label('Input file to generate (=target)')
	    	.nodeAttr('pathMapProvider', this)
	    	.bindValue(this,()=>this.inputFilePath)
	    	.onChange(()=>this.refreshStatus())	;    

	}

	__updateComponents(){

		if(this.__stringWrapperComponent){
			if(this.isWrappingStrings){
				this.__stringWrapperComponent.show();
			} else {
				this.__stringWrapperComponent.hide();
			}
		}
		

		if(this.__pathOfInputPathProviderComponent){
			if(this.isUsingInputPathProvider){
				this.__pathOfInputPathProviderComponent.show();
				this.__inputFilePathComponent.hide();
				this.inputFilePath = this.__pathFromInputPathProvider();
			} else {
				this.__pathOfInputPathProviderComponent.hide();
				this.__inputFilePathComponent.show();
			}	
		}
			
		this.refreshStatus();	
	};

	__pathFromInputPathProvider(){
		if(!this.pathOfInputPathProvider){
			return null;
		}
		var inputPathProvider = this.childFromRoot(this.pathOfInputPathProvider);
		
		return inputPathProvider
			?inputPathProvider.provideInputPath()
			:null;		
	}
	

	__createStatusSection(page) {
		
		const section = page.append('treez-section')
        	.label('Status')
        	.attr('open',false);

        this.createHelpAction(section, 'model/inputFileGenerator/inputFileGenerator.md#status');

		var sectionContent = section.append('div'); 
		
		sectionContent.append('treez-text-area')
			.label('Resulting input file path')
			.disable() 
			.bindValue(this, ()=>this.__inputPathInfo);	
		
		this.refreshStatus();

	}

	refreshStatus() {			
		this.__inputPathInfo = this.inputPath;	
	}
	

	__applySourceModelToTemplate(templateString, sourceModel) {	

		var resultString = templateString;

		var variables = sourceModel.enabledVariables;

		var defaultUnit = '1';

		if(templateString){
			for(var variable of variables){			

				var unit = variable instanceof QuantityVariable
							?variable.unit
							:defaultUnit;			

				var placeholderExpression = this.__createPlaceHolderExpression(variable.name);

				var injectedExpression = this.__createExpressionToInject(variable.name, variable.value, unit);

				//inject expression into template
				//console.info('Template placeholder to replace: "' + placeholderExpression + '"');
				//console.info('Expression to inject: "' + injectedExpression + '"');
				resultString = this.__replaceAll(resultString, placeholderExpression, injectedExpression);
			}	

			if (this.isDeletingUnassignedRows) {
				resultString = this.__deleteRowsWithUnassignedPlaceHolders(resultString);
			}
		}

		if (this.isForcingInjection){
			for(var variable of variables){	

				var unit = variable instanceof QuantityVariable
								?variable.unit
								:defaultUnit;	

				var injectedExpression = this.__createExpressionToInject(variable.name, variable.value, unit);
				resultString = resultString + injectedExpression;
			}
		}

		return resultString;
	}

	//The normal string.replace(...) method only replaces the first occurance of a string.
	//In order to replace all occurrances, this method applys a global regular expression.
	//The expression to be replaced might contain special regular expression characters.
	//Those characteres are escaped here, so that they are treaded as normal characters.  
	__replaceAll(text, expressionToReplace, expressionToInject){
		var escapedExpression = expressionToReplace.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		var regularExpression = new RegExp(escapedExpression, 'g')
        return text.replace(regularExpression, expressionToInject);
	}

	__createExpressionToInject(variableName, value, unitString, monitor) {

		var injectedExpression;
		injectedExpression = this.valueExpression.replace(this.__nameTag, variableName);

        var valueString = this.__valueString(variableName, value, monitor);
		injectedExpression = injectedExpression.replace(this.__valueTag, valueString);
		
		if (unitString != null) {
			injectedExpression = injectedExpression.replace(this.__unitTag, unitString);
		} else {
			//remove unit tag
			injectedExpression = injectedExpression.replace(this.__unitTag, '');
		}

		injectedExpression = injectedExpression.replace(/\\n/g,'\n');
		return injectedExpression;
	}

	__valueString(variableName, value, monitor){
		var valueString = '' + value;
		if (value === null) {
			var message = 'Value for variable "' + variableName + '" is null.';
			monitor.warn(message);
			return 'null';
		} else {
			if (typeof value === 'string' || value instanceof String){
				valueString = this.stringWrapper + valueString  + this.stringWrapper;
			}
		}
		return valueString;
	}

	 __createPlaceHolderExpression(variableName) {
		var placeholderExpression;
		var containsName = this.nameExpression.indexOf(this.__nameTag) > -1;
		if (containsName) {
			placeholderExpression = this.nameExpression.replace(this.__nameTag, variableName);
		} else {
			var message = 'The placeholder must contain a ' + this.__nameTag + ' tag.';
				throw new Error(message);
		}
		return placeholderExpression;
	}

	 __deleteRowsWithUnassignedPlaceHolders(resultString) {
		var generalPlaceHolderExpression = this.nameExpression.replace(/\{/g, '\\{');
		generalPlaceHolderExpression = generalPlaceHolderExpression.replace(/\}/g, '\\}');
		generalPlaceHolderExpression = generalPlaceHolderExpression.replace(/\$/g, '\\$');
		generalPlaceHolderExpression = generalPlaceHolderExpression.replace(/<name>/g, '.*');
		generalPlaceHolderExpression = generalPlaceHolderExpression.replace(/<label>/g, '.*');

		if (generalPlaceHolderExpression === '.*') {
			var message = 'The deletion of rows with unassigned placeholders is not yet implemented for placeholders'
					+ 'of the type "' + nameExpression
					+ '". Please adapt the name expression or disable the deletion of template rows'
					+ 'with unassigned variable placeholders.';
			console.warn(message);
			return resultString;
		}

		var lines = resultString.split('\n');
		var removedLines = [];
		var newLines = [];

		var pattern = new RegExp(generalPlaceHolderExpression,'g');

		lines.forEach((line)=>{
			var matches = line.match(pattern);		
			if (matches) {
				removedLines.push(line);
			} else {
				newLines.push(line);
			}
		});

		var newResultString = newLines.join('\n');
		if (removedLines.length>0) {
			var message = 'Some rows with unassigned variable placeholders have been removed from the input file:\n'
					+ removedLines.join('\n');
			console.info(message);
		}
		return newResultString;
	}

	extendContextMenuActions(actions, treeViewer) {
		return actions;
	}	

	getJobId(){
		if(this.parent){
			return this.parent.gobId;
		} else {
			return '{unknownJobId}';
		}
	}

	get inputPath(){
		if(this.isUsingInputPathProvider){
			var path = this.__pathFromInputPathProvider();
			return path;			
		} else {
			return this.inputFilePath;
		}		
	}	

}
