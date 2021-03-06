import TableData from '../src/data/database/tableData.js';

export default class JupyterTerminal {

	constructor(jupyter){		
		this.__notebook = jupyter.notebook;
		this.__kernel = this.__notebook.kernel;
	}
	
	async browseFilePath(initialDirectory, initialFile){  

		var pythonCode = '%%python\n' +
						 '# -*- coding: utf-8 -*-\n' +
		                 'import os\n' +
						 'import tkinter\n' +
						 'from tkinter import filedialog\n' +
						 'root = tkinter.Tk()\n' +
						 'root.withdraw() #use to hide tkinter window\n';

		if(!initialFile){
			initialFile = '';
		}

		if(initialDirectory){
			pythonCode +=  'tempdir = filedialog.asksaveasfilename(parent=root, initialdir="' + initialDirectory + '", initialfile = "'+ initialFile +'", title="Browse file path")\n';
		} else {
				pythonCode +=  'tempdir = filedialog.asksaveasfilename(parent=root, title="Browse file path", initialfile = "' + initialFile + '")\n';			
		}

		pythonCode = pythonCode + 'print(tempdir)\n';				

		let path =  await this.executePythonCode(pythonCode, true);		 
		return path.trim();
    }	

   
    async browseDirectoryPath(initialDirectory){   	
		var pythonCode = '%%python\n' +
			'# -*- coding: utf-8 -*-\n' +
			'import os\n' +
			'import tkinter\n' +
			'from tkinter import filedialog\n' +
			'root = tkinter.Tk()\n' +
			'root.withdraw() #use to hide tkinter window\n';

		if(initialDirectory){
			pythonCode +=  'tempdir = filedialog.askdirectory(parent=root, initialdir="' + initialDirectory + '", title="Browse directory path")\n';
		} else {
				pythonCode +=  'tempdir = filedialog.askdirectory(parent=root, title="Browse directory path")\n';			
		}

		pythonCode = pythonCode + 'print(tempdir)\n';
		
		return await this.executePythonCode(pythonCode, true);	
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

	openDirectory(directoryPath, errorHandler, finishedHandler){

		let path = directoryPath.replace(/\//g, "\\");
			
		var pythonCode = '%%python\n' +
						 '# -*- coding: utf-8 -*-\n' +
					     'from subprocess import Popen\n' +		                
                         'Popen(\'cmd /k start ' + path + '\')';	

		this.__executePythonCode(pythonCode, undefined, errorHandler, finishedHandler);		
	}

	async openPath(path, errorHandler, finishedHandler){        
       
        var url = document.URL + '/tree/' + path;
        try{
        	var win = window.open(url, '_blank');
            win.focus();
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

    	new Promise(function(resolve, reject) {  
			    
			var callbacks = {
						shell : {
							reply : (data)=>{
								var content = data.content
								switch(content.status){
									case 'ok':						
										resolve();
										break;
									case 'error':
										reject(content.evalue)
										break;
									default:
										throw new Error('Not yet implemented content status "' + content.status + '"');
								}
								
							},
						},
			            iopub : {
			                 output : (data)=>{	
			                    var content = data.content;
			                    switch(content.name){
			                    	case 'stderr':				                    		
			                    		reject(content.text);
			                    		break;
			                    	case 'stdout':
			                    		if(messageHandler){
			                    			messageHandler(content.text);	
			                    		}			                    		
			                    		break;
			                    	case undefined:
			                    		reject(content.ename + ': ' + content.evalue);	
			                    		break;			                    		
			                    	default:
										throw new Error('Not yet implemented content type "' + content.name + '"');
			                    }
			                    
			                 }
			            },
			            input: (request) => {
			            	throw new Error('Considering user input is not yet implemented.');
			            }
			};
		 	
		 	self.__kernel.execute(pythonCode, callbacks);
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

    	return new Promise(function(resolve, reject) {  
    		
			    
			var callbacks = {
					shell : {
							reply : (data)=>{
								var content = data.content
								switch(content.status){
									case 'ok':			
									   	if(!isExpectingOutput){
									   		resolve();
									   	}										
										break;
									case 'error':
										reject(content.evalue)
										break;
									default:
										throw new Error('Not yet implemented content status "' + content.status + '"');
								}
								
							},
					},
			        iopub : {
			                 output : (data)=>{			                	 
			                	var content = data.content;
			                    switch(content.name){
			                    	case 'stderr':	            		
			                    		reject(content.text);
			                    		break;
			                    	case 'stdout':			                    		
			                    		resolve(content.text);				                    			                    		
			                    		break;				                    		
			                    	case undefined:
			                    		reject(content.ename + ': ' + content.evalue);	
			                    		break;		                    			                    		
			                    	default:
										throw new Error('Not yet implemented content type "' + content.name + '"');
			                    }
			                 }
			        },
			        input: (request) => {
			            	throw new Error('Considering user input is not yet implemented.');
			            }
			};                

		 	self.__kernel.execute(pythonCode, callbacks);
		}); 	
    }
	
	async executePythonCodeWithCell(pythonCode){
	 	
	 	var self=this;

    	return new Promise(function(resolve, reject) {  
    		
			var cell = self.__notebook.insert_cell_below();
			cell.element[0].style.display = 'none';
			cell.set_text(pythonCode);
			cell.events.on('finished_execute.CodeCell', (event, data) => self.__codeCellExecutionFinished(cell, data.cell, resolve));

			try{
				cell.execute();
			} catch(error){
				reject(error);
			} 
    		
		}); 	
    }

    __codeCellExecutionFinished(cell, finishedCell, resolve){
	
		if(finishedCell !== cell){
			return;
		}

		var htmlArray = [];
		
		var outputContainer = cell.output_area.element[0];
		for(var outputArea of outputContainer.children){
			outputArea.children[0].style.display = 'none';	
			outputArea.children[1].style.display = 'none';				
			htmlArray.push(outputArea.innerHTML);
		}	

		var cells = this.__notebook.get_cells();
		var cellIndex = cells.indexOf(finishedCell);

		if(cellIndex>-1){
			this.__notebook.delete_cell(cellIndex);
		}				

		resolve(htmlArray);
		
    }
  
}
