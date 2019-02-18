export default class TreezTerminal {

	constructor(){
		this.__webSocket = null;
		this.__onMessage = null;
		this.__onError = null;
		
		try {
			this.__webSocket= new WebSocket("ws://localhost:8001/");    
		} catch(exception){
			   
		} 		
		  
	    this.__webSocket.onopen = this.__webSocketOnOpen;
	    this.__webSocket.onmessage = this.__webSocketOnMessage; 
	    this.__webSocket.onerror = this.__webSocketOnError; 
			
	}
	
	browseFilePath(initialDirectory, resultHandler){   	
      jQuery.get('browseFilePath', initialDirectory, resultHandler);    
    }
	
	execute(command, resultHandler, errorHandler){
		this.__onMessage = resultHandler;
		this.__onError = errorHandler;
		this.__webSocket.send(command);
	}

	__webSocketOnOpen(event) { 
		console.log("Opened web socket console");
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
