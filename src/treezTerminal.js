export default class TreezTerminal {

	constructor(){
		this.__webSocket = null;
		this.onMessage = null;
		this.onError = null;
		
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
		window.treezConsole.onMessage = resultHandler;
		window.treezConsole.onError = errorHandler;
		webSocket.send(command);
	}

	__webSocketOnOpen(event) { 
		console.log("Opened web socket console");
    }
	
	__webSocketOnMessage(event) { 
		if(window.treezConsole.onMessage){
			window.treezConsole.onMessage(event.data);
		} 
    }

    __webSocketOnError(event) { 
		if(window.treezConsole.onError){
			window.treezConsole.onError(event.data);
		} 
    }
    
   
}
