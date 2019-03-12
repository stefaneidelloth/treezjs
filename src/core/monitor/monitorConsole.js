import LogMessage from './logMessage.js';

export default class MonitorConsole {

		
	constructor(parent) {		
		this.__parent = parent;		
		this.__logMessages = [];	
	}		
		
	info(message){		
		let logMessage = new LogMessage(message, 'info', this.__getStack());
		this.__logMessages.push(logMessage);
		this.__appendLogMessageToParent(logMessage)
	}
	
	warn(message){
		let logMessage = new LogMessage(message, 'warn', this.__getStack());
		this.__logMessages.push(logMessage);
		this.__appendLogMessageToParent(logMessage);	
	}
	
	error(message, error){

		let logMessage = error
			?new LogMessage(message + error.message, 'error', error.stack)
			:new LogMessage(message, 'error', this.__getStack());
		this.__logMessages.push(logMessage);
		this.__appendLogMessageToParent(logMessage);
	}
	
	showMessages(){
		for(var logMessage of this.__logMessages){
			 this.__appendLogMessageToParent(logMessage);
		}			
	}

	__getStack(){
		var stack = new Error().stack
		var lines = stack.split('\n');
		var stackLines = lines.slice(4);
		return stackLines.join('\n');
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
