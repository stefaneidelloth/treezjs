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

	__webSocketOnOpen(event) { 
		console.info("Opened web socket console");
    }
	
	__webSocketOnMessage(event) { 
		if(this.__onMessage){
			this.__onMessage(event.data);
		} 
    }

    __webSocketOnError(event) { 
		if(this.__onError){
			this.__onError(event.data);
		} 
    }
    
   
}
