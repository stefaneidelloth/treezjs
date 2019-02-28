import Model from "./../model.js";
import Executable from "./../executable/executable.js";
import AddChildAtomTreeViewerAction from './../../core/treeview/addChildAtomTreeViewerAction.js';
import InputModification from './../executable/inputModification.js';
import GenericInput from './../genericInput/genericInput.js';

/**
 * The purpose of this atom is to generate an input text file that can be used as input for other atoms, e.g. the
 * Executable. It reads a template text file and replaces "tags"/"place holders" with Quantities. The filled template is
 * then saved as new input file at the wanted input file path.
 */
export default class InputFileGenerator extends Model  {
	

	constructor(name) {
		if(!name){
			name='inputFileGenerator';
		}
		super(name);
		this.image = 'inputFile.png';
		
		this.nameTag = '<name>';		
		this.valueTag = '<value>';
		this.unitTag = '<unit>';
		
		this.isRunnable=true;
		
		this.templatePath = 'C:/template.txt';       
        
		this.sourceModelPath = 'root.models.genericModel';
        this.nameExpression = '{$' + this.labelTag + '$}';
        this.valueExpression = this.valueTag + ' [' + this.unitTag + ']'; 
        
        this.inputPath = 'C:/generated_input_file.txt';
        this.inputPathInfo = undefined;
        
        this.isDeletingUnassignedRows = undefined;
        
       
	}

	 copy() {
		//TODO
	}
	 
	extendContextMenuActions(actions, parentSelection, treeView) {
			
		this.treeView=treeView;			
		
		const addInputModification = new AddChildAtomTreeViewerAction(
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
	
	createComponentControl(tabFolder, dTreez){    
	     
		const page = tabFolder.append('treez-tab')
            .label('Data');

		this.__createInputSection(page); 	       
        this.__createStatusSection(page);
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
	        ); 
	    
	    var sectionContent = section.append('div'); 

	    sectionContent.append('treez-file-path')
        	.label('Template for input file (contains variable place holders)')        	
        	.bindValue(this,()=>this.templatePath);
        
	    
	    sectionContent.append('treez-model-path')
			.label('Variable source model (provides variables)')		
			.attr('atomclasses',GenericInput.name)
			.bindValue(this,()=>this.sourceModelPath);
	

	    sectionContent.append('treez-text-field')
			.label('Style for variable place holder')			
			.bindValue(this,()=>this.nameExpression);
		
	    sectionContent.append('treez-text-field')
			.label('Style for value and unit injection')			
			.bindValue(this,()=>this.valueExpression);

	    sectionContent.append('treez-file-path')
	    	.label('Input file to generate')	    	
	    	.onChange(()=>this.__refreshStatus())	
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
			.bindValue(this, ()=>this.inputPathInfo);	
		
		this.__refreshStatus();

	}

	__refreshStatus() {			
		this.inputPathInfo = this.__getModifiedInputPath();	
	}
	
	__getModifiedInputPath(){
		var inputModification = null;
		try{
			inputModification = this.getChildByClass(InputModification);
		} catch(error){			
		}		
		
		return inputModification
			?inputModification.getModifiedPath(this)
			:this.inputPath;
	}

	doRunModel(treeView, executableMonitor, finishedHandler){

		console.info("Executing InputFileGenerator '" + this.name + "'");

		var modifiedInputPath = this.__getModifiedInputPath();
				
		//delete old input file if exists
        
		window.treezTerminal.delete(modifiedInputPath, console.error);

        var sourceModelAtom = this.getChildFromRoot(this.sourceModelPath);
		
	
		window.treezTerminal.readTextFile(this.templatePath, processTemplate, console.error);

		function processTemplate(templateString){
			var inputFileString = this.__applyTemplateToSourceModel(templateString, sourceModelAtom);

			if (inputFileString.isEmpty()) {
				var message = 'The input file "' + modifiedInputFilePath
						+ '" is empty. Please check the place holder and the source variables.';
				console.warn(message);
			}

			//save input file
			window.treezTerminal.writeTextFile(modifiedInputPath, inputFileString, console.error);
		}	

		
	}

	

	__applyTemplateToSourceModel(templateString, sourceModel) {

		var resultString = templateString;

		var variables = sourceModel.getEnabledVariables();
		variables.forEach((variable)=>{
			var variableName = variable.name;
			var valueString = variable.value;			

			var unit = "";
			var isQuantityVariable = variable instanceof QuantityVariable;
			if (isQuantityVariable) {				
				unit = variable.unit;
			}

			var placeholderExpression = this.__createPlaceHolderExpression(variableName);

			var injectedExpression = this.__createExpressionToInject(variableName, valueString, unit);

			//inject expression into template
			console.info("Template placeholder to replace: '" + placeholderExpression + "'");
			console.info("Expression to inject: '" + injectedExpression + "'");
			resultString = resultString.replace(placeholderExpression, injectedExpression);
		});

		if (this.isDeletingUnassignedRows) {
			resultString = thsi.__deleteRowsWithUnassignedPlaceHolders(resultString);
		}

		return resultString;
	}

	__createExpressionToInject(variableName, valueString, unitString) {

		var correctedValueString = valueString;
		if (valueString === null) {
			var message = "Value for variable '" + variableName + "' is null.";
			console.warn(message);
			correctedValueString = "null";
		}

		var injectedExpression;
		injectedExpression = valueExpression.replace(this.valueTag, correctedValueString);
		if (unitString != null) {
			injectedExpression = injectedExpression.replace(this.unitTag, unitString);
		} else {
			//remove unit tag
			injectedExpression = injectedExpression.replace(this.unitTag, "");
		}
		return injectedExpression;
	}

	 __createPlaceHolderExpression(variableName) {
		var placeholderExpression;
		var containsName = this.nameExpression.indexOf(this.nameTag) > -1;
		if (containsName) {
			placeholderExpression = this.nameExpression.replace(this.nameTag, variableName);
		} else {
			var message = "The placeholder must contain a " + this.nameTag + " tag.";
				throw new Error(message);
		}
		return placeholderExpression;
	}

	 __deleteRowsWithUnassignedPlaceHolders(resultString) {
		var generalPlaceHolderExpression = this.nameExpression.replace("{", "\\{");
		generalPlaceHolderExpression = generalPlaceHolderExpression.replace("}", "\\}");
		generalPlaceHolderExpression = generalPlaceHolderExpression.replace("$", "\\$");
		generalPlaceHolderExpression = generalPlaceHolderExpression.replace("<name>", ".*");
		generalPlaceHolderExpression = generalPlaceHolderExpression.replace("<label>", ".*");

		if (generalPlaceHolderExpression === ".*") {
			var message = "The deletion of rows with unassigned place holders is not yet implemented for place holders"
					+ "of the type '" + nameExpression
					+ "'. Please adapt the name expression or disable the deletion of template rows"
					+ "with unassigned variable place holders.";
			console.warn(message);
			return resultString;
		}

		var lines = resultString.split("\n");
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

		var newResultString = newLines.join("\n");
		if (removedLines.length>0) {
			var message = "Some rows with unassigned variable place holders have been removed from the input file:\n"
					+ removedLines.join("\n");
			console.info(message);
		}
		return newResultString;
	}

	extendContextMenuActions(actions, treeViewer) {
		return actions;
	}

	createCodeAdaption() {
		return new ComponentAtomCodeAdaption(this);
	}

	getJobId(){
		if(this.parent){
			return this.parent.getJobId();
		} else {
			return '{unknownJobId}';
		}
	}

}
