export default class TreezTerminal {

	constructor(){

		this.__ERROR_PREFIX = '#Error: ';
		this.__SUCCEEDED_PREFIX = '#Succeeded';

		this.__webSocket = null;
		this.__onMessage = null;
		this.__onError = null;
		this.__commandPostfix = '<#end#>';
		
		try {
			this.__webSocket= new WebSocket("ws://localhost:8001/");    
		} catch(exception){
			   
		} 		
		  
	    this.__webSocket.onopen = (event)=>this.__webSocketOnOpen(event);
	    this.__webSocket.onmessage = (event)=>this.__webSocketOnMessage(event); 
	    this.__webSocket.onerror = (event)=>this.__webSocketOnError(event); 
			
	}
	
	async browseFilePath(initialDirectory){   	
      return jQuery.get('browseFilePath', initialDirectory);    
    }

    async browseDirectoryPath(initialDirectory){   	
      return jQuery.get('browseDirectoryPath', initialDirectory);    
    }

    async browseFileOrDirectoryPath(initialDirectory){   	
    	return jQuery.get('browseFileOrDirectoryPath', initialDirectory);    
    }

    async readTextFile(filePath, resultHandler){
		var dosPath =  this.__replaceForwardWithBackwardSlash(filePath);
		var uri = this.__replaceSpecialCharactersToWorkAsUri(dosPath);
		return jQuery.get('readTextFile', uri); 
	}
    
    async writeTextFile(filePath, text){		
		var dosPath =  this.__replaceForwardWithBackwardSlash(filePath);
		var message = dosPath + '<#Separator#>' + text;
		var uri = this.__replaceSpecialCharactersToWorkAsUri(message);
		return jQuery.get('writeTextFile', uri);	
	}

    async deleteFile(filePath){
		var dosPath =  this.__replaceForwardWithBackwardSlash(filePath);
		var uri = this.__replaceSpecialCharactersToWorkAsUri(dosPath);
		return jQuery.get('deleteFile', uri);			
	}

	isError(message){
		if(!message){
			return false;
		}
		return message.startsWith(this.__ERROR_PREFIX);
	}
	
	execute(command, resultHandler, errorHandler){
		this.__onMessage = resultHandler;
		this.__onError = errorHandler;
		this.__send(command);		
	}	
	
	
	
	
	
	__send(command){
		this.__webSocket.send(command + this.__commandPostfix);	
	}

	__replaceForwardWithBackwardSlash(command){
		return command.replace(/\//g,'\\');
	}

	__replaceSpecialCharactersToWorkAsUri(command){
		return encodeURIComponent(command);
	}

	__webSocketOnOpen(event) { 
		console.info("Opened web socket console");
    }
	
	__webSocketOnMessage(event) { 


      var isError = event.data.startsWith("Error:");
      if(isError){
			this.__webSocketOnError(event)
      } else {
      	if(this.__onMessage){
			this.__onMessage(event.data);
		}
      }

		 
    }

    __webSocketOnError(event) { 
		if(this.__onError){
			this.__onError(event.data);
		} 
    }
    
   
}
