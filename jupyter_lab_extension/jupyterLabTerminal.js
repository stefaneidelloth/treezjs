import TableData from '../src/data/database/tableData.js';

export default class JupyterLabTerminal {

	constructor(app, dependencies){
		this.__app = app;
		this.__dependencies = dependencies;
		this.__notebookPanel = this.__getFirstVisibleNotebookPanel(app);
		//var documentManager = this.__getDocumentManager(app);	
		if(this.__notebookPanel){
			var notebook = this.__notebookPanel.content;
			var notebookModel = notebook.model;
			var sessionContext = this.__notebookPanel.sessionContext;				
			this.__kernel = sessionContext.session.kernel;
		}			
	}
	
	async browseFilePath(initialDirectory, initialFile){

		var FileDialog = this.__dependencies['FileDialog'];
		var documentManager = this.__dependencies['documentManager'];

		const dialog = FileDialog.getOpenFiles({manager: documentManager});
	    const result = await dialog;
		if(result.button.accept){
		  let files = result.value;
		  return files[0].path.trim();
		}
		return null; 
    }	

    async inputDialog(initialValue, title){

		var InputDialog = this.__dependencies['InputDialog'];
		var documentManager = this.__dependencies['documentManager'];
	   
        var options = { 
            title: title,
            text: initialValue
        };
		const dialog = InputDialog.getText(options);
	    const result = await dialog;
		if(result.button.accept){
		  return result.value;		 
		}
		return null; 
    }	

    async browseFile(initialDirectory, initialFile){

    	var FileDialog = this.__dependencies['FileDialog'];
		var documentManager = this.__dependencies['documentManager'];
		const dialog = FileDialog.getOpenFiles({manager: documentManager});
		const result = await dialog;

    	return await new Promise(async (resolve, reject)=>{	
			if(result.button.accept){
			  let files = result.value;
			  let file = files[0];
			  let url = document.URL + '/../files/' + file.path;			 
			  await fetch(url)
				  .then(async (result) => {					 
				      var blob = await result.blob();
					  resolve(blob);
				  })
				  .catch(error =>{
                        reject(error);
				  })
			  
			} else {
				resolve(null);
			}
			
    	});
		
    }	

    async saveBlob(filePath, blob){    	
    	var serviceManager = this.__app.serviceManager;
    	var items = filePath.split('/');
    	var fileName = items.pop();
    	var directoryPath = items.join('/');
    	var extension = fileName.split('.').pop();
    	var options = {
    	  path: directoryPath,
          type: 'file',
          ext: extension,
          name: fileName
    	};

        var blobConversionReader = new FileReader();
        blobConversionReader.onload = async () => {
			var dataUrl = blobConversionReader.result;
			var base64 = dataUrl.split(',')[1];

			var file = await serviceManager.contents.newUntitled(options);
			var tempFilePath = file.path;
			    	
			file.content = base64; 
			file.name = fileName;
			file.path = filePath;
			file.format = 'base64';
			serviceManager.contents.save(filePath, file);
			
            await serviceManager.contents.delete(tempFilePath);  

		};
		blobConversionReader.readAsDataURL(blob); 

			
    }

   
    async browseDirectoryPath(initialDirectory){   	
		var FileDialog = this.__dependencies['FileDialog'];
		var documentManager = this.__dependencies['documentManager'];

        //logs some error to the console due to a Jupyterlab bug
        //also see
        //https://github.com/jupyterlab/jupyterlab/issues/9263
		const dialog = FileDialog.getExistingDirectory({manager: documentManager});
	    const result = await dialog;
		if(result.button.accept){
		  let folders = result.value;
		  return folders[0].path.trim();
		}
		return ''; 	
    }
  

    async readTextFile(filePath){
    	if(!filePath){
    		return null;
    	}

    	filePath = filePath.replace(/\\/g,'\\\\');
    	
		var pythonCode = '%%python\n' +
		    '# -*- coding: utf-8 -*-\n' +
			'file = open("' + filePath + '", "r", encoding="utf-8")\n' +
            'print(file.read())\n';	
		
		return await this.executePythonCode(pythonCode, true);	 
	}
    
    async writeTextFile(filePath, text){

		var textString = this.__escapeSpecialCharacters(text);	

		filePath = filePath.replace(/\\/g,'\\\\');	

		var pythonCode = '%%python\n' +
			'# -*- coding: utf-8 -*-\n' +
			'file = open("' + filePath + '", "w", encoding="utf-8")\n' +
            'file.write("' + textString + '")\n' +
            'file.close()\n';	
		
		return this.executePythonCode(pythonCode, false);
	}

	async downloadTextFile(fileName, text){
		const url = `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`;
        const element = document.createElement('a');
		element.setAttribute('href', url);
		element.setAttribute('download', fileName);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}	

	__escapeSpecialCharacters(text){
		var textWithSlashes = text.replace(/\\/g,'\\\\');
		var textWithLineBreaks =  textWithSlashes.replace(/\r\n/g,'\\n').replace(/\n/g,'\\n').replace(/\r/g,'\\r');
		var textWithQuotationMarks = textWithLineBreaks.replace(/"/g, '\\"');
		return textWithQuotationMarks;
	}

    async deleteFile(filePath){	
		var pythonCode = '%%python\n' +
		    '# -*- coding: utf-8 -*-\n' +
			'import os\n' +
			'if os.path.exists("' + filePath +'"):\n' +
			'    os.remove("' + filePath + '")\n';           
		
		return this.executePythonCode(pythonCode, false);		
	}	
	
	execute(command, messageHandler, errorHandler, finishedHandler){	
			
		var pythonCode = '%%python\n' +
						 '# -*- coding: utf-8 -*-\n' +
		                 'from subprocess import Popen, PIPE, CalledProcessError\n' +
						 'with Popen(\'' + command + '\', stdout=PIPE, bufsize=1, shell=True, encoding="utf8") as process:\n' +
						 '    for line in process.stdout:\n' +
						 '        print(line, end="")\n' +
						 'if process.returncode != 0:\n' +
						 '    raise CalledProcessError(process.returncode, process.args)';

		this.__executePythonCode(pythonCode, messageHandler, errorHandler, finishedHandler);		
	}	

	async openDirectory(directoryPath, errorHandler, finishedHandler){
        var fileBrowser = this.__app.shell.widgets('left').next();
        var fileBrowserModel = fileBrowser.model; 
        await fileBrowserModel.cd(directoryPath);
        this.__app.shell.activateById(fileBrowser.id);
        if(finishedHandler){
        	finishedHandler();
        }        
	}

	async openPath(path, errorHandler, finishedHandler){  

        var url = document.URL + '/tree/' + path;
	    if(!path.includes('.ipynb')){
            url = document.URL + '/../files/' + path;
	    }      
       
        
        try{
    	    window.open(url, '_blank');
        } catch(error){
        	console.error("Could not open path '" + path + "'.\n", error);
        	if(errorHandler){
        		errorHandler(error);
        	}
        }        

        if(finishedHandler){
        	finishedHandler(url);
        }        
	}


	executeWithoutWait(command, messageHandler, errorHandler, finishedHandler){	
			
		
        var pythonCode = '!' + command.replace(/\//g, "\\");
						

		this.__executePythonCode(pythonCode, messageHandler, errorHandler, finishedHandler);		
	}	

	__executePythonCode(pythonCode, messageHandler, errorHandler, finishedHandler){
		var self=this;

    	new Promise(async (resolve, reject) => {  
            //Also see
            //https://jupyter-client.readthedocs.io/en/latest/messaging.html#execute
            //https://github.com/jupyterlab/extension-examples/tree/master/advanced/kernel-messaging
    	    var feature = self.__kernel.requestExecute({ 'code': pythonCode, 'stop_on_error' : true});    	   
    	    feature.onReply(msg=>{
    	    	console.log(msg);
    	    });
    	    feature.onIOPub = (msg) =>{
    	    	var msgType = msg.header.msg_type;
    	    	switch (msgType) {
    	    		case 'status':
    	    		    return;
    	    		case 'execute_input':
    	    		    return;
    	    		case 'stream':
    	    		    var content = msg.content;
    	    		    var type = content.name;
    	    		    switch(type){
    	    		    	case 'stdout':
    	    		    	    var message = content.text;
    	    		    	    if(messageHandler){
									messageHandler(message);
								}	
								break;
    	    		    	case 'stderr':
    	    		    	    var message = content.text;
    	    		    	    if(errorHandler){
									errorHandler(message);
								}					    
								resolve();
								break;
    	    		    	default:
    	    		    	    var message = '[jupyterLabTerminal]: Unknown stream type ' + type;
								if(errorHandler){
									errorHandler(message);
								}					    
								reject();
						} 
						break;   	    		    
    	    		case 'error':
    	    		    /* //already covered by stream stderr
    	    		    var message = msg.content.evalue;
    	    		    if(errorHandler){
					    	errorHandler(message);
					    }					    
						resolve();
						break;
						*/
						return;
					case 'execute_result':
						var result = msg.content;
						if(messageHandler){
						    messageHandler(result);
						}
						resolve();
						break;
					case 'display_data':
						var result = msg.content;
						if(messageHandler){
						    messageHandler(result);
						}						
						break;
					case 'update_display_data':
						var result = msg.content;
						if(messageHandler){
						    messageHandler(result);
						}						
						break;
					default:
					    var message = '[jupyterLabTerminal]: Unknown message type ' + msgType;
					    if(errorHandler){
					    	errorHandler(message);
					    }					    
						reject();

				};
    	    }; 
    	     //await feature.done;   	   		 	
		})
		.catch(errorHandler)
		.then(finishedHandler);		
	}

	do(){

		var connectionString = 'D:/forecast4/trunk/databases/Demo/demo.sqlite';
		var query = 'SELECT * from Calculated_ModelParameter_TimeSeries_Result';

		this.sqLiteQuery(connectionString, query, true).then(
		(result)=>{
			var foo = 1;			
		});
	}


	async sqLiteQuery(connectionString, query, isExpectingOutput) {			

		if(isExpectingOutput){

			var pythonCode = '%%python\n' +
				'# -*- coding: utf-8 -*-\n' +
				'import sqlite3\n' +
				'import pandas\n'	+
				'with sqlite3.connect("' + connectionString + '") as connection:\n' +
            	'    dataFrame = pandas.read_sql_query("' + query + '", connection)\n' +
            	'print(dataFrame.to_csv(sep="|", encoding = "utf-8"))\n';		

			var text = await this.executePythonCode(pythonCode, true)
					.catch(error=>{
						console.error("Could not execute python code.", error);
						throw error;
					});
			return TableData.parseTableTextTo2DArray(text, '|', true);
		} else {

			var pythonCode = '%%python\n' +
				'# -*- coding: utf-8 -*-\n' +
				'import sqlite3\n' +
				'import pandas\n'	+
				'with sqlite3.connect("' + connectionString + '") as connection:\n' +
				'    cursor = connection.cursor()\n' +
				'    cursor.executescript("' + query + '")\n';
			
			return this.executePythonCode(pythonCode, false)
				.catch(error=>{
						console.error("Could not execute python code.", error);
						throw error;
					});;
		}
	}

	async sqLiteQueryTypes(connectionString, query) {

		var pythonCode = '%%python\n'
			+ '# -*- coding: utf-8 -*-\n'
			+ 'import sqlite3\n'
			+ 'import pandas\n'	
			+ 'with sqlite3.connect("' + connectionString + '") as connection:\n'
            + '    dataFrame = pandas.read_sql_query("' + query + '", connection)\n'
            + 'for dtype in dataFrame.dtypes.values:\n'
            + '    print(dtype)\n';		
		
		var text = await this.executePythonCode(pythonCode, true);
		return TableData.parseTableTextTo2DArray(text, ',', false);		
	}
	

	async executePythonCode(pythonCode, isExpectingOutput){
	 	
	 	var self=this;

    	return await new Promise(async (resolve, reject) => {  
            //Also see
            //https://jupyter-client.readthedocs.io/en/latest/messaging.html#execute
            //https://github.com/jupyterlab/extension-examples/tree/master/advanced/kernel-messaging
    	    var feature = self.__kernel.requestExecute({ 'code': pythonCode, 'stop_on_error' : true});
    	    feature.onReply(msg=>{
    	    	console.log(msg);
    	    });
    	    feature.onIOPub = (msg) =>{
    	    	var msgType = msg.header.msg_type;
    	    	switch (msgType) {
    	    		case 'status':
    	    		    return;
    	    		case 'execute_input':
    	    		    return;
    	    		case 'stream':
    	    		    var content = msg.content;
    	    		    var type = content.name;
    	    		    switch(type){
    	    		    	case 'stdout':
    	    		    	    var message = content.text;    	    		    	    
								resolve(message);								
								break;
    	    		    	case 'stderr':
    	    		    	    var message = content.text;    	    		    	    				    
								reject(message);
								break;
    	    		    	default:
    	    		    	    var message = '[jupyterLabTerminal]: Unknown stream type ' + type;												    
								reject(message);
						} 
						break;   	    		    
    	    		case 'error':
    	    		    /* //already covered by stream stderr    	    		   				    
						reject(message);
						break;
						*/
						return;
					case 'execute_result':
						var result = msg.content;						
						resolve(result);						
						break;
					case 'display_data':
						var result = msg.content;
						resolve(result);											
						break;
					case 'update_display_data':
						var result = msg.content;
						resolve(result);											
						break;
					default:
					    var message = '[jupyterLabTerminal]: Unknown message type ' + msgType;					  				    
						reject(message);

				};
    	    }; 		 	
		});	
    }
	
	async executePythonCodeWithCell(pythonCode){
	 	
	 	var self=this;

	 	var NotebookActions = this.__dependencies['NotebookActions'];

    	return new Promise(async (resolve, reject) => {

    		if(self.__notebookPanel){
				var notebook = self.__notebookPanel.content;
				var notebookModel = notebook.model;
				var sessionContext = self.__notebookPanel.sessionContext;	

				var options = {	};
				var cellModel = notebookModel.contentFactory.createCell('code',options);				
				cellModel.value.text = pythonCode;

				const activeCellIndexBackup = notebook.activeCellIndex;

				
				var newCellIndex = notebookModel.cells.length;
				notebookModel.cells.insert(newCellIndex, cellModel);				
				notebook.activeCellIndex = newCellIndex;

				var cell = notebook.activeCell;
				
				try{
					await NotebookActions.run(notebook, sessionContext);
				} catch(error){
					reject(error);
				} 
				
				var htmlArray = [];

				for(var output of cell.outputArea.node.children){								
					htmlArray.push(output.innerHTML);
				}					
			   
			    await NotebookActions.deleteCells(notebook);
				
				notebook.activeCellIndex = activeCellIndexBackup;

				resolve(htmlArray);		

			}				
    		
		}); 	
    }

   

    __tryToGetFirstNotebookCell(app){
		var notebookPanel = __getFirstVisibleNotebookPanel(app);
		if(notebookPanel){
			var notebook = notebookPanel.content;
			if(notebook){
				return notebook.activeCell;
			}
		}	
		return null;
	}

	__getFirstVisibleNotebookPanel(app){
		var mainWidgets = app.shell.widgets('main');
		var widget = mainWidgets.next();
		while(widget){
			var type = widget.constructor.name;
			if(type == 'NotebookPanel'){  //other wigets might be of type DocumentWidget
				if (widget.isVisible){
					return widget;
				}
			}
			widget = mainWidgets.next();
		}
		return null;
	}
  
}
