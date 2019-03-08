import LogMessage from './logMessage.js';

export default class MonitorConsole {

		
	constructor(parent) {		
		this.__parent = parent;		
		this.__logMessages = [];	
	}		
		
	info(message){		
		let logMessage = new LogMessage(message, 'info', new Error().stack);
		this.__logMessages.push(logMessage);
		this.__appendLogMessageToParent(logMessage)
	}
	
	warn(message){
		let logMessage = new LogMessage(message, 'warn', new Error().stack);
		this.__logMessages.push(logMessage);
		this.__appendLogMessageToParent(logMessage);	
	}
	
	error(message){
		let logMessage = new LogMessage(message, 'error', new Error().stack);
		this.__logMessages.push(logMessage);
		this.__appendLogMessageToParent(logMessage);
	}
	
	showMessages(){
		for(var logMessage of this.__logMessages){
			 self.__appendLogMessageToParent(logMessage);
		}			
	}	
		
	__appendLogMessageToParent(logMessage){
		var multiLineText = this.__replaceLineBreaksWithHtmlBrElements(logMessage.text);
		var entry = this.__parent.append('div') //
			.style('color',logMessage.color)
			.className('treez-titled')			
			.html(multiLineText);
		
		var title = entry.append('div')
			.className('treez-title');

		entry.onMouseOver(()=>{ //this lazily creates the stackTrace ... to not slow down logging.
				title.html(logMessage.stackTrace); 
				entry.onMouseOver(null);
		});
			
	}		
	

	__replaceLineBreaksWithHtmlBrElements(message){
		var result = message.replace(/\r\n/g,'<br>');
		return message.replace(/\n/g,'<br>');
	}
	

}
