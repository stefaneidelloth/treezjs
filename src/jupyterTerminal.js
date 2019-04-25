export default class JupyterTerminal {

	constructor(jupyter){			
		this.__kernel = jupyter.notebook.kernel;
	}
	
	async browseFilePath(initialDirectory){  

		var pythonCode = '%%python\n'
		                + 'import os\n'
						+ 'import tkinter\n'
						+ 'from tkinter import filedialog\n'
						+ 'root = tkinter.Tk()\n'
						+ 'root.withdraw() #use to hide tkinter window\n';

		if(initialDirectory){
			pythonCode +=  'tempdir = filedialog.asksaveasfilename(parent=root, initialdir="' + initialDirectory + '", title="Browse file path")\n';
		} else {
				pythonCode +=  'tempdir = filedialog.asksaveasfilename(parent=root, title="Browse file path")\n';			
		}

		pythonCode = pythonCode + 'print(tempdir)\n';				

		return await this.__executePythonCode(pythonCode, true);		 
    }	

   
    async browseDirectoryPath(initialDirectory){   	
		var pythonCode = '%%python\n'
			+ 'import os\n'
			+ 'import tkinter\n'
			+ 'from tkinter import filedialog\n'
			+ 'root = tkinter.Tk()\n'
			+ 'root.withdraw() #use to hide tkinter window\n';

		if(initialDirectory){
			pythonCode +=  'tempdir = filedialog.askdirectory(parent=root, initialdir="' + initialDirectory + '", title="Browse directory path")\n';
		} else {
				pythonCode +=  'tempdir = filedialog.askdirectory(parent=root, title="Browse directory path")\n';			
		}

		pythonCode = pythonCode + 'print(tempdir)\n';
		
		return await this.__executePythonCode(pythonCode, true);	
    }
  

    async readTextFile(filePath){
		var pythonCode = '%%python\n'
			+ 'file = open("' + filePath + '", "r", encoding="utf-8")\n' 
            + 'print(file.read())\n';	
		
		return await this.__executePythonCode(pythonCode, true);	 
	}
    
    async writeTextFile(filePath, text){

		var textString = this.escapeSpecialCharacters(text);		

		var pythonCode = '%%python\n'
			+ 'file = open("' + filePath + '", "w", encoding="utf-8")\n' 
            + 'file.write("' + textString + '")\n'
            + 'file.close()\n';	
		
		return this.__executePythonCode(pythonCode, false);
	}

	escapeSpecialCharacters(text){
		var textWithSlashes = text.replace(/\\/g,'\\\\');
		var textWithLineBreaks =  textWithSlashes.replace(/\r\n/g,'\\n').replace(/\n/g,'\\n').replace(/\r/g,'\\r');
		var textWithQuotationMarks = textWithLineBreaks.replace(/"/g, '\\"');
		return textWithQuotationMarks;
	}

    async deleteFile(filePath){	
		var pythonCode = '%%python\n'
			+ 'import os\n'
			+ 'if os.path.exists("' + filePath +'"):\n'
			+ '    os.remove("' + filePath + '")\n';           
		
		return this.__executePythonCode(pythonCode, false);		
	}	
	
	execute(command, messageHandler, errorHandler, finishedHandler){		

		var pythonCode = '!' + command;			
		
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
			        }
			};
		 	
		 	self.__kernel.execute(pythonCode, callbacks);
		})
		.catch(errorHandler)
		.then(finishedHandler);		
		
	}	

	 async __executePythonCode(pythonCode, isExpectingOutput){
	 	
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
			        }
			};                

		 	self.__kernel.execute(pythonCode, callbacks);
		}); 	
    }
  
}
