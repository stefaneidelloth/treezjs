import Model from './../model.js';
import Utils from './../../core/utils/utils.js';
import DirectoryCleanupMode from './directoryCleanupMode.js';

export default class FileCleanup extends Model {   
	

	constructor(name) {		
		super(name);
		this.image = 'fileCleanup.png';
		this.isRunnable = true;

		this.isUsingPathProvider = false;
        
		this.pathOfPathProvider = 'root.models.executable';
		this.fileOrDirectoryPath = 'c:/myOldOutputFile.txt';
        
        this.mode = DirectoryCleanupMode.deleteFiles;	


        this.__pathOfPathProviderComponent = undefined;
        this.__fileOrDirectoryPathComponent = undefined;
        this.__modeComponent = undefined;	       
	}
	

    createComponentControl(tabFolder){    
     
		const page = tabFolder.append('treez-tab')
            .label('Data');

		const section = page.append('treez-section')
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

        sectionContent.append('treez-check-box')
        	.label('Use path provider')
        	.onChange(()=>this.__updateComponents())
        	.bindValue(this, ()=>this.isUsingPathProvider);

        this.__pathOfPathProviderComponent = sectionContent.append('treez-model-path')
            .label('Path provider')           
            .onChange(()=>this.__updateComponents())    
            .nodeAttr('atomFunctionNames', ['providePath'])
            .bindValue(this,()=>this.pathOfPathProvider);

        this.__fileOrDirectoryPathComponent = sectionContent.append('treez-file-or-directory-path')
            .label('File or directory path')   
            .onChange(()=>this.__updateComponents())            
            .bindValue(this,()=>this.fileOrDirectoryPath); 

       	this.__modeComponent = sectionContent.append('treez-enum-combo-box')
        	.label('Mode')  
        	.nodeAttr('options', DirectoryCleanupMode)          	    	
        	.bindValue(this, ()=>this.mode);

       

        this.__updateComponents();
		
	}	

	extendContextMenuActions(actions, parentSelection, treeView) {		
		this.treeView=treeView;	
		return actions;
	}	

	__updateComponents(){
		if(this.isUsingPathProvider){
			this.__pathOfPathProviderComponent.show();
			this.__fileOrDirectoryPathComponent.disable();
			this.fileOrDirectoryPath = this.__outputPathFromProvider();
		} else {
			this.__pathOfPathProviderComponent.hide();
			this.__fileOrDirectoryPathComponent.enable();
		}

		if(this.isFile){
			this.__modeComponent.hide();
		} else {
			this.__modeComponent.show();
		}
	};

	__outputPathFromProvider(){
		var PathProvider = this.childFromRoot(this.pathOfPathProvider);
		
		return PathProvider
			?PathProvider.providePath()
			:null;		
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

    __buildCommand(){ 
    	var prefix = 'chcp 65001 & '; //enables utf8 encoding to correctly handle umlauts, as ö in "Datei wurde gelöscht - D:\outputDir\foo.txt"
        if(this.isFile){
			var filePath = this.path;
			return prefix + this.__buildFileCleanupCommand(this.path);
        } else {
        	return prefix +this.__buildDirectoryCleanupCommand(this.path);        	
        }		
	} 

	__buildFileCleanupCommand(filePath){
		return 'del "' + filePath + '"';
	}

	__buildDirectoryCleanupCommand(directoryPath){
		switch(this.mode){
			case DirectoryCleanupMode.deleteFiles:
				return 'del /S /Q "' + directoryPath + '\\*.*"';
			case DirectoryCleanupMode.deleteDirectory:
				return 'IF EXIST "' + directoryPath + '" rmdir /S /Q "' + directoryPath + '"';
			case DirectoryCleanupMode.deleteFilesAndSubDirectories:
				return 'del /S /Q "' + directoryPath + '\\*.*" & ' +
				       'for /d %i in ("' + directoryPath + '\\*.*") do @rmdir /S /Q "%i"';
			default:
				throw Error('Not yet implemented');
		}
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

	get path(){
		if(this.isUsingPathProvider){
			var path = this.__outputPathFromProvider();
			return path
				?path.replace(/\//g, '\\\\')
				:'';			
		} else {
			return this.fileOrDirectoryPath.replace(/\//g, '\\\\');
		}		
	}	

	get isFile(){
		if(!this.path){
			return true;
		}
		return Utils.isFilePath(this.path);
	}

}

