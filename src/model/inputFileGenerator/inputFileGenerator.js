import Model from './../model.js';
import Executable from './../executable/executable.js';
import AddChildAtomTreeViewAction from './../../core/treeview/addChildAtomTreeViewAction.js';
import InputModification from './../executable/inputModification.js';
import GenericInput from './../genericInput/genericInput.js';
import QuantityVariable from './../../variable/field/quantityVariable.js';

/**
 * The purpose of this atom is to generate an input text file that can be used as input for other atoms, e.g. the
 * Executable. It reads a template text file and replaces "tags"/"place holders" with Quantities. The filled template is
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
        this.valueExpression = this.valueTag + ' [' + this.__unitTag + ']'; 
        
        this.inputPath = 'C:/generated_input_file.txt';
        this.__inputPathInfo = undefined;

        this.isDeletingUnassignedRows = false;  
	}

	
	 
	extendContextMenuActions(actions, parentSelection, treeView) {
			
		this.treeView=treeView;			
		
		const addInputModification = new AddChildAtomTreeViewAction(
				InputModification,
				"inputModification",
				"inputModification.png",
				parentSelection,
				this,
				treeView);
		actions.push(addInputModification);
		
		return actions;
	}
	
	createInputModification(name) {
		const child = new InputModification(name);
		this.addChild(child);
		return child;
	}
	
	createComponentControl(tabFolder){    
	     
		const page = tabFolder.append('treez-tab')
            .label('Data');

		this.__createInputSection(page); 	       
        this.__createStatusSection(page);
	}

	async doRunModel(treeView, monitor){

		monitor.totalWork = 2;
				
		monitor.info('Executing InputFileGenerator "' + this.name + '"');

		var modifiedInputPath = this.__getModifiedInputPath();				
		        
		await window.treezTerminal.deleteFile(modifiedInputPath)
			 .catch((error)=>{
				monitor.error(error);
			 });;	

		var template = await window.treezTerminal.readTextFile(this.fullPath(this.templatePath)) //
							 .catch((error)=>{
								monitor.error(error);
							 });

		if(!template){
			throw new Error('Could not read template at ' + this.fullPath(this.templatePath));
		}

		monitor.worked(1);

		var sourceModelAtom = this.childFromRoot(this.sourceModelPath);	
		
		var inputFileString = this.__applyTemplateToSourceModel(template, sourceModelAtom);

		if (inputFileString.length === 0) {
			var message = 'The input file "' + modifiedInputPath
					+ '" is empty. Please check the place holder and the source variables.';
			monitor.warn(message);
		}

		await window.treezTerminal.writeTextFile(modifiedInputPath, inputFileString);	

		monitor.done();		
				
	}	

	__createInputSection(page) {
		
		const section = page.append('treez-section')
        .label('Input');

	    section.append('treez-section-action')
	        .image('resetjobId.png')
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

	    sectionContent.append('treez-file-path')
        	.label('Template for input file (contains variable place holders)')  
        	.nodeAttr('pathMapProvider', this)
        	.bindValue(this,()=>this.templatePath);
        
	    
	    sectionContent.append('treez-model-path')
			.label('Variable source model (provides variables)')	
			.nodeAttr('atomClasses', [Model])			
			.bindValue(this,()=>this.sourceModelPath);
	

	    sectionContent.append('treez-text-field')
			.label('Style for variable place holder')			
			.bindValue(this,()=>this.nameExpression);
		
	    sectionContent.append('treez-text-field')
			.label('Style for value and unit injection')			
			.bindValue(this,()=>this.valueExpression);

	    sectionContent.append('treez-file-path')
	    	.label('Input file to generate')	    	
	    	.onChange(()=>this.refreshStatus())	
	    	.nodeAttr('pathMapProvider', this)
	    	.bindValue(this,()=>this.inputPath);

	    sectionContent.append('treez-check-box')
			.label('Delete template rows with unassigned variable place holders.')
			.bindValue(this,()=>this.isDeletingUnassignedRows);	    
	    
	}

	

	__createStatusSection(page) {
		
		const section = page.append('treez-section')
        	.label('Status')
        	.attr('open',false);

		var sectionContent = section.append('div'); 
		
		sectionContent.append('treez-text-area')
			.label('Resulting input file path')
			.disable() 
			.bindValue(this, ()=>this.__inputPathInfo);	
		
		this.refreshStatus();

	}

	refreshStatus() {			
		this.__inputPathInfo = this.__getModifiedInputPath();	
	}
	
	__getModifiedInputPath(){
		var inputModification = null;
		try{
			inputModification = this.childByClass(InputModification);
		} catch(error){			
		}		
		
		return inputModification
			?inputModification.getModifiedPath(this)
			:this.fullPath(this.inputPath);
	}

		
	

	__applyTemplateToSourceModel(templateString, sourceModel) {

		var self=this;

		var resultString = templateString;

		var variables = sourceModel.enabledVariables;
		variables.forEach((variable)=>{
			var variableName = variable.name;
			var valueString = variable.value;			

			var unit = '';
			var isQuantityVariable = variable instanceof QuantityVariable;
			if (isQuantityVariable) {				
				unit = variable.unit;
			}

			var placeholderExpression = self.__createPlaceHolderExpression(variableName);
			
			var injectedExpression = self.__createExpressionToInject(variableName, valueString, unit);

			//inject expression into template
			//console.info('Template placeholder to replace: "' + placeholderExpression + '"');
			//console.info('Expression to inject: "' + injectedExpression + '"');
			resultString = this.__replaceAll(resultString, placeholderExpression, injectedExpression);
		});

		if (self.isDeletingUnassignedRows) {
			resultString = this.__deleteRowsWithUnassignedPlaceHolders(resultString);
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

	__createExpressionToInject(variableName, valueString, unitString) {

		var correctedValueString = valueString;
		if (valueString === null) {
			var message = 'Value for variable "' + variableName + '" is null.';
			console.warn(message);
			correctedValueString = 'null';
		}

		var injectedExpression;
		injectedExpression = this.valueExpression.replace(this.__valueTag, correctedValueString);
		if (unitString != null) {
			injectedExpression = injectedExpression.replace(this.__unitTag, unitString);
		} else {
			//remove unit tag
			injectedExpression = injectedExpression.replace(this.__unitTag, '');
		}
		return injectedExpression;
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
		var generalPlaceHolderExpression = this.nameExpression.replace('{', '\\{');
		generalPlaceHolderExpression = generalPlaceHolderExpression.replace('}', '\\}');
		generalPlaceHolderExpression = generalPlaceHolderExpression.replace('$', '\\$');
		generalPlaceHolderExpression = generalPlaceHolderExpression.replace('<name>', '.*');
		generalPlaceHolderExpression = generalPlaceHolderExpression.replace('<label>', '.*');

		if (generalPlaceHolderExpression === '.*') {
			var message = 'The deletion of rows with unassigned place holders is not yet implemented for place holders'
					+ 'of the type "' + nameExpression
					+ '". Please adapt the name expression or disable the deletion of template rows'
					+ 'with unassigned variable place holders.';
			console.warn(message);
			return resultString;
		}

		var lines = resultString.split('\n');
		var removedLines = [];
		var newLines = [];

		var pattern = Pattern.compile(generalPlaceHolderExpression);

		lines.forEach((line)=>{
			var matcher = pattern.matcher(line);
			var containsUnassignedPlaceHolder = matcher.find();
			if (containsUnassignedPlaceHolder) {
				removedLines.add(line);
			} else {
				newLines.add(line);
			}
		});

		var newResultString = newLines.join('\n');
		if (removedLines.length>0) {
			var message = 'Some rows with unassigned variable place holders have been removed from the input file:\n'
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

}
