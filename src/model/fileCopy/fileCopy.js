import Model from './../model.js';
import Utils from './../../core/utils/utils.js';

export default class FileCopy extends Model {   
	

	constructor(name) {		
		super(name);
		this.image = 'fileCopy.png';
		this.isRunnable = true;

		this.isUsingInputPathProvider = true;	
		this.isUsingOutputPathProvider = true;	
        
		this.pathOfInputPathProvider = 'root.models.executable';	
		this.pathOfOutputPathProvider = 'root.models.executable';			

		this.inputFilePath = 'c:/myInputFile.txt';
		this.outputDirectoryPath = 'c:/outputDirectory';

        this.__pathOfInputPathProviderComponent = undefined;
        this.__pathOfOutputPathProviderComponent = undefined;
        this.__inputFilePathComponent = undefined;
        this.__outputDirectoryPathComponent = undefined;
         	       
	}
	

    createComponentControl(tabFolder){    
     
		const page = tabFolder.append('treez-tab')
            .label('Data');

		const section = page.append('treez-section')
            .label('File copy');

        this.createHelpAction(section, 'model/fileCopy/fileCopy.md');		

        section.append('treez-section-action')
            .image('run.png')
            .label('Copy')
            .addAction(()=>this.execute(this.__treeView)
            				   .catch(error => {
            					   	console.error('Could not execute  ' + this.constructor.name + ' "' + this.name + '"!', error);            					   
            				   })
            );  

        const sectionContent = section.append('div'); 

        sectionContent.append('treez-check-box')
        	.label('Use input path provider')
        	.onChange(()=>this.__updateComponents())
        	.bindValue(this, ()=>this.isUsingInputPathProvider);

        this.__pathOfInputPathProviderComponent = sectionContent.append('treez-model-path')
            .label('Input path provider')           
            .onChange(()=>this.__updateComponents())    
            .nodeAttr('atomFunctionNames', ['provideInputPath'])
            .bindValue(this,()=>this.pathOfInputPathProvider);

        this.__inputFilePathComponent = sectionContent.append('treez-file-path')
            .label('Input file path')   
            .onChange(()=>this.__updateComponents())            
            .bindValue(this,()=>this.inputFilePath); 

       sectionContent.append('treez-check-box')
        	.label('Use output path provider')
        	.onChange(()=>this.__updateComponents())
        	.bindValue(this, ()=>this.isUsingOutputPathProvider);

        this.__pathOfOutputPathProviderComponent = sectionContent.append('treez-model-path')
            .label('Output path provider')           
            .onChange(()=>this.__updateComponents())    
            .nodeAttr('atomFunctionNames', ['providePath'])
            .bindValue(this,()=>this.pathOfOutputPathProvider);

        this.__outputDirectoryPathComponent = sectionContent.append('treez-directory-path')
            .label('Output directory path')   
            .onChange(()=>this.__updateComponents())            
            .bindValue(this,()=>this.outputDirectoryPath); 

        this.__updateComponents();
		
	}	

	extendContextMenuActions(actions, parentSelection, treeView) {		
		this.treeView=treeView;	
		return actions;
	}	

	__updateComponents(){
		if(!this.__outputDirectoryPathComponent){
			return;
		}

		if(this.isUsingInputPathProvider){
			this.__pathOfInputPathProviderComponent.show();
			this.__inputFilePathComponent.disable();
			this.inputFilePath = this.__pathFromInputPathProvider();
		} else {
			this.__pathOfInputPathProviderComponent.hide();
			this.__inputFilePathComponent.enable();
		}

		if(this.isUsingOutputPathProvider){
			this.__pathOfOutputPathProviderComponent.show();
			this.__outputDirectoryPathComponent.disable();
			this.outputDirectoryPath = this.__pathFromOutputPathProvider();
		} else {
			this.__pathOfOutputPathProviderComponent.hide();
			this.__outputDirectoryPathComponent.enable();
		}
		
	};

	__pathFromInputPathProvider(){
		var inputPathProvider = undefined;
		try{
			inputPathProvider = this.childFromRoot(this.pathOfInputPathProvider);
		} catch(error){
			console.warn('Could not find input path provider "' + this.pathOfInputPathProvider + '"');
		}
		
		return inputPathProvider
			?inputPathProvider.provideInputPath()
			:null;		
	}

	__pathFromOutputPathProvider(){
		var outputPathProvider = undefined;
		try {
			outputPathProvider = this.childFromRoot(this.pathOfOutputPathProvider);
		} catch(error){
			console.warn('Could not find output path provider "' + this.pathOfOutputPathProvider + '"');
		}
		
		return outputPathProvider
			?outputPathProvider.providePath()
			:null;		
	}

	
    async doRunModel(treeView, monitor) {
    	    	    	
		const startMessage = 'Running ' + this.constructor.name + ' "' + this.name + '".';
		monitor.info(startMessage);
		
		const totalWork = 1;
		monitor.totalWork = totalWork;	

		var os = await window.treezTerminal.operationSystem();
		switch(os){
			case 'Windows':
			    await this.__windowsCopyFile(monitor);
			    break;
			case 'Linux':
			    await this.__linuxCopyFile(monitor);
			    break;
			default:
			    throw new Error('Not yet implemented for operation system ' + os);
		}			
		
		monitor.done();		
    } 

    async __windowsCopyFile(monitor){
    	const directoryCommand = '(if not exist "' + this.outputPath + '"' +
		                         ' (mkdir "' + this.outputPath + '")' +
		                         ') & cd'; //produces some output, so that command returns
        await this.__executeCommand(directoryCommand, monitor);        

		const copyCommand = this.__buildWindowsCopyCommand();		
		await this.__executeCommand(copyCommand, monitor);	
    }

    __buildWindowsCopyCommand(){ 
        var fileName = Utils.extractFileName(this.inputPath);
    	return  'copy /Y "' + this.inputPath + '" "' + this.outputPath + '\\\\' + fileName + '"';    		
	} 	

    async __linuxCopyFile(monitor){
    	const directoryCommand = '(if not exist "' + this.outputPath + '"' +
		                         ' (mkdir "' + this.outputPath + '")' +
		                         ') & cd'; //produces some output, so that command returns
        await this.__executeCommand(directoryCommand, monitor);        

		const copyCommand = this.__buildLinuxCopyCommand();		
		await this.__executeCommand(copyCommand, monitor);	
    }

    __buildLinuxCopyCommand(){ 
        var fileName = Utils.extractFileName(this.inputPath);
    	return  'cp "' + this.inputPath + '" "' + this.outputPath + '/' + fileName + '"';    		
	}

  
    
    async __executeCommand(command, monitor){

    	var self = this;

    	return await new Promise(async(resolve, reject) => {
	    	try {				
				await window.treezTerminal.execute(command, messageHandler, errorHandler, finishedHandler);

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

	get inputPath(){
		let path = this.isUsingInputPathProvider
			? this.__pathFromInputPathProvider()
			:this.inputFilePath;
		return path.replace(/\//g,'\\\\');			
	}	

	get outputPath(){
		let path = this.isUsingOutputPathProvider
			? this.__pathFromOutputPathProvider()
			:this.outputDirectoryPath;
		return path.replace(/\//g,'\\\\');		
	}

	

}

