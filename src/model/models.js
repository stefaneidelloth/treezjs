import Model from './model.js';

import AddChildAtomTreeViewAction from './../core/treeView/addChildAtomTreeViewAction.js';
import Path from './path/path.js';
import GenericInput from './genericInput/genericInput.js';

import DatabaseModifier from './code/databaseModifier.js';
import FileCleanup from './fileCleanup/fileCleanup.js';
import FileCopy from './fileCopy/fileCopy.js';
import InputFileGenerator from './inputFileGenerator/inputFileGenerator.js';

import Executable from './executable/executable.js';
import JavaExecutable from './executable/javaExecutable.js';

import TableImport from './tableImport/tableImport.js';
import SqLiteAppender from './sqLiteAppender/sqLiteAppender.js';

import RegionsAtomCodeAdaption from './../core/code/regionsAtomCodeAdaption.js';
import JavaScriptModel from './code/javaScriptModel.js';
import PythonModel from './code/pythonModel.js';

export default class Models extends Model {

	constructor(name) {		
		super(name);
		this.isRunnable=true;
		this.image = 'models.png';		
	}	

	createComponentControl(tabFolder){    
	     
		const page = tabFolder.append('treez-tab')
            .label('Data');		

		const section = page.append('treez-section')
        	.label('Models');

        this.createHelpAction(section, 'model/models.md');        
		
		section.append('treez-section-action')
	        .image('resetjobId.png')
	        .label('Reset jobId to 1')
	        .addAction(()=>this.resetJobId());

        section.append('treez-section-action')
            .image('run.png')
            .label('Run models')
            .addAction(()=>this.execute(this.__treeView)
            				   .catch(error => {
            					   	console.error('Could not execute  ' + this.constructor.name + ' "' + this.name + '"!', error);            					   
            				   })
            );   

	    const sectionContent = section.append('div'); 	     

	    sectionContent.append('div')
			.text('This atom represents models.');
	    
	    sectionContent.append('treez-text-area')
	        .label('Next jobId:') 
	        .disable() 
	        .bindValue(this,()=>this.__jobId); 
    }

    

    

	extendContextMenuActions(actions, parentSelection, treeView) {

		actions.push(
			new AddChildAtomTreeViewAction(
				Path,
				'paths',
				'path.png',
				parentSelection,
				this,
				treeView
			)
		);
		
		actions.push(
			new AddChildAtomTreeViewAction(
				GenericInput,
				'genericInput',
				'genericInput.png',
				parentSelection,
				this,
				treeView
			)
		);

		actions.push(
			new AddChildAtomTreeViewAction(
				FileCleanup,
				'fileCleanup',
				'fileCleanup.png',
				parentSelection,
				this,
				treeView
			)
		);

		actions.push(
			new AddChildAtomTreeViewAction(
				FileCopy,
				'fileCopy',
				'fileCopy.png',
				parentSelection,
				this,
				treeView
			)
		);

		actions.push(new AddChildAtomTreeViewAction(
				DatabaseModifier,
				'databaseModifier',
				'databaseModifier.png',
				parentSelection,
				this,
				treeView));	
						
		actions.push(new AddChildAtomTreeViewAction(
				InputFileGenerator,
				'inputFileGenerator',
				'inputFile.png',
				parentSelection,
				this,
				treeView));	
       
		actions.push(
			new AddChildAtomTreeViewAction(
				Executable,
				'executable',
				'run.png',
				parentSelection,
				this,
				treeView
			)
		);		
       
		actions.push(
			new AddChildAtomTreeViewAction(
				JavaExecutable,
				'javaExecutable',
				'java.png',
				parentSelection,
				this,
				treeView
			)
		);

		actions.push(new AddChildAtomTreeViewAction(
				TableImport,
				'tableImport',
				'tableImport.png',
				parentSelection,
				this,
				treeView));

		actions.push(new AddChildAtomTreeViewAction(
				SqLiteAppender,
				'sqLiteAppender',
				'databaseAppender.png',
				parentSelection,
				this,
				treeView));	
		
		actions.push(
			new AddChildAtomTreeViewAction(
				JavaScriptModel,
				'javaSriptModel',
				'javaScript.png',
				parentSelection,
				this,
				treeView
			)
		);

		if(window.treezConfig.isSupportingPython){		
			actions.push(
				new AddChildAtomTreeViewAction(
					PythonModel,
					'pythonModel',
					'python.png',
					parentSelection,
					this,
					treeView
				)
			);
		}

		return actions;
	}

	createCodeAdaption() {
		return new RegionsAtomCodeAdaption(this);
	}

	createPath(name) {
		return this.createChild(Path, name);		
	}

	createGenericInput(name) {
		return this.createChild(GenericInput, name);		
	}

	createDatabaseModifier(name){
    	return this.createChild(DatabaseModifier, name);
    }	

    createFileCleanup(name){
    	return this.createChild(FileCleanup, name);
    }	

    createFileCopy(name){
    	return this.createChild(FileCopy, name);
    }

    createInputFileGenerator(name) {
		return this.createChild(InputFileGenerator, name);		
	}

	createExecutable(name) {
		return this.createChild(Executable, name);
	}

	createJavaExecutable(name) {
		return this.createChild(JavaExecutable, name);
	}

	createTableImport(name) {
		return this.createChild(TableImport, name);
	}

	createSqLiteAppender(name){
    	return this.createChild(SqLiteAppender, name);
    }
	
	createJavaScriptModel(name) {
		return this.createChild(JavaScriptModel, name);
	}
	
	createPythonModel(name) {
		return this.createChild(PythonModel, name);
	}	

}
