import Model from './../model.js';
import Executable from './../executable/executable.js';

export default class FileCopy extends Model {   
	

	constructor(name) {		
		super(name);
		this.image = 'fileCleanup.png';
		this.isRunnable = true;

		this.isUsingOutputPathProvider = true;
        
		this.pathOfOutputPathProvider = 'root.models.executable';
		this.fileOrDirectoryPath = 'c:\myOldOutputFile.txt';
        
        this.isOnlyClearingDirectoryInsteadOfDeletingDirectory = true;		       
	}
	

    createComponentControl(tabFolder){    
     
		const page = tabFolder.append('treez-tab')
            .label('Data');

		const section = tab.append('treez-section')
            .label('File cleanup');		

        section.append('treez-section-action')
            .image('run.png')
            .label('Cleanup')
            .addAction(()=>this.execute(this.__treeView)
            				   .catch(error => {
            					   	console.error('Could not execute  ' + this.constructor.name + ' "' + this.name + '"!', error);            					   
            				   })
            );  

        const sectionContent = section.append('div'); 

        sectionContent.append('treez-file-path')
            .label('Executable')           
            .onChange(()=>this.refreshStatus())    
            .nodeAttr('pathMapProvider', this)
            .bindValue(this,()=>this.executablePath); 
		
	}	

	extendContextMenuActions(actions, parentSelection, treeView) {		
		this.treeView=treeView;	
		return actions;
	}

	
    async doRunModel(treeView, monitor) {
    	    	    	
		const startMessage = 'Running ' + this.constructor.name + ' "' + this.name + '".';
		monitor.info(startMessage);
		
		const totalWork = 1;
		monitor.totalWork = totalWork;

		const command = this.__buildCommand();		
		await this.__executeCommand(command, monitor);		
		
		monitor.done();
		
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
					
					if(message.startsWith('WARNING')){
						messageHandler(message);
						return;
					}
					
					const errorTitle = 'Executing system command failed:\n';
					monitor.description = errorTitle;
					monitor.error(errorTitle + message);
					monitor.cancel();
					
					reject(errorTitle+ message);					
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



	__buildCommand(){
		let command = '"' + this.fullPath(this.executablePath) + '"';
		command = this.__addInputArguments(command);
		command = this.__addOutputArguments(command);
		command = this.__addLoggingArguments(command);
		return command;
	}	

}

