import Model from './../model.js';
import AddChildAtomTreeViewAction from './../../core/treeView/addChildAtomTreeViewAction.js';

import OutputModification from './outputModification.js';

export default class JupyterModel extends Model { 	

	constructor(name) {		
		super(name);
		this.image = 'jupyter.png';
		this.isRunnable=true;	
        
		this.inputPath = 'notebook.ipynb';  
        //this.outputPath = '';     
        
        this.treeView=undefined;
	}	

    createComponentControl(tabFolder){    
     
		const page = tabFolder.append('treez-tab')
            .label('Data');

		this.__createInputSection(page); 		
        //this.__createOutputSection(page);       
	}

	providePath() {
		return this.__getModifiedOutputPath();		
	}	

	extendContextMenuActions(actions, parentSelection, treeView) {
				
		this.treeView=treeView;	

		/*
		
		actions.push(new AddChildAtomTreeViewAction(
				OutputModification,
				'outputModification',
				'outputModification.png',
				parentSelection,	
				this,
				treeView));	

		*/

		return actions;
	}	

    async doRunModel(treeView, monitor) {
    	    	    	
		const startMessage = 'Running ' + this.constructor.name + ' "' + this.name + '".';
		monitor.info(startMessage);

		const totalWork = 1;
		monitor.totalWork = totalWork;	
		monitor.description = 'Running notebook.';

		let path = this.inputPath;
		await window.treezTerminal.runNotebook(path)
		.catch(error=>{
			monitor.error(error);
			monitor.cancel();
		});

		monitor.done();
		this.increaseJobId();

		/*	
		const command = this.__buildCommand();
		await this.__executeCommand(command, monitor);		
		*/		
		
    }  
    
    async __executeCommand(command, monitor){

    	var self = this;

    	return await new Promise(function(resolve, reject){
	    	try {				
				window.treezTerminal.execute(command, messageHandler, errorHandler, finishedHandler);

				function messageHandler(message){
					monitor.info(message);
				}						
					
				function errorHandler(message){
					if(message){
						if(message.startsWith('WARNING')){
							messageHandler(message);
							return;
						}
					}
					
					
					const errorTitle = 'Executing system command failed:\n';
					monitor.description = errorTitle;
					monitor.error(errorTitle + message);
					monitor.cancel();
					
					resolve();					
				}

				function finishedHandler(){
					resolve();
				}
				
			} catch (exception) {
				let errorTitle  = 'Could not execute "' + self.name + '"\n';
				monitor.error(errorTitle, exception);
				monitor.cancel();
				reject(errorTitle + exception.toString());
			}	
    	});	
    }   
	

	createOutputModification(name) {
		return this.createChild(OutputModification, name);
	}
	

    __createInputSection(tab) {

		const section = tab.append('treez-section')
            .label('Input'); 

        this.createHelpAction(section, 'model/executable/' + this.atomType + '.md#input');

		section.append('treez-section-action')
	        .image('resetJobId.png')
	        .label('Reset jobId to 1')
	        .addAction(()=>this.resetJobId());

        section.append('treez-section-action')
            .image('run.png')
            .label('Run notebook')
            .addAction(()=>this.execute(this.__treeView)
            				   .catch(error => {
            					   	console.error('Could not execute  ' + this.constructor.name + ' "' + this.name + '"!', error);            					   
            				   })
            );  

        const sectionContent = section.append('div'); 

        sectionContent.append('treez-file-path')
            .label('Path')           
            .onChange(()=>this.refreshStatus())    
            .nodeAttr('pathMapProvider', this)
            .bindValue(this,()=>this.inputPath);            
	}     
   
  
	__createOutputSection(page) {
       const section = page.append('treez-section')
           .label('Output');

       this.createHelpAction(section, 'model/executable/' + this.atomType + '.md#output');

       const sectionContent = section.append('div');       

       sectionContent.append('treez-file-path')
            .label('Path')   
            .nodeAttr('pathMapProvider', this)
            .onChange(()=>this.refreshStatus())           
            .bindValue(this,()=>this.outputPath);
	}  
	

	__buildCommand(){

		let url = document.URL;		
		let path = this.resolvedPath(this.inputPath);	
		let relativePath = this.relativePath(path, url);		

		let command = 'jupyter-nbconvert --to notebook --execute ';
		if(path){			
           command = command + relativePath;
		} 		
		command = this.__addOutputPath(command, relativePath);		
		return command;
		//return 'jupyter-nbconvert --to notebook --execute ../../../../treezjs/demo/model/modelsDemo.ipynb'
		//return 'dir'
	}	
	

	__getModifiedOutputPath() {
		var outputModification = null;
		try{
			outputModification= this.childByClass(OutputModification);
		} catch(error){			
		}
		
		return outputModification
			?outputModification.getModifiedPath(this)
			:this.resolvedPath(this.outputPath);		
	}

	__addOutputPath(commandToExtend, inputPath){

		let command = commandToExtend;		

		command += ' --output-dir .';	

		if (this.outputPath) {
			let url = document.URL;		
			let outputPath = this.relativePath(this.__getModifiedOutputPath(), url);
			command += ' --output ' + outputPath ;
		} else {
			command +=  ' --output ' + inputPath ;
		}
		return command;
	}	

}

