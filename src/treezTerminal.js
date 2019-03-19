export default class TreezTerminal {

	constructor(){

		this.__onMessage =  undefined;
		this.__onError =  undefined;
		this.__onFinished = undefined;		
		
		this.__webSocket= new WebSocket("ws://localhost:8001/");    				
		  
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

    async readTextFile(filePath){
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
	
	execute(command, messageHandler, errorHandler, finishedHandler){
		this.__onMessage = messageHandler;
		this.__onError = errorHandler;
		this.__onFinished = finishedHandler;
		this.__send(command + " & exit");		
	}		
	
	__send(command){
		var jsonObject = {
			command: command
		};
		this.__webSocket.send(JSON.stringify(jsonObject));	
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
		
	  var jsonObject = JSON.parse(event.data);
	  
	  if(jsonObject.result){
		  if(this.__onMessage){
				this.__onMessage(jsonObject.result);
			}
	  }
     
      if(jsonObject.error){    	  
    	  if(this.__onError){
  			this.__onError(jsonObject.error);
  		} 
      }
      
      if(jsonObject.finished){    	  
    	  if(this.__onFinished){
  			this.__onFinished();
  		} 
      }      
		 
    }

    __webSocketOnError(event) { 
		if(this.__onError){
			this.__onError(event.data);
		} 
    }
    
   
}
