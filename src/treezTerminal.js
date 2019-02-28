export default class TreezTerminal {

	constructor(){
		this.__webSocket = null;
		this.__onMessage = null;
		this.__onError = null;
		
		try {
			this.__webSocket= new WebSocket("ws://localhost:8001/");    
		} catch(exception){
			   
		} 		
		  
	    this.__webSocket.onopen = (event)=>this.__webSocketOnOpen(event);
	    this.__webSocket.onmessage = (event)=>this.__webSocketOnMessage(event); 
	    this.__webSocket.onerror = (event)=>this.__webSocketOnError(event); 
			
	}
	
	browseFilePath(initialDirectory, resultHandler){   	
      jQuery.get('browseFilePath', initialDirectory, resultHandler);    
    }

    browseDirectoryPath(initialDirectory, resultHandler){   	
      jQuery.get('browseDirectoryPath', initialDirectory, resultHandler);    
    }

    browseFileOrDirectoryPath(initialDirectory, resultHandler){   	
      jQuery.get('browseFileOrDirectoryPath', initialDirectory, resultHandler);    
    }
	
	execute(command, resultHandler, errorHandler){
		this.__onMessage = resultHandler;
		this.__onError = errorHandler;
		this.__webSocket.send(command);
	}
	
	readTextFile(filePath, resultHandler, errorHandler){
		this.__onMessage = resultHandler;
		this.__onError = errorHandler;
		var dosPath = filePath.replace('/','\\');
		var command = 'type "' + dosPath + '"\n';
		this.__webSocket.send(command);		
	}
	
	writeTextFile(filePath, text, errorHandler){	
				
		this.__onError = errorHandler;
		var lines = text.split('\n');
		var dosPath = filePath.replace('/','\\');
		var redirect = '>';
		lines.forEach((line)=>{
			var command = 'echo ' + line + redirect + '"' + dosPath + '"';
			this.__webSocket.send(command);
			if(redirect === '>'){
				redirect = '>>';
			}					
		});
	
	}

	delete(filePath, errorHandler){
		this.__onError = errorHandler;		

		var deleteCommand = 'IF EXIST "' + filePath + '" DEL /F "' + filePath + '"';
		this.__webSocket.send(deleteCommand); 
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
