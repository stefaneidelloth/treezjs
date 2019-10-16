import TableData from './data/database/tableData.js';

export default class StandAloneTerminal {

	constructor(){

		this.__onMessage =  undefined;
		this.__onError =  undefined;
		this.__onFinished = undefined;
		this.__isExecutingQuery = false;		
		
		this.__webSocketPromise = undefined;  			
	}

	get webSocketPromise() {
		if (!this.__webSocketPromise) {
		  this.__webSocketPromise = new Promise((resolve, reject) => {
								  	let webSocket = new WebSocket("ws://localhost:8001/");	
								  	webSocket.onopen = (event)=>this.__webSocketOnOpen(event);
									webSocket.onmessage = (event)=>this.__webSocketOnMessage(event); 
									webSocket.onerror = (event)=>this.__webSocketOnError(event); 							
								  	webSocket.onopen = () => {									
									resolve(webSocket);
								  };
								  webSocket.onerror = error => reject(error);
							});
		}
		return this.__webSocketPromise;
	}
	
	async browseFilePath(initialDirectory){	
      return jQuery.get(this.urlPrefix + '/browseFilePath', initialDirectory);    
    }

    get urlPrefix(){    	
		if(window.treezConfig){
			return window.treezConfig.home;
		}  else {
			return '.';
		}
    }

    async browseDirectoryPath(initialDirectory){   	
      return jQuery.get(this.urlPrefix + '/browseDirectoryPath', initialDirectory);    
    }

    async browseFileOrDirectoryPath(initialDirectory){   	
    	return jQuery.get(this.urlPrefix + '/browseFileOrDirectoryPath', initialDirectory);    
    }

    async readTextFile(filePath){
    	if(!filePath){
    		return null;
    	}
		var dosPath =  this.__replaceForwardWithBackwardSlash(filePath);
		var uri = this.__replaceSpecialCharactersToWorkAsUri(dosPath);
		return jQuery.get(this.urlPrefix + '/readTextFile', uri); 
	}
    
    async writeTextFile(filePath, text){		
		var dosPath =  this.__replaceForwardWithBackwardSlash(filePath);
		var message = dosPath + '<#Separator#>' + text;
		var uri = this.__replaceSpecialCharactersToWorkAsUri(message);
		return jQuery.get(this.urlPrefix + '/writeTextFile', uri);	
	}

    async deleteFile(filePath){
		var dosPath =  this.__replaceForwardWithBackwardSlash(filePath);
		var uri = this.__replaceSpecialCharactersToWorkAsUri(dosPath);
		return jQuery.get(this.urlPrefix + '/deleteFile', uri);			
	}	

	openDirectory(directoryPath, errorHandler, finishedHandler){
		this.executeWithoutWait(directoryPath, undefined, errorHandler, finishedHandler);			
	}


	executeWithoutWait(command, messageHandler, errorHandler, finishedHandler){
		this.__onMessage = messageHandler;
		this.__onError = errorHandler;
		this.__onFinished = finishedHandler;
		this.__send(command + " & exit");
	}
	
	execute(command, messageHandler, errorHandler, finishedHandler){
		this.__onMessage = messageHandler;
		this.__onError = errorHandler;
		this.__onFinished = finishedHandler;
		this.__send(command + " & exit");	
	}	

	async mySqlQuery(connectionString, query, isExpectingOutput) {			

		if(isExpectingOutput){
			
			var self = this;

			return new Promise(function(resolve, reject) { 			    
				self.__onMessage = (message) => {
					
					var tableArray =  TableData.parseTableTextTo2DArray(message, '|');
					resolve(tableArray);
				};
				self.__onError = (message) => reject(message);
				self.__onFinished = () => resolve('MySql query finished.');
				
				self.__sendQuery('mysql:' + connectionString, query);	
			}); 

			throw new Error('Not yet implemented');           

		} else {

			var self = this;

			return new Promise(function(resolve, reject) { 			    
				self.__onMessage = (message) => resolve(message);
				self.__onError = (message) => reject(message);
				self.__onFinished = resolve();
				
				self.__sendQuery("mysql:" + connectionString, query);	
			}); 			
				
		}
	}	

	async sqLiteQuery(connectionString, query, isExpectingOutput) {	
		
		var self = this;

		if(self.__isExecutingQuery){
			throw new Error('There is a running query. Must await previous query before starting a new query.');
		} else {
			self.__isExecutingQuery = query;
		}

		if(isExpectingOutput){			

			return new Promise(function(resolve, reject) { 			    
				self.__onMessage = (message) => {
					
					var tableArray =  TableData.parseTableTextTo2DArray(message, '|');
					resolve(tableArray);
				};
				self.__onError = (message) => {
					self.__isExecutingQuery = false;
					reject(message)
				};

				self.__onFinished = () => {
					self.__isExecutingQuery = false;
					resolve('SqLite query finished.');
				};
				
				self.__sendQuery('sqlite:' + connectionString, query);	
			}); 			      

		} else {

			return new Promise(function(resolve, reject) { 			    
				self.__onMessage = (message) => resolve(message);
				self.__onError = (message) => {
					self.__isExecutingQuery = false;
					reject(message)
				};
				self.__onFinished = () => {
					self.__isExecutingQuery = false;
					resolve();
				};
				
				self.__sendQuery("sqlite:" + connectionString, query);	
			}); 			
				
		}
	}

	__sendQuery(connectionString, query){
		var jsonObject = {
			command: '',
			connectionString: connectionString,
			query: query
		};

		this.webSocketPromise
		  .then( webSocket =>{
		  	webSocket.send(JSON.stringify(jsonObject));
		  })
		  .catch( error => {
		  	console.log("Could not send query to WebSocket:")
		  	console.log(error);
		  });	
	}
	
	__send(command){
		var jsonObject = {
			command: command
		};

		this.webSocketPromise
		  .then( webSocket =>{
		  	webSocket.send(JSON.stringify(jsonObject));
		  })
		  .catch( error => {
		  	console.log("Could not send message to WebSocket:")
		  	console.log(error);
		  });		
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
