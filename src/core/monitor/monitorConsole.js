import LogMessage from './logMessage.js';

export default class MonitorConsole {
		
	constructor(monitor, parentSelection) {	
		this.__monitor = monitor;
		this.__parentSelection = parentSelection;		
		this.__logMessages = [];	
	}		
		
	info(message){		
		let logMessage = new LogMessage(message, 'info', this.__stack);
		this.__logMessages.push(logMessage);
		this.__appendMessageToParentSelection(logMessage)
	}
	
	warn(message){
		let logMessage = new LogMessage(message, 'warn', this.__stack);
		this.__logMessages.push(logMessage);
		this.__appendMessageToParentSelection(logMessage);	
	}
	
	error(message, error){

		var logMessage;
		if(error){
			if(error.stack){
				logMessage = new LogMessage(message + error.message, 'error', error.stack);
			} else {
				logMessage = new LogMessage(message + '\n' + error, 'error', this.__stack);
			}
			
		} else {
			if(message.stack){
				logMessage = new LogMessage(message.message , 'error', message.stack);
			} else {
				logMessage = new LogMessage(message, 'error', this.__stack);
			}
		}


		this.__logMessages.push(logMessage);
		this.__appendMessageToParentSelection(logMessage);
	}
	
	clear(){
		this.__parentSelection.selectAll('div') //
		 .remove();	
	}
	
	showMessages(){
		this.__parentSelection.selectAll('div') //
					 .remove();		
		
		var messages = this.messagesIncludingChildren;
		var sortedMessages = messages.sort((message, otherMessage)=>{
			return message.time - otherMessage.time;
		});
					 
		for(var message of sortedMessages){
			 this.__appendMessageToParentSelection(message);
		}			
	}
	
	get messagesIncludingChildren(){
		var messages = this.__logMessages;
		for(var subMonitor of this.__monitor.children){
			messages = messages.concat(subMonitor.console.messagesIncludingChildren);
		}
		return messages;
	}

	get __stack(){
		var stack = new Error().stack
		var lines = stack.split('\n');
		var stackLines = lines.slice(4);
		return stackLines.join('\n');
	}	
		
	__appendMessageToParentSelection(logMessage){
		if(logMessage.text){
			var escapedText = this.__escapeTags(logMessage.text);
			var multiLineText = this.__replaceLineBreaksWithHtmlBrElements(escapedText);
			
			var entry = this.__parentSelection.append('div') //
				.style('color',logMessage.color)
				.className('treez-monitor-titled')			
				.html(multiLineText);
		
			var title = entry.append('div')
				.className('treez-monitor-title');

			entry.onMouseOver(()=>{ //this lazily creates the stackTrace ... to not slow down logging.
					title.html(logMessage.stackTrace); 
					entry.onMouseOver(null);
			});
		}
		
			
	}		

	__escapeTags(text){
		return text.replace(/</g,'&lt;').replace(/>/g,'&gt;');
	}

	__replaceLineBreaksWithHtmlBrElements(message){
		var result = message.replace(/\r\n/g,'<br>');
		return message.replace(/\n/g,'<br>');
	}	

}
