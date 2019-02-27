export default class MonitorConsole {

		
	constructor(parent) {		
		this.__parent = parent;		
		this.__infoMessages = [];
		this.__warnMessages = [];
		this.__errorMessages = [];
	}		
		
	info(message){
		this.__infoMessages.push(message);
		this.__appendInfoMessageToParent(message)
	}
	
	warn(message){
		this.__warnMessages.push(message);
		this.__appendWarnMessageToParent(message);	
	}
	
	error(message){
		this.__errorMessages.push(message);
		this.__appendErrorMessageToParent(message);
	}
	
	showMessages(){
		var self=this;
		this.__infoMessages.forEach(
				(message)=> self.__appendInfoMessageToParent(message)
		);
		
		this.__warnMessages.forEach(
				(message)=> self.__appendWarnMessageToParent(message)
		);
		
		this.__errorMessages.forEach(
				(message)=> self.__appendErrorMessageToParent(message)
		);		
	}	
		
	__appendInfoMessageToParent(message){
		this.__parent.append('div').html(message);
	}	
		
	__appendWarnMessageToParent(message){
		this.__parent.append('div').html(message);
	}
	
	__appendErrorMessageToParent(message){
		__parent.append('div').html(message);
	}	

}
